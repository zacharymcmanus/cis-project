import { communityState } from "@/atoms/communitiesAtom";
import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/Posts/NewPostForm";
import { auth } from "@/firebase/clientApp";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

const SubmitPostPage: React.FC = () => {
    const [user] = useAuthState(auth);
    const communityStateValue = useRecoilValue(communityState);
    console.log("communityStateValue", communityStateValue);
    return (
        <PageContent>
            <>
                <Box
                    p="14px 0px"
                    borderBottom="1px solid"
                    borderColor="white"
                >
                    <Text>Create a post</Text>
                </Box>
                {user && (
                    <NewPostForm
                        user={user}
                        communityImageURL={
                            communityStateValue.currentCommunity
                                .imageURL
                        }
                    />
                )}
            </>
            <>{/* <About /> */}</>
        </PageContent>
    );
};
export default SubmitPostPage;
