import React, { useState } from "react";
import {
    Alert,
    AlertIcon,
    Flex,
    Icon,
    Image,
    Skeleton,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import moment from "moment";
import { NextRouter } from "next/router";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
    IoArrowDownCircleOutline,
    IoArrowDownCircleSharp,
    IoArrowRedoOutline,
    IoArrowUpCircleOutline,
    IoArrowUpCircleSharp,
    IoBookmarkOutline,
} from "react-icons/io5";

import Link from "next/link";
import { Post } from "@/atoms/postsAtom";

type PostItemProps = {
    post: Post;
    userIsCreator: boolean;
    // userVoteValue: number;
    // onVote: () => {};
    onDeletePost: (post: Post) => Promise<boolean>;
    onSelectPost?: (post: Post) => void;
    homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
    post,
    userIsCreator,
    onDeletePost,
    onSelectPost,
    homePage,
}) => {
    const [loadingImage, setLoadingImage] = useState(true);
    const [error, setError] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const singlePostPage = !onSelectPost;

    // handles error handling within this component
    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            const success = await onDeletePost(post);

            if (!success) {
                throw new Error("failed to delete post");
            }

            console.log("post was successfully deleted");
        } catch (error: any) {
            setError(error.message);
        }
        setLoadingDelete(false);
    };

    return (
        <Flex
            border="1px solid"
            bg="white"
            borderColor={singlePostPage ? "white" : "gray.300"}
            borderRadius={singlePostPage ? "4px 4px 0px 0px " : "4px"}
            _hover={{
                borderColor: singlePostPage ? "none" : "gray.500",
            }}
            cursor={singlePostPage ? "unset" : "pointer"}
            onClick={() => onSelectPost && onSelectPost(post)}
        >
            {/* <Flex
                direction="column"
                align="center"
                bg="gray.100"
                p={2}
                width="40px"
                borderRadius={4}
            >
                <Icon
                    as={
                        userVoteValue === 1
                            ? IoArrowUpCircleSharp
                            : IoArrowUpCircleOutline
                    }
                    color={
                        userVoteValue === 1 ? "brand.100" : "gray.400"
                    }
                    fontSize={22}
                    onClick={onVote}
                    cursor="pointer"
                />
                <Text fontSize="9pt">{post.voteStatus}</Text>
                <Icon
                    as={
                        userVoteValue === -1
                            ? IoArrowDownCircleSharp
                            : IoArrowDownCircleOutline
                    }
                    color={
                        userVoteValue === -1 ? "#4379ff" : "gray.400"
                    }
                    fontSize={22}
                    onClick={onVote}
                    cursor="pointer"
                />
            </Flex> */}
            <Flex direction="column" width="100%">
                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        <Text mr={2}>
                            Error creating your post. Try again!
                        </Text>
                    </Alert>
                )}
                <Stack spacing={1} p="10px">
                    <Stack
                        direction="row"
                        spacing={0.6}
                        align="center"
                        fontSize="9pt"
                    >
                        {/* Home Page Check */}
                        {homePage && (
                            <>
                                {post.communityImageURL ? (
                                    <Image
                                        src={post.communityImageURL}
                                        borderRadius="full"
                                        boxSize="18px"
                                        mr={2}
                                    />
                                ) : (
                                    <Icon
                                        as={FaReddit}
                                        fontSize="18pt"
                                        mr={1}
                                        color="blue.500"
                                    />
                                )}
                                <Link href={`s/${post.communityId}`}>
                                    <Text
                                        fontWeight={700}
                                        _hover={{
                                            textDecoration:
                                                "underline",
                                        }}
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                    >{`s/${post.communityId}`}</Text>
                                </Link>
                                <Icon
                                    as={BsDot}
                                    color="gray.500"
                                    fontSize={8}
                                />
                            </>
                        )}
                        <Text>
                            Posted by u/{post.creatorDisplayName}
                            {moment(
                                new Date(
                                    post.createdAt.seconds * 1000
                                )
                            ).fromNow()}
                        </Text>
                    </Stack>
                    <Text fontSize="12pt" fontWeight={600}>
                        {post.title}
                    </Text>
                    <Text fontSize="10pt">{post.body}</Text>
                    {post.imageURL && (
                        <Flex justify="center" align="center" p={2}>
                            {loadingImage && (
                                <Skeleton
                                    height="200px"
                                    width="100%"
                                    borderRadius={4}
                                />
                            )}
                            <Image
                                src={post.imageURL}
                                alt="postimage"
                                display={
                                    loadingImage ? "none" : "unset"
                                }
                                onLoad={() => setLoadingImage(false)}
                            />
                        </Flex>
                    )}
                </Stack>
                <Flex ml={1} mb={0.5} color="gray.500">
                    <Flex
                        align="center"
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{ bg: "gray.200" }}
                        cursor="pointer"
                    >
                        <Icon as={BsChat} mr={2} />
                        <Text fontSize="9pt">
                            {post.numberOfComments}
                        </Text>
                    </Flex>
                    {userIsCreator && (
                        <Flex
                            align="center"
                            p="8px 10px"
                            borderRadius={4}
                            _hover={{ bg: "gray.200" }}
                            cursor="pointer"
                            onClick={handleDelete}
                        >
                            {loadingDelete ? (
                                <Spinner size="sm" />
                            ) : (
                                <>
                                    <Icon
                                        as={AiOutlineDelete}
                                        mr={2}
                                    />
                                    <Text fontSize="9pt">Delete</Text>
                                </>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};
export default PostItem;
