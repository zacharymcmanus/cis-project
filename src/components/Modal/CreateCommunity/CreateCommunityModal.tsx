import { auth, firestore } from "@/firebase/clientApp";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Box,
    Divider,
    Text,
    Input,
    Checkbox,
    Stack,
    Flex,
    Icon,
} from "@chakra-ui/react";
import {
    doc,
    getDoc,
    runTransaction,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

type CreateCommunityModalProps = {
    isOpen: boolean;
    handleClose: () => void;
    userId: string;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
    isOpen,
    handleClose,
}) => {
    const [communityName, setCommunityName] = useState("");
    const [charsRemaining, setCharsRemaining] = useState(21);
    const [communityType, setCommunityType] = useState("public");
    const [error, setError] = useState("");
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        // calculate how many chars we have left in the name
        if (event.target.value.length > 21) return;
        setCommunityName(event.target.value);
        setCharsRemaining(21 - event.target.value.length);
    };

    const onCommunityTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCommunityType(event.target.name);
    };

    const handleCreateCommunity = async () => {
        if (error) setError("");
        // validate the community
        const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (format.test(communityName) || communityName.length < 3) {
            setError(
                "Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores."
            );
            return;
        }

        setLoading(true);

        try {
            // create community document and communitySnippet subcollection document on user
            const communityDocRef = doc(
                firestore,
                "communities",
                communityName
            );
            await runTransaction(firestore, async (transaction) => {
                const communityDoc = await transaction.get(
                    communityDocRef
                );
                if (communityDoc.exists()) {
                    throw new Error(
                        `Sorry, /r${name} is taken. Try another.`
                    );
                }

                // create community
                transaction.set(communityDocRef, {
                    creatorId: user?.uid,
                    createdAt: serverTimestamp(),
                    numberOfMembers: 1,
                    privacyType: communityType,
                });

                // create communitysnippet on user
                transaction.set(
                    doc(
                        firestore,
                        `users/${user?.uid}/communitySnippets`,
                        communityName
                    ),
                    {
                        communityId: communityName,
                        isModerator: true,
                    }
                );
            });
        } catch (error: any) {
            console.log("Transaction error", error);
            setError(error.message);
        }

        setLoading(false);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display="flex"
                        flexDirection="column"
                        fontSize={15}
                        padding={3}
                    >
                        Create a section
                    </ModalHeader>
                    <Box pl={3} pr={3}>
                        <Divider />
                        <ModalCloseButton />
                        <ModalBody
                            display="flex"
                            flexDirection="column"
                            padding="10px 0px"
                        >
                            <Text fontWeight={600} fontSize={15}>
                                Name
                            </Text>
                            <Text fontSize={11} color="gray.500">
                                Enter a section name
                            </Text>
                            <Text
                                position="relative"
                                top="28px"
                                color="gray.400"
                                left="10px"
                                width="20px"
                            >
                                s/
                            </Text>
                            <Input
                                pl="22px"
                                position="relative"
                                value={communityName}
                                size="sm"
                                onChange={handleChange}
                            />
                            <Text
                                fontSize="9pt"
                                color={
                                    charsRemaining === 0
                                        ? "red"
                                        : "gray.500"
                                }
                            >
                                {charsRemaining} characters remaining
                            </Text>
                            <Text fontSize="9pt" color="red" pt={1}>
                                {error}
                            </Text>
                            <Box mt={4} mb={4}>
                                <Text fontWeight={600} fontSize={15}>
                                    Section Type
                                </Text>
                                <Stack spacing={2}>
                                    <Checkbox
                                        name="public"
                                        isChecked={
                                            communityType === "public"
                                        }
                                        onChange={
                                            onCommunityTypeChange
                                        }
                                    >
                                        <Flex align="center">
                                            <Icon
                                                as={BsFillEyeFill}
                                                color="gray.500"
                                                mr={2}
                                            />
                                            <Text
                                                fontSize="10pt"
                                                mr={1}
                                            >
                                                Public
                                            </Text>
                                            <Text
                                                fontSize="8pt"
                                                color="gray.500"
                                            >
                                                Anyone can view, post,
                                                and comment to this
                                                group
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                    <Checkbox
                                        name="restricted"
                                        isChecked={
                                            communityType ===
                                            "restricted"
                                        }
                                        onChange={
                                            onCommunityTypeChange
                                        }
                                    >
                                        <Flex align="center">
                                            <Icon
                                                as={BsFillPersonFill}
                                                color="gray.500"
                                                mr={2}
                                            />
                                            <Text
                                                fontSize="10pt"
                                                mr={1}
                                            >
                                                Restricted
                                            </Text>
                                            <Text
                                                fontSize="8pt"
                                                color="gray.500"
                                            >
                                                Anyone can view this
                                                group, but only
                                                approved users can
                                                post
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                    <Checkbox
                                        name="private"
                                        isChecked={
                                            communityType ===
                                            "private"
                                        }
                                        onChange={
                                            onCommunityTypeChange
                                        }
                                    >
                                        <Flex align="center">
                                            <Icon
                                                as={HiLockClosed}
                                                color="gray.500"
                                                mr={2}
                                            />
                                            <Text
                                                fontSize="10pt"
                                                mr={1}
                                            >
                                                Private
                                            </Text>
                                            <Text
                                                fontSize="8pt"
                                                color="gray.500"
                                            >
                                                Only supervisors can
                                                view and submit to
                                                this group
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                </Stack>
                            </Box>
                        </ModalBody>
                    </Box>
                    <ModalFooter
                        bg="gray.100"
                        borderRadius="0px 0px 10px 10px"
                    >
                        <Button
                            variant="outline"
                            mr={3}
                            height="30px"
                            onClick={handleClose}
                            _hover={{
                                bg: "red",
                                border: "1px solid",
                                borderColor: "blue.500",
                                color: "white",
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            height="30px"
                            onClick={handleCreateCommunity}
                            isLoading={loading}
                        >
                            Create section
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export default CreateCommunityModal;
