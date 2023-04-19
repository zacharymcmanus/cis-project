import { ComponentStyleConfig } from "@chakra-ui/theme";

export const Button: ComponentStyleConfig = {
    baseStyle: {
        borderRadius: "60px",
        fontSize: "10pt",
        fontWeight: 700,
        _focus: {
            boxShadow: "none",
        },
    },
    sizes: {
        sm: {
            fontSize: "8pt",
        },
        md: {
            fontSize: "10pt",
            // height: "28px",
        },
    },
    variants: {
        solid: {
            color: "white",
            bg: "#B6860A",
            _hover: {
                bg: "#00338F",
            },
        },
        outline: {
            color: "#B6860A",
            border: "1px solid",
            borderColor: "#B6860A",
        },
        oauth: {
            height: "34px",
            border: "1px solid",
            borderColor: "gray.300",
            _hover: {
                bg: "#00338F",
            },
        },
    },
};
