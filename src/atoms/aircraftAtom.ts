import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Aircraft = {
    id: string;
    creatorId: string;
    tail: string;
    location: string;
    status: string;
    imageURL?: string;
    createdAt: Timestamp;
};

interface AircraftState {
    aircrafts: Aircraft[];
    selectedAircraft: Aircraft | null;
}

const defaultAircraftState: AircraftState = {
    selectedAircraft: null,
    aircrafts: [],
};

export const AircraftState = atom<AircraftState>({
    key: "aircraftState",
    default: defaultAircraftState,
});
