import { communityState } from "@/atoms/communitiesAtom";
import {
    DirectoryMenuItem,
    DirectoryMenuState,
    defaultMenuItem,
} from "@/atoms/directoryMenuAtom";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { BsFillPersonFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";

const useDirectory = () => {
    const [directoryState, setDirectoryState] = useRecoilState(
        DirectoryMenuState
    );
    const router = useRouter();
    const communityStateValue = useRecoilValue(communityState);

    const toggleMenuOpen = () => {
        setDirectoryState((prev) => ({
            ...prev,
            isOpen: !directoryState.isOpen,
        }));
    };

    const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
        setDirectoryState((prev) => ({
            ...prev,
            selectedMenuItem: menuItem,
        }));
        router.push(menuItem.link);
        if (directoryState.isOpen) {
            toggleMenuOpen();
        }
    };

    // useEffect(() => {
    //     const { community } = router.query;

    //     const existingCommunity =
    //         communityStateValue.visitedCommunities[
    //             community as string
    //         ];

    //     // const existingCommunity =
    //     //     communityStateValue.currentCommunity;

    //     console.log(
    //         "useDirectory.tsx, existingCommunity: ",
    //         communityStateValue
    //     );

    //     if (existingCommunity.id) {
    //         setDirectoryState((prev) => ({
    //             ...prev,
    //             selectedMenuItem: {
    //                 displayText: `s/${existingCommunity.id}`,
    //                 link: `s/${existingCommunity.id}`,
    //                 icon: BsFillPersonFill,
    //                 iconColor: "blue.500",
    //                 imageURL: existingCommunity.imageURL,
    //             },
    //         }));
    //         return;
    //     }
    //     setDirectoryState((prev) => ({
    //         ...prev,
    //         selectedMenuItem: defaultMenuItem,
    //     }));
    // }, [communityStateValue.currentCommunity]);
    return {
        directoryState,
        toggleMenuOpen,
        onSelectMenuItem,
    };
};
export default useDirectory;
