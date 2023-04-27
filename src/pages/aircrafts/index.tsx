import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import safeJsonStringify from "safe-json-stringify";
import Header from "@/components/Community/Header";
import PageContent from "@/components/Layout/PageContent";
import CreatePostLink from "@/components/Community/CreatePostLink";
import Aircrafts from "@/components/Aircrafts/Aircrafts";
import { RecoilState, useRecoilState } from "recoil";
import About from "@/components/Community/About";
import useCommunityData from "@/hooks/useCommunityData";
import CreateAircraftLink from "@/components/Aircrafts/CreateAircraftLink";
import { Aircraft } from "@/atoms/aircraftAtom";

type AircraftPageProps = {
    aircraftData: Aircraft;
};

const AircraftPage: React.FC<AircraftPageProps> = ({
    aircraftData,
}) => {
    // const [communityStateValue, setCommunityStateValue] =
    //     useRecoilState(communityState);

    // useEffect(() => {
    //     setCommunityStateValue((prev) => ({
    //         ...prev,
    //         currentCommunity: communityData,
    //     }));
    // }, [communityData]);

    // if (!communityData.id) {
    //     return <CommunityNotFound />;
    // }

    return (
        <>
            <PageContent>
                <>
                    <CreateAircraftLink />
                    <Aircrafts aircraftData={aircraftData} />
                </>
                <></>
            </PageContent>
        </>
    );
};

// export async function getServerSideProps(
//     context: GetServerSidePropsContext
// ) {
//     try {
//         const communityDocRef = doc(
//             firestore,
//             "communities",
//             context.query.communityId as string
//         );
//         const communityDoc = await getDoc(communityDocRef);
//         return {
//             props: {
//                 communityData: communityDoc.exists()
//                     ? JSON.parse(
//                           safeJsonStringify({
//                               id: communityDoc.id,
//                               ...communityDoc.data(),
//                           })
//                       )
//                     : "",
//             },
//         };
//     } catch (error) {
//         // Could create error page here
//         console.log("getServerSideProps error - [community]", error);
//         return { props: {} };
//     }
// }
export default AircraftPage;
