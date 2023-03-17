import { auth } from "@/firebase/clientApp";
import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Directory from "./Directory/Directory";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
    const [user, loading, error] = useAuthState(auth);
    return (
        <Flex
            bg="white"
            height="44px"
            padding="6px 12px"
            justify={{ md: "space-between" }}
        >
            <Flex
                align="center"
                width={{ base: "40px", md: "auto" }}
                mr={{ base: 0, md: 2 }}
            >
                <Image
                    src="/images/b-2.svg"
                    height="30px"
                    alt="b-2 logo"
                />
                <Image
                    src="/images/notes.svg"
                    height="42px"
                    display={{ base: "none", md: "unset" }}
                    alt="notes logo"
                />
            </Flex>
            {user && <Directory />}
            <SearchInput user={user} />
            <RightContent user={user} />
        </Flex>
    );
};
export default Navbar;
