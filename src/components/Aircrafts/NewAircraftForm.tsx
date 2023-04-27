import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Flex,
    Icon,
    Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import ImageUpload from "./AircraftForm/ImageUpload";
import { Post } from "@/atoms/postsAtom";
import { useRouter } from "next/router";
import {
    addDoc,
    collection,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "@/firebase/clientApp";
import { User } from "firebase/auth";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useSelectFile from "@/hooks/useSelectFile";
import TabItem from "./TabItem";
import TextInput from "./AircraftForm/TextInput";

type NewAircraftFormProps = {
    user: User;
    communityImageURL?: string;
};

const formTabs: TabItem[] = [
    {
        title: "Post",
        icon: IoDocumentText,
    },
    {
        title: "Images",
        icon: IoImageOutline,
    },
];

export type TabItem = {
    title: string;
    icon: typeof Icon.arguments;
};

const NewAircraftForm: React.FC<NewAircraftFormProps> = ({
    user,
    communityImageURL,
}) => {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
    const [textInputs, setTextInputs] = useState({
        tail: "",
        location: "",
        status: "",
    });
    const { selectedFile, setSelectedFile, onSelectFile } =
        useSelectFile();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleCreateAircraft = async () => {
        // const { communityId } = router.query;

        setLoading(true);
        const { tail, location, status } = textInputs;
        try {
            const postDocRef = await addDoc(
                collection(firestore, "aircrafts"),
                {
                    // aircraftId,
                    creatorId: user.uid,
                    tail,
                    location,
                    status,
                    createdAt: serverTimestamp(),
                    editedAt: serverTimestamp(),
                }
            );

            console.log("HERE IS NEW AIRCRAFT ID", postDocRef.id);

            router.back();
        } catch (error) {
            console.log("createPost error", error);
            setError(true);
        }
        setLoading(false);
    };

    const onTextChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const {
            target: { name, value },
        } = event;
        setTextInputs((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Flex direction="column" bg="white" borderRadius={4} mt={2}>
            <Flex width="100%">
                {formTabs.map((item, index) => (
                    <TabItem
                        key={item.title}
                        item={item}
                        selected={item.title === selectedTab}
                        setSelectedTab={setSelectedTab}
                    />
                ))}
            </Flex>
            <Flex padding={4}>
                {selectedTab === "Post" && (
                    <TextInput
                        textInputs={textInputs}
                        handleCreateAircraft={handleCreateAircraft}
                        onChange={onTextChange}
                        loading={loading}
                    />
                )}
                {selectedTab === "Images" && (
                    <ImageUpload
                        selectedFile={selectedFile}
                        onSelectImage={onSelectFile}
                        setSelectedTab={setSelectedTab}
                        setSelectedFile={setSelectedFile}
                    />
                )}
            </Flex>
            {error && (
                <Alert status="error">
                    <AlertIcon />
                    <Text mr={2}>
                        Error creating your post. Try again!
                    </Text>
                </Alert>
            )}
        </Flex>
    );
};
export default NewAircraftForm;
