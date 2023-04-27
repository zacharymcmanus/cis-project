import { authModalState } from "@/atoms/authModalAtom";
// import { Community, communityState } from "@/atoms/communitiesAtom";
import { Aircraft, AircraftState } from "@/atoms/aircraftAtom";
import { Post, postState } from "@/atoms/postsAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import {
    collection,
    deleteDoc,
    doc,
    writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

// hooks extract repeated logic

const useAircrafts = (aircraftData?: Aircraft) => {
    const [user, loadingUser] = useAuthState(auth);
    const [aircraftStateValue, setAircraftStateValue] =
        useRecoilState(AircraftState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    // const communityStateValue = useRecoilValue(communityState);

    const onSelectAircraft = (aircraft: Aircraft) => {
        setAircraftStateValue((prev) => ({
            ...prev,
            selectedAircraft: aircraft,
        }));
        router.push(`/aircrafts`);
    };

    const seeAircrafts = () => {
        console.log("clicked seeAircrafts");
        return router.push(`/aircrafts`);
    };

    // b/c function is anynchronous, we have to wrap the function in a promise
    const onDeleteAircraft = async (
        aircraft: Aircraft
    ): Promise<boolean> => {
        try {
            // check if there's an image
            if (aircraft.imageURL) {
                const imageRef = ref(
                    storage,
                    `aircrafts/${aircraft.id}/image`
                );
                await deleteObject(imageRef);
            }
            // delete post document form firestore
            const postDocRef = doc(firestore, "posts", aircraft.id!);
            await deleteDoc(postDocRef);
            // update recoil state
            setAircraftStateValue((prev) => ({
                ...prev,
                aircraft: prev.aircrafts.filter(
                    (item) => item.id !== aircraft.id
                ),
            }));
        } catch (error) {
            return false;
        }
        return true;
    };

    return {
        aircraftStateValue,
        setAircraftStateValue,
        onSelectAircraft,
        onDeleteAircraft,
        seeAircrafts,
    };
};
export default useAircrafts;
