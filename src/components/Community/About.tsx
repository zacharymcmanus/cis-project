import { Community, communityState } from "@/atoms/communitiesAtom";
import {
    Box,
    Button,
    Divider,
    Flex,
    Icon,
    Stack,
    Text,
    Image,
    Spinner,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { GiAirplaneDeparture } from "react-icons/gi";
import { IoPeopleCircle } from "react-icons/io5";
import moment from "moment";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "@/firebase/clientApp";
import useSelectFile from "@/hooks/useSelectFile";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useSetRecoilState } from "recoil";

type AboutProps = {
    communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
    const [user] = useAuthState(auth);
    const selectedFileRef = useRef<HTMLInputElement>(null);
    const { selectedFile, setSelectedFile, onSelectFile } =
        useSelectFile();
    const [uploadingImage, setUploadingImage] = useState(false);
    const setCommunityStateValue = useSetRecoilState(communityState);

    const onUpdateImage = async () => {
        if (!selectedFile) return;
        setUploadingImage(true);
        try {
            const imageRef = ref(
                storage,
                `communities/${communityData.id}/image`
            );
            await uploadString(imageRef, selectedFile, "data_url");
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(
                doc(firestore, "communities", communityData.id),
                {
                    imageURL: downloadURL,
                }
            );
            setCommunityStateValue((prev) => ({
                ...prev,
                currentCommunity: {
                    ...prev.currentCommunity,
                    imageURL: downloadURL,
                } as Community,
            }));
        } catch (error) {
            console.log("onImageUpdage error", error);
        }
        setUploadingImage(false);
    };

    return (
        <Box position="sticky" top="14px">
            <Flex
                justify="space-between"
                align="center"
                bg="#00338F"
                color="white"
                p={3}
                borderRadius="4px 4px 0px 0px"
            >
                <Text fontSize="10pt" fontWeight={700}>
                    About {communityData.id} Section
                </Text>
                <Icon as={HiOutlineDotsHorizontal} />
            </Flex>
            <Flex
                direction="column"
                p={3}
                bg="white"
                borderRadius="0px 0px 4px 4px"
            >
                <Stack>
                    <Flex
                        width="100%"
                        p={2}
                        fontSize="10pt"
                        fontWeight={700}
                    >
                        <Flex direction="column" flexGrow={1}>
                            <Text>
                                {communityData.numberOfMembers.toLocaleString()}
                            </Text>
                            <Text>Specialists</Text>
                        </Flex>
                        <Flex>
                            <Text>We send sorties!</Text>
                        </Flex>
                    </Flex>
                    <Divider />
                    <Flex
                        align="center"
                        width="100%"
                        p={1}
                        fontWeight={500}
                        fontSize="10pt"
                    >
                        <Icon
                            as={GiAirplaneDeparture}
                            fontSize={18}
                            mr={2}
                        />
                        {communityData.createdAt && (
                            <Text>
                                Created{" "}
                                {moment(
                                    new Date(
                                        communityData.createdAt
                                            .seconds * 1000
                                    )
                                ).format("MMM DD, YYYY")}
                            </Text>
                        )}
                    </Flex>
                    <Link href={`/s/${communityData.id}/submit`}>
                        <Button mt={3} height="30px">
                            Add New Logbook Entry
                        </Button>
                    </Link>
                    {user?.uid === communityData.creatorId && (
                        <>
                            <Divider />
                            <Stack spacing={1} fontSize="10pt">
                                <Text fontWeight={600}>Admin</Text>
                                <Flex
                                    align="center"
                                    justify="space-between"
                                >
                                    <Text
                                        color="blue.500"
                                        cursor="pointer"
                                        _hover={{
                                            textDecoration:
                                                "underline",
                                        }}
                                        onClick={() =>
                                            selectedFileRef.current?.click()
                                        }
                                    >
                                        Change Image
                                    </Text>
                                    {communityData.imageURL ||
                                    selectedFile ? (
                                        <Image
                                            alt="community image"
                                            src={
                                                selectedFile ||
                                                communityData.imageURL
                                            }
                                            borderRadius="full"
                                            boxSize="40px"
                                        />
                                    ) : (
                                        <Icon
                                            as={IoPeopleCircle}
                                            fontSize={40}
                                            color="gray.500"
                                            mr={2}
                                        />
                                    )}
                                </Flex>
                                {selectedFile &&
                                    (uploadingImage ? (
                                        <Spinner />
                                    ) : (
                                        <Text
                                            cursor="pointer"
                                            onClick={onUpdateImage}
                                        >
                                            Save Changes
                                        </Text>
                                    ))}
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/x-png,image/gif,image/jpeg"
                                    hidden
                                    ref={selectedFileRef}
                                    onChange={onSelectFile}
                                />
                            </Stack>
                        </>
                    )}
                </Stack>
            </Flex>
        </Box>
    );
};
export default About;
