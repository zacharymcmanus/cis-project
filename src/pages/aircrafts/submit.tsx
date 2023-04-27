import { communityState } from "@/atoms/communitiesAtom";
import NewAircraftForm from "@/components/Aircrafts/NewAircraftForm";
import PageContent from "@/components/Layout/PageContent";
import { auth } from "@/firebase/clientApp";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

const AircraftPostPage: React.FC = () => {
    const [user] = useAuthState(auth);
    // const communityStateValue = useRecoilValue(communityState);
    // console.log("communityStateValue", communityStateValue);
    return (
        <PageContent>
            <>
                <Box
                    p="14px 0px"
                    borderBottom="1px solid"
                    borderColor="white"
                >
                    <Text>Add a new aircraft</Text>
                </Box>
                {user && <NewAircraftForm user={user} />}
            </>
            <>{/* <About /> */}</>
        </PageContent>
    );
};
export default AircraftPostPage;
