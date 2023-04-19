import React, { useState } from "react";
import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { GrAdd } from "react-icons/gr";
import { communityState } from "../../../atoms/communitiesAtom";
import { auth } from "../../../firebase/clientApp";
import MenuListItem from "./MenuListItem";
import CreateCommunityModal from "@/components/Modal/CreateCommunity/CreateCommunityModal";
import { IoIosPeople } from "react-icons/io";
import { useRecoilValue } from "recoil";

type CommunitiesProps = {
    menuOpen: boolean;
};

const Communities: React.FC<CommunitiesProps> = ({ menuOpen }) => {
    const [user] = useAuthState(auth);
    const [open, setOpen] = useState(false);
    const mySnippets = useRecoilValue(communityState).mySnippets;
    console.log("mySnippets on Communites.tsx", mySnippets);

    return (
        <>
            <CreateCommunityModal
                isOpen={open}
                handleClose={() => setOpen(false)}
                userId={user?.uid!}
            />

            {mySnippets.find((item) => item.isModerator) && (
                <Box mt={3} mb={4}>
                    <Text
                        pl={3}
                        mb={1}
                        fontSize="7pt"
                        fontWeight={500}
                        color="gray.500"
                    >
                        SUPERVISING
                    </Text>
                    {mySnippets
                        .filter((item) => item.isModerator)
                        .map((snippet) => (
                            <MenuListItem
                                key={snippet.communityId}
                                displayText={`s/${snippet.communityId}`}
                                link={`/s/${snippet.communityId}`}
                                icon={IoIosPeople}
                                iconColor="brand.100"
                            />
                        ))}
                </Box>
            )}
            <Box mt={3} mb={4}>
                <Text
                    pl={3}
                    mb={1}
                    fontSize="7pt"
                    fontWeight={500}
                    color="gray.500"
                >
                    SQUADRON SECTIONS
                </Text>
                <MenuItem
                    width="100%"
                    fontSize="10pt"
                    _hover={{ bg: "gray.100" }}
                    onClick={() => setOpen(true)}
                >
                    <Flex alignItems="center">
                        <Icon fontSize={20} mr={2} as={GrAdd} />
                        CREATE NEW SECTION
                    </Flex>
                </MenuItem>
                {mySnippets.map((snippet) => (
                    <MenuListItem
                        key={snippet.communityId}
                        icon={IoIosPeople}
                        displayText={`s/${snippet.communityId}`}
                        link={`/s/${snippet.communityId}`}
                        iconColor="blue.500"
                        imageURL={snippet.imageURL}
                    />
                ))}
            </Box>
        </>
    );
};

export default Communities;
