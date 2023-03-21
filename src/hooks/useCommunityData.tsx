import { authModalState } from "@/atoms/authModalAtom";
import {
    Community,
    CommunitySnippet,
    communityState,
} from "@/atoms/communitiesAtom";
import { auth, firestore } from "@/firebase/clientApp";
import {
    collection,
    doc,
    getDocs,
    increment,
    writeBatch,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";

const useCommunityData = () => {
    const [user] = useAuthState(auth);
    const [communityStateValue, setCommunityStateValue] =
        useRecoilState(communityState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const setAuthModalState = useSetRecoilState(authModalState);

    const onJoinOrLeaveCommunity = (
        community: Community,
        isJoined?: boolean
    ) => {
        console.log("ON JOIN LEAVE", community.id);

        if (!user) {
            setAuthModalState({ open: true, view: "login" });
            return;
        }

        setLoading(true);
        if (isJoined) {
            leaveCommunity(community.id);
            return;
        }
        joinCommunity(community);
    };

    const getMySnippets = async () => {
        setLoading(true);
        try {
            // get user snippets
            const snippetDocs = await getDocs(
                collection(
                    firestore,
                    `users/${user?.uid}/communitySnippets`
                )
            );

            const snippets = snippetDocs.docs.map((doc) => ({
                ...doc.data(),
            }));
            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: snippets as CommunitySnippet[],
            }));
        } catch (error: any) {
            console.log("get my snippets error: ", error);
            setError(error.message);
        }
        setLoading(false);
    };

    const joinCommunity = async (community: Community) => {
        console.log("JOINING COMMUNITY: ", community.id);
        try {
            const batch = writeBatch(firestore);

            const newSnippet: CommunitySnippet = {
                communityId: community.id,
                imageURL: community.imageURL || "",
            };
            batch.set(
                doc(
                    firestore,
                    `users/${user?.uid}/communitySnippets`,
                    community.id // will for sure have this value at this point
                ),
                newSnippet
            );

            batch.update(
                doc(firestore, "communities", community.id),
                {
                    numberOfMembers: increment(1),
                }
            );

            // perform batch writes
            await batch.commit();

            // Add current community to snippet
            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: [...prev.mySnippets, newSnippet],
            }));
        } catch (error) {
            console.log("joinCommunity error", error);
        }
        setLoading(false);
    };

    const leaveCommunity = async (communityId: string) => {
        console.log("LEAVING COMMUNITY", communityId);
        try {
            const batch = writeBatch(firestore);

            batch.delete(
                doc(
                    firestore,
                    `users/${user?.uid}/communitySnippets/${communityId}`
                )
            );

            batch.update(doc(firestore, "communities", communityId), {
                numberOfMembers: increment(-1),
            });

            await batch.commit();

            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: prev.mySnippets.filter(
                    (item) => item.communityId !== communityId
                ),
            }));
        } catch (error) {
            console.log("leaveCommunity error", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!user) return;
        getMySnippets();
    }, [user]);

    return {
        // data and functions
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading,
    };
};
export default useCommunityData;
