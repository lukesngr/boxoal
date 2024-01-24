import { thereIsNoRecording } from "@/modules/coreLogic";
import axios from 'axios';
import { toast } from "react-toastify";
import { queryClient } from './../../pages/_app';
import { useState } from "react";
import { faCircleDot, faCircleStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NormalTimeBox(props) {
    const [recordedStartTime, setRecordedStartTime] = useState();
    const {data, height, tags, overlayFuncs, recordFuncs, scheduleID, date, time} = props;
    const [pauseActiveOverlay, resumeActiveOverlay] = overlayFuncs;
    const [timeboxRecording, setTimeBoxRecording] = recordFuncs;
    const noPreviousRecording = thereIsNoRecording(data.recordedTimeBoxes, data.reoccuring, date, time);
    const timeboxIsntRecording = timeboxRecording[0] == -1;
    const timeboxIsRecording = timeboxRecording[0] == data.id && timeboxRecording[1] == date;
    const iconSize = 20

    function startRecording() {
        setTimeBoxRecording([data.id, date]);
        pauseActiveOverlay();
        setRecordedStartTime(new Date());
    }

    function stopRecording() {
        setTimeBoxRecording([-1, 0]);
        resumeActiveOverlay();
        axios.post('/api/createRecordedTimebox', 
            {recordedStartTime, recordedEndTime: new Date(), timeBox: {connect: {id: data.id}}, schedule: {connect: {id: scheduleID}}
        }).then(() => {
            queryClient.refetchQueries();
            toast.success("Added recorded timebox!", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(function(error) {
            toast.error("Error: "+error, {
                position: toast.POSITION.TOP_RIGHT,
            });
            console.log(error); 
        })  
    }

    return (
        <div style={{height: height, backgroundColor: data.color}} id="timeBox" data-testid="normalTimeBox">    
            <span {...tags} style={{height: height}} className="timeboxText">{data.title}</span>

            {noPreviousRecording && timeboxIsntRecording && 
            <button className="recordTimeButton" onClick={startRecording} >
                <FontAwesomeIcon height={iconSize} width={iconSize} icon={faCircleDot} />
            </button>}

            {noPreviousRecording && timeboxIsRecording && 
            <button className="stopRecordTimeButton" onClick={stopRecording} >
                <FontAwesomeIcon height={iconSize} width={iconSize} icon={faCircleStop} />
            </button>}
        </div>
    )
}