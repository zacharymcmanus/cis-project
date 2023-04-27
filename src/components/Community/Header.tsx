import { Community, communityState } from "@/atoms/communitiesAtom";
import {
    Box,
    Flex,
    Text,
    Icon,
    Image,
    Button,
} from "@chakra-ui/react";
import React from "react";
import { FaReddit } from "react-icons/fa";
import { SlNotebook } from "react-icons/sl";
import useCommunityData from "../../hooks/useCommunityData";

// import { getMySnippets } from "../helpers/firestore";

type HeaderProps = {
    communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
    // read from our communitysnippets
    const { communityStateValue, onJoinOrLeaveCommunity, loading } =
        useCommunityData();
    const isJoined = !!communityStateValue.mySnippets.find(
        (item) => item.communityId === communityData.id
    );

    return (
        <Flex direction="column" width="100%" height="146px">
            <Box height="50%" bg="#00338F"></Box>
            <Flex justify="center" bg="white" flexGrow={1}>
                <Flex width="95%" maxWidth="860px">
                    {communityStateValue.currentCommunity
                        ?.imageURL ? (
                        <Image
                            src={
                                communityStateValue.currentCommunity
                                    .imageURL
                            }
                            alt="image"
                            borderRadius="full"
                            boxSize="66px"
                            position="relative"
                            top={-3}
                            color="blue.500"
                            border="4px solid white"
                        />
                    ) : (
                        <Icon
                            as={SlNotebook}
                            fontSize={64}
                            position="relative"
                            top={-3}
                            // color="blue.500"
                            border="4px solid white"
                            borderRadius="50%"
                        />
                    )}
                    <Flex padding="10px 16px">
                        <Flex direction="column" mr={6}>
                            <Text fontWeight={800} fontSize="16pt">
                                {communityData.id}
                            </Text>
                            <Text
                                fontWeight={600}
                                fontSize="10pt"
                                color="gray.400"
                            >
                                {/* s/{communityData.id} */}
                            </Text>
                        </Flex>
                        <Button
                            variant={isJoined ? "outline" : "solid"}
                            height="30px"
                            pr={6}
                            pl={6}
                            isLoading={loading}
                            onClick={() =>
                                onJoinOrLeaveCommunity(
                                    communityData,
                                    isJoined
                                )
                            }
                        >
                            {isJoined ? "Joined" : "Join"}
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};
export default Header;
