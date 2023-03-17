import React from "react";
import { Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import AuthButtons from "./AuthButtons";
import Icons from "./Icons";
// import MenuWrapper from "./ProfileMenu/MenuWrapper";
import AuthModal from "@/components/Modal/Auth/AuthModal";
import UserMenu from "./UserMenu";

type RightContentProps = {
    user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
    return (
        <>
            <AuthModal />
            <Flex justifyContent="space-between" alignItems="center">
                {user ? <Icons /> : <AuthButtons />}
                <UserMenu user={user} />
            </Flex>
        </>
    );
};
export default RightContent;
