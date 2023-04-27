import { authModalState } from "@/atoms/authModalAtom";
import { Community, communityState } from "@/atoms/communitiesAtom";
import { Post, postState } from "@/atoms/postsAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import {
    collection,
    deleteDoc,
    doc,
    writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

// hooks extract repeated logic

const usePosts = (communityData?: Community) => {
    const [user, loadingUser] = useAuthState(auth);
    const [postStateValue, setPostStateValue] =
        useRecoilState(postState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const communityStateValue = useRecoilValue(communityState);

    const onSelectPost = (post: Post) => {
        setPostStateValue((prev) => ({
            ...prev,
            selectedPost: post,
        }));
        router.push(`/s/${post.communityId}/comments/${post.id}`);
    };

    // b/c function is anynchronous, we have to wrap the function in a promise
    const onDeletePost = async (post: Post): Promise<boolean> => {
        try {
            // check if there's an image
            if (post.imageURL) {
                const imageRef = ref(
                    storage,
                    `posts/${post.id}/image`
                );
                await deleteObject(imageRef);
            }
            // delete post document form firestore
            const postDocRef = doc(firestore, "posts", post.id!);
            await deleteDoc(postDocRef);
            // update recoil state
            setPostStateValue((prev) => ({
                ...prev,
                posts: prev.posts.filter(
                    (item) => item.id !== post.id
                ),
            }));
        } catch (error) {
            return false;
        }
        return true;
    };

    return {
        postStateValue,
        setPostStateValue,
        // onVote,
        onSelectPost,
        onDeletePost,
    };
};
export default usePosts;
