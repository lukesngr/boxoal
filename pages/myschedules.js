import SignedInNav from "@/components/nav/SignedInNav";
import { useSession } from "next-auth/react";
import { useQuery, QueryCache } from "react-query";
import axios from "axios";
import NoSchedules from "@/components/schedule/NoSchedules";
import RedirWhenNotAuth from "@/components/RedirWhenNotAuth";
import { createContext } from "react";
import SchedulesView from "@/components/schedule/SchedulesView";
import { getDayNumbers } from "@/modules/dateLogic";
import { ScheduleContextProvider } from "./ScheduleContext";

export const SessionContext = createContext();
export const RefetchContext = createContext();

function MySchedulesSeperatedForFunctionality(props) {

    let dayNumbers = getDayNumbers();
    const {selectedSchedule, setSelectedSchedule, expanded, setExpanded, selectedDate, setSelectedDate} = useContext(ScheduleContext);
    
    const {status, data, error, refetch} = useQuery({
        queryKey: ["schedules"], 
        queryFn: async () => {
            const response = await axios.post("/api/getSchedules", { userEmail: props.session.user.email, startOfWeek, endOfWeek });
        
            return response;},
        enabled: true})
    
    return (
        <>
            <RedirWhenNotAuth redirectSrc="/signin" status={props.status}>
                <div id='portalRoot'></div>
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
        return <ScheduleContextProvider><MySchedulesSeperatedForFunctionality session={session} status={status}></MySchedulesSeperatedForFunctionality></ScheduleContextProvider>
    }  
}