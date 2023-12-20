import SignedInNav from "@/components/nav/SignedInNav";
import { useSession } from "next-auth/react";
import { useQuery, QueryClient } from "react-query";
import axios from "axios";
import NoSchedules from "@/components/schedule/NoSchedules";
import RedirWhenNotAuth from "@/components/RedirWhenNotAuth";
import { createContext } from "react";
import SchedulesView from "@/components/schedule/SchedulesView";

export const SessionContext = createContext();
export const RefetchContext = createContext();

function MySchedulesSeperatedForFunctionality(props) {
    
    const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
          },
        },
      })
    queryClient.removeQueries();
    //const {status, data, error, refetch} = useQuery(["schedules"], () => axios.post("/api/getSchedules", {userEmail: props.session.user.email}))
    let data = {data: {}};

    return (
        <>
            <RedirWhenNotAuth redirectSrc="/signin" status={props.status}>
                <SignedInNav session={props.session}></SignedInNav>
                <SessionContext.Provider value={props.session}>
                    {data && data.data.length > 0 ? (<SchedulesView data={data}></SchedulesView>) : (<NoSchedules session={props.session}/>) }
                </SessionContext.Provider>
            </RedirWhenNotAuth>
        </>
    )
}

export default function MySchedules() {
    const {data: session, status} = useSession();

    if(status == "loading") {
        return <h1>Loading</h1>
    }else if(status === "authenticated"){
        return <MySchedulesSeperatedForFunctionality session={session} status={status}></MySchedulesSeperatedForFunctionality>
    }  
}