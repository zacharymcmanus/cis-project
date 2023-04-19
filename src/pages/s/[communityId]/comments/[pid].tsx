import { postState } from "@/atoms/postsAtom";
import PageContent from "@/components/Layout/PageContent";
import Comments from "@/components/Posts/Comments/Comments";
import PostItem from "@/components/Posts/PostItem";
import { auth } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const PostPage: React.FC = () => {
    const [user] = useAuthState(auth);
    const { postStateValue, setPostStateValue, onDeletePost } =
        usePosts();

    return (
        <PageContent>
            <>
                {postStateValue.selectedPost && (
                    <PostItem
                        post={postStateValue.selectedPost}
                        onDeletePost={onDeletePost}
                        userIsCreator={
                            user?.uid ===
                            postStateValue.selectedPost?.creatorId
                        }
                    />
                )}
                <Comments
                    user={user as User}
                    selectedPost={postStateValue.selectedPost}
                    communityId={
                        postStateValue.selectedPost
                            ?.communityId as string
                    }
                />
            </>
            <></>
        </PageContent>
    );
};
export default PostPage;
