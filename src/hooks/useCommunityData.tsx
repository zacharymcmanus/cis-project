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
    getDoc,
    getDocs,
    increment,
    writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";

const useCommunityData = () => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [communityStateValue, setCommunityStateValue] =
        useRecoilState(communityState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const setAuthModalState = useSetRecoilState(authModalState);

    const onJoinOrLeaveCommunity = (
        community: Community,
        isJoined?: boolean
    ) => {
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
                snippetsFetched: true,
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

    const getCommunityData = async (communityId: string) => {
        try {
            const communityDocRef = doc(
                firestore,
                "communities",
                communityId
            );
            const communityDoc = await getDoc(communityDocRef);

            setCommunityStateValue((prev) => ({
                ...prev,
                currentCommunity: {
                    id: communityDoc.id,
                    ...communityDoc.data(),
                } as Community,
            }));
        } catch (error) {
            console.log("getCommunityData error", error);
        }
    };

    // useEffect(() => {
    //     if (!user) return;
    //     getMySnippets();
    // }, [user]);

    useEffect(() => {
        if (!user) {
            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: [],
                snippetsFetched: false,
            }));
            return;
        }
        getMySnippets();
    }, [user]);

    useEffect(() => {
        const { communityId } = router.query;

        if (communityId && !communityStateValue.currentCommunity) {
            getCommunityData(communityId as string);
        }
    }, [router.query, communityStateValue.currentCommunity]);

    return {
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading,
    };
};
export default useCommunityData;
