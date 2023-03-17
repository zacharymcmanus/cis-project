import { Community } from "../../../atoms/communitiesAtom";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";

type CommunityPageProps = {
    communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({
    communityData,
}) => {
    console.log("here is data", communityData);

    if (!communityData) {
        return <div>that section does not exist</div>;
    }
    return <div>hi</div>;
};

export async function getServerSideProps(
    context: GetServerSidePropsContext
) {
    console.log("GET SERVER SIDE PROPS RUNNING");

    try {
        const communityDocRef = doc(
            firestore,
            "communities",
            context.query.community as string
        );
        const communityDoc = await getDoc(communityDocRef);
        return {
            props: {
                communityData: JSON.parse(
                    safeJsonStringify({
                        id: communityDoc.id,
                        ...communityDoc.data(),
                    })
                ),
            },
        };
    } catch (error) {
        // Could create error page here
        console.log("getServerSideProps error - [community]", error);
        return { props: {} };
    }
}
export default CommunityPage;
