import { Community } from "@/atoms/communitiesAtom";
import { Post, postState } from "@/atoms/postsAtom";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import {
    collection,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { join } from "path";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

type PostsProps = {
    communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const {
        postStateValue,
        setPostStateValue,
        // onVote,
        onDeletePost,
        onSelectPost,
    } = usePosts();

    const getPosts = async () => {
        console.log("WE ARE GETTING POSTS!!!");

        setLoading(true);
        try {
            const postsQuery = query(
                collection(firestore, "posts"),
                where("communityId", "==", communityData?.id!),
                orderBy("createdAt", "desc")
            );
            const postDocs = await getDocs(postsQuery);
            const posts = postDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPostStateValue((prev) => ({
                ...prev,
                posts: posts as Post[],
                // postsCache: {
                //   ...prev.postsCache,
                //   [communityData?.id!]: posts as Post[],
                // },
                postUpdateRequired: false,
            }));
        } catch (error: any) {
            console.log("getPosts error", error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        getPosts();
    }, [communityData]);

    return (
        <>
            {loading ? (
                <PostLoader />
            ) : (
                <Stack>
                    {postStateValue.posts.map((post: Post, index) => (
                        <PostItem
                            key={post.id}
                            post={post}
                            // postIdx={index}
                            // onVote={onVote}
                            onDeletePost={onDeletePost}
                            // userVoteValue={
                            //     postStateValue.postVotes.find(
                            //         (item) => item.postId === post.id
                            //     )?.voteValue
                            // }
                            // userVoteValue={0}
                            userIsCreator={
                                user?.uid === post.creatorId
                            }
                            onSelectPost={onSelectPost}
                        />
                    ))}
                </Stack>
            )}
        </>
    );
};
export default Posts;
