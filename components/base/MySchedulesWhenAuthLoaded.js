import { useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useDispatch } from "react-redux";
import serverIP from "@/modules/serverIP";
import CreateScheduleForm from "@/components/form/CreateScheduleForm";
import { useState } from "react";
import Alert from "@/components/base/Alert";
import { useQuery } from "@tanstack/react-query";
import SchedulesView from "@/components/schedule/SchedulesView";
import axios from "axios";
import Welcome from "./Welcome";
import SignedInNav from "../nav/SignedInNav";
import Loading from "./Loading";
export default function MySchedulesWhenAuthLoaded({user}) {
    const dispatch = useDispatch();
    let {userId, username} = user;
    useProfile(userId, dispatch);

    const {status, data, error, refetch} = useQuery({
        queryKey: ["schedule"], 
        queryFn: async () => {
            const response = await axios.get(serverIP+"/getSchedules", { params: {
                userUUID: userId
            }});
            return response.data;
        },
        enabled: true
    })

    if(status === 'loading') return <Loading />
    if(status === 'error') return <p>Error: {error.message}</p>
    if(data.length == 0) return <Welcome></Welcome>

    return (<>
        <SignedInNav username={username} />
        <SchedulesView data={data}></SchedulesView>
    </>)
}