import { communityState } from "@/atoms/communitiesAtom";
import { Post } from "@/atoms/postsAtom";
import CreatePostLink from "@/components/Community/CreatePostLink";
import PageContent from "@/components/Layout/PageContent";
import PostItem from "@/components/Posts/PostItem";
import PostLoader from "@/components/Posts/PostLoader";
import { auth, firestore } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import usePosts from "@/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import {
    collection,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

const Home: NextPage = () => {
    const [user, loadingUser] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    // const communityStateValue = useRecoilValue(communityState);
    const { communityStateValue } = useCommunityData();
    const {
        setPostStateValue,
        postStateValue,
        onSelectPost,
        onDeletePost,
    } = usePosts();

    const buildUserHomeFeed = async () => {
        setLoading(true);
        try {
            // get posts from users' communities
            const myCommunityIds = communityStateValue.mySnippets.map(
                (snippet) => snippet.communityId
            );
            const postQuery = query(
                collection(firestore, "posts"),
                where("communityId", "in", myCommunityIds)
            );
            const postDocs = await getDocs(postQuery);
            const posts = postDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPostStateValue((prev) => ({
                ...prev,
                posts: posts as Post[],
            }));
            if (communityStateValue.mySnippets.length) {
                // get posts from users' commmunities
            } else {
                buildNoUserHomeFeed();
            }
        } catch (error) {
            console.log("buildUserHomeFeed error", error);
        }
        setLoading(false);
    };

    const buildNoUserHomeFeed = async () => {
        setLoading(true);
        try {
            const postQuery = query(collection(firestore, "posts"));
            const postDocs = await getDocs(postQuery);
            const posts = postDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPostStateValue((prev) => ({
                ...prev,
                posts: posts as Post[],
            }));
        } catch (error) {
            console.log("buildNoUserHomeFeed error", error);
        }
        setLoading(false);
    };

    // useEffects
    useEffect(() => {
        if (communityStateValue.snippetsFetched) buildUserHomeFeed();
    }, [communityStateValue.snippetsFetched]);

    useEffect(() => {
        if (!user && !loadingUser) buildNoUserHomeFeed();
    }, [user, loadingUser]);

    return (
        <PageContent>
            <>
                <CreatePostLink />
                {loading ? (
                    <PostLoader />
                ) : (
                    <Stack>
                        {postStateValue.posts.map((post) => (
                            <PostItem
                                key={post.id}
                                post={post}
                                onSelectPost={onSelectPost}
                                onDeletePost={onDeletePost}
                                userIsCreator={
                                    user?.uid === post.creatorId
                                }
                                homePage
                            />
                        ))}
                    </Stack>
                )}
            </>
            <>{/* <Recommendations /> */}</>
        </PageContent>
    );
};

export default Home;
