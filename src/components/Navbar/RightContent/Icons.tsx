import React from "react";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Flex, Icon } from "@chakra-ui/react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import {
    IoFilterCircleOutline,
    IoNotificationsOutline,
    IoVideocamOutline,
} from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
// import useDirectory from "../../../hooks/useDirectory";

type ActionIconsProps = {};

const ActionIcons: React.FC<ActionIconsProps> = () => {
    // const { toggleMenuOpen } = useDirectory();
    return (
        <Flex alignItems="center" flexGrow={1}>
            <Box
                display={{ base: "none", md: "flex" }}
                alignItems="center"
                borderRight="1px solid"
                borderColor="gray.200"
            >
                <Flex
                    mr={1.5}
                    ml={1.5}
                    padding={1}
                    cursor="pointer"
                    borderRadius={4}
                    _hover={{ bg: "gray.200" }}
                >
                    <Icon as={SlLocationPin} fontSize={20} />
                </Flex>
                <Flex
                    mr={1.5}
                    ml={1.5}
                    padding={1}
                    cursor="pointer"
                    borderRadius={4}
                    _hover={{ bg: "gray.200" }}
                >
                    <Icon
                        as={IoIosCheckmarkCircleOutline}
                        fontSize={22}
                    />
                </Flex>
            </Box>
            <>
                <Flex
                    mr={1.5}
                    ml={1.5}
                    padding={1}
                    cursor="pointer"
                    borderRadius={4}
                    _hover={{ bg: "gray.200" }}
                >
                    <Icon as={BsChatDots} fontSize={20} />
                </Flex>
                <Flex
                    mr={1.5}
                    ml={1.5}
                    padding={1}
                    cursor="pointer"
                    borderRadius={4}
                    _hover={{ bg: "gray.200" }}
                >
                    <Icon as={IoNotificationsOutline} fontSize={20} />
                </Flex>
                <Flex
                    display={{ base: "none", md: "flex" }}
                    mr={3}
                    ml={1.5}
                    padding={1}
                    cursor="pointer"
                    borderRadius={4}
                    _hover={{ bg: "gray.200" }}
                    // onClick={toggleMenuOpen}
                >
                    <Icon as={GrAdd} fontSize={20} />
                </Flex>
            </>
        </Flex>
    );
};
export default ActionIcons;
