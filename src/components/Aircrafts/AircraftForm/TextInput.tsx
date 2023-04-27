import {
    Stack,
    Input,
    Textarea,
    Flex,
    Button,
} from "@chakra-ui/react";
import React from "react";

type TextInputProps = {
    textInputs: {
        tail: string;
        location: string;
        status: string;
    };
    onChange: (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => void;
    handleCreateAircraft: () => void;
    loading: boolean;
};

const TextInput: React.FC<TextInputProps> = ({
    textInputs,
    onChange,
    handleCreateAircraft,
    loading,
}) => {
    return (
        <Stack spacing={3} width="100%">
            <Input
                name="tail"
                value={textInputs.tail}
                onChange={onChange}
                fontSize="10pt"
                borderRadius={4}
                placeholder="Tail Number"
                _placeholder={{ color: "gray.500" }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "black",
                }}
            />
            <Input
                name="location"
                value={textInputs.location}
                onChange={onChange}
                fontSize="10pt"
                borderRadius={4}
                placeholder="Aircraft Location"
                _placeholder={{ color: "gray.500" }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "black",
                }}
            />
            <Input
                name="status"
                value={textInputs.status}
                onChange={onChange}
                fontSize="10pt"
                borderRadius={4}
                placeholder="Status"
                _placeholder={{ color: "gray.500" }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "black",
                }}
            />
            <Flex justify="flex-end">
                <Button
                    height="34px"
                    padding="0px 30px"
                    disabled={!textInputs.status}
                    isLoading={false}
                    onClick={handleCreateAircraft}
                >
                    Post
                </Button>
            </Flex>
        </Stack>
    );
};
export default TextInput;
