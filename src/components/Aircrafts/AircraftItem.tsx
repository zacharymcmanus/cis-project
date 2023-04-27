import React, { useState } from "react";
import {
    Alert,
    AlertIcon,
    Flex,
    Icon,
    Image,
    Skeleton,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import moment from "moment";
import { NextRouter } from "next/router";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import {
    IoArrowDownCircleOutline,
    IoArrowDownCircleSharp,
    IoArrowRedoOutline,
    IoArrowUpCircleOutline,
    IoArrowUpCircleSharp,
    IoBookmarkOutline,
} from "react-icons/io5";

import Link from "next/link";
import { Aircraft } from "@/atoms/aircraftAtom";
import { GiCommercialAirplane } from "react-icons/gi";

type AircraftItemProps = {
    aircraft: Aircraft;
    userIsCreator: boolean;
    onDeleteAircraft: (aircraft: Aircraft) => Promise<boolean>;
    onSelectAircraft?: (aircraft: Aircraft) => void;
    homePage?: boolean;
};

const AircraftItem: React.FC<AircraftItemProps> = ({
    aircraft,
    userIsCreator,
    onDeleteAircraft,
    onSelectAircraft,
    homePage,
}) => {
    const [loadingImage, setLoadingImage] = useState(true);
    const [error, setError] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const singleAircraftPage = !onSelectAircraft;

    // handles error handling within this component
    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            const success = await onDeleteAircraft(aircraft);

            if (!success) {
                throw new Error("failed to delete aircraft");
            }

            console.log("aircraft was successfully deleted");
        } catch (error: any) {
            setError(error.message);
        }
        setLoadingDelete(false);
    };

    return (
        <Flex
            border="1px solid"
            bg="white"
            borderColor={singleAircraftPage ? "white" : "gray.300"}
            borderRadius={
                singleAircraftPage ? "4px 4px 0px 0px " : "4px"
            }
            _hover={{
                borderColor: singleAircraftPage ? "none" : "gray.500",
            }}
            cursor={singleAircraftPage ? "unset" : "pointer"}
            onClick={() =>
                onSelectAircraft && onSelectAircraft(aircraft)
            }
        >
            <Flex direction="column" width="100%">
                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        <Text mr={2}>
                            Error creating your post. Try again!
                        </Text>
                    </Alert>
                )}
                <Stack spacing={1} p="10px">
                    <Stack
                        direction="row"
                        spacing={0.6}
                        align="center"
                        fontSize="9pt"
                    >
                        {/* Home Page Check */}
                        {homePage && (
                            <>
                                {aircraft.communityImageURL ? (
                                    <Image
                                        src={
                                            aircraft.communityImageURL
                                        }
                                        borderRadius="full"
                                        boxSize="18px"
                                        mr={2}
                                    />
                                ) : (
                                    <Icon
                                        as={GiCommercialAirplane}
                                        fontSize="18pt"
                                        mr={1}
                                        color="blue.500"
                                    />
                                )}
                                <Link
                                    href={`s/${aircraft.communityId}`}
                                >
                                    <Text
                                        fontWeight={700}
                                        _hover={{
                                            textDecoration:
                                                "underline",
                                        }}
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                    >{`s/${aircraft.communityId}`}</Text>
                                </Link>
                                <Icon
                                    as={BsDot}
                                    color="gray.500"
                                    fontSize={8}
                                />
                            </>
                        )}
                        {/* <Text>
                            created by u/
                            {aircraft.creatorId}
                            {moment(
                                new Date(
                                    aircraft.createdAt.seconds * 1000
                                )
                            ).fromNow()}
                        </Text> */}
                    </Stack>
                    <Text fontSize="12pt" fontWeight={600}>
                        Aircraft: {aircraft.tail}
                    </Text>
                    <Text fontSize="10pt">
                        Location: {aircraft.location}
                    </Text>
                    <Text fontSize="10pt">
                        Mission Status: {aircraft.status}
                    </Text>
                    {aircraft.imageURL && (
                        <Flex justify="center" align="center" p={2}>
                            {loadingImage && (
                                <Skeleton
                                    height="200px"
                                    width="100%"
                                    borderRadius={4}
                                />
                            )}
                            <Image
                                src={aircraft.imageURL}
                                alt="aircraftimage"
                                display={
                                    loadingImage ? "none" : "unset"
                                }
                                onLoad={() => setLoadingImage(false)}
                            />
                        </Flex>
                    )}
                </Stack>
                <Flex ml={1} mb={0.5} color="gray.500">
                    <Flex
                        align="center"
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{ bg: "gray.200" }}
                        cursor="pointer"
                    >
                        {/* <Icon as={BsChat} mr={2} />
                        <Text fontSize="9pt">
                            {aircraft.numberOfComments}
                        </Text> */}
                    </Flex>
                    {userIsCreator && (
                        <Flex
                            align="space-between"
                            p="8px 10px"
                            borderRadius={4}
                            _hover={{ bg: "gray.200" }}
                            cursor="pointer"
                            onClick={handleDelete}
                        >
                            {loadingDelete ? (
                                <Spinner size="sm" />
                            ) : (
                                <>
                                    <Icon as={AiOutlineEdit} mr={2} />
                                    <Text fontSize="9pt" mr={2}>
                                        Update Aircraft
                                    </Text>
                                    <Icon
                                        as={AiOutlineDelete}
                                        mr={2}
                                    />
                                    <Text fontSize="9pt">Delete</Text>
                                </>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};
export default AircraftItem;
