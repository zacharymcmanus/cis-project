import { Flex, Icon, Input } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BsLink45Deg } from "react-icons/bs";
import { BsJournalPlus } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";

type CreateAircraftProps = {};

const CreateAircraftLink: React.FC<CreateAircraftProps> = () => {
    const router = useRouter();
    const [user] = useAuthState(auth);

    const onClick = () => {
        // const { aircraft } = router.query;
        router.push("/aircrafts/submit");
        // if (aircraft) {
        //     router.push("/aircrafts/submit");
        //     return;
        // }
    };
    return (
        <Flex
            justify="space-evenly"
            align="center"
            bg="white"
            height="56px"
            borderRadius={4}
            border="1px solid"
            borderColor="gray.300"
            p={2}
            mb={4}
        >
            <Icon
                as={BsJournalPlus}
                fontSize={36}
                color="gray.300"
                mr={4}
            />
            <Input
                placeholder="Add aircraft"
                fontSize="10pt"
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
                borderColor="gray.200"
                height="36px"
                borderRadius={4}
                mr={4}
                onClick={onClick}
            />
            <Icon
                as={IoImageOutline}
                fontSize={24}
                mr={4}
                color="gray.400"
                cursor="pointer"
            />
            <Icon
                as={BsLink45Deg}
                fontSize={24}
                color="gray.400"
                cursor="pointer"
            />
        </Flex>
    );
};
export default CreateAircraftLink;
