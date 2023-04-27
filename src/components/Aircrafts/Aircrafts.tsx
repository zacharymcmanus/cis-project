import { Aircraft, AircraftState } from "@/atoms/aircraftAtom";
import { auth, firestore } from "@/firebase/clientApp";
import useAircrafts from "@/hooks/useAircrafts";
import { Stack } from "@chakra-ui/react";
import {
    collection,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { join } from "path";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AircraftItem from "./AircraftItem";
// import PostItem from "./PostItem";
import AircraftLoader from "./AircraftLoader";

type AircraftsProps = {
    aircraftData: Aircraft;
};

const Aircrafts: React.FC<AircraftsProps> = ({ aircraftData }) => {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const {
        aircraftStateValue,
        setAircraftStateValue,
        onDeleteAircraft,
        onSelectAircraft,
    } = useAircrafts();

    const getAircrafts = async () => {
        console.log("WE ARE GETTING Aircrafts!!!");

        setLoading(true);
        try {
            const aircraftsQuery = query(
                collection(firestore, "aircrafts"),
                // where("communityId", "==", communityData?.id!),
                orderBy("createdAt", "desc")
            );
            const postDocs = await getDocs(aircraftsQuery);
            const aircrafts = postDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAircraftStateValue((prev) => ({
                ...prev,
                aircrafts: aircrafts as Aircraft[],
                postUpdateRequired: false,
            }));
        } catch (error: any) {
            console.log("getAircrafts error", error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        getAircrafts();
    }, [aircraftData]);

    return (
        <>
            {loading ? (
                <AircraftLoader />
            ) : (
                <Stack>
                    {aircraftStateValue.aircrafts.map(
                        (aircraft: Aircraft, index) => (
                            <AircraftItem
                                key={aircraft.id}
                                aircraft={aircraft}
                                onDeleteAircraft={onDeleteAircraft}
                                userIsCreator={
                                    user?.uid === aircraft.creatorId
                                }
                                onSelectAircraft={onSelectAircraft}
                            />
                        )
                    )}
                </Stack>
            )}
        </>
    );
};
export default Aircrafts;
