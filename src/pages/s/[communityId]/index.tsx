import { Community } from "../../../atoms/communitiesAtom";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";
import CommunityNotFound from "@/components/Community/CommunityNotFound";
import Header from "@/components/Community/Header";
import PageContent from "@/components/Layout/PageContent";

type CommunityPageProps = {
    communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({
    communityData,
}) => {
    console.log("here is data", communityData);

    if (!communityData.id) {
        return <CommunityNotFound />;
    }
    return (
        <>
            <Header communityData={communityData} />
            <PageContent>
                <>
                    <div>LHS</div>
                </>
                <>
                    <div>RHS</div>
                </>
            </PageContent>
        </>
    );
};

export async function getServerSideProps(
    context: GetServerSidePropsContext
) {
    console.log("GET SERVER SIDE PROPS RUNNING");

    try {
        const communityDocRef = doc(
            firestore,
            "communities",
            context.query.communityId as string
        );
        const communityDoc = await getDoc(communityDocRef);
        return {
            props: {
                communityData: communityDoc.exists()
                    ? JSON.parse(
                          safeJsonStringify({
                              id: communityDoc.id,
                              ...communityDoc.data(),
                          })
                      )
                    : "",
            },
        };
    } catch (error) {
        // Could create error page here
        console.log("getServerSideProps error - [community]", error);
        return { props: {} };
    }
}
export default CommunityPage;
