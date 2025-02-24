import { addBoxesToTime, convertToDateTime, thereIsNoRecording } from "@/modules/coreLogic";
import axios from 'axios';
import { toast } from "react-toastify";
import { queryClient } from './../../pages/_app';
import { useContext, useState } from "react";
import { faCircleCheck, faCircleDot, faCircleStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from "react-redux";
import { setActiveOverlayInterval, resetActiveOverlayInterval } from "@/redux/activeOverlayInterval";

export default function NormalTimeBox(props) {
    const [recordedStartTime, setRecordedStartTime] = useState();
    const {data, height, tags, date, time} = props;
    const timeboxRecording = useSelector(state => state.timeboxRecording.value);
    const {id, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const dispatch = useDispatch();
    
    const noPreviousRecording = thereIsNoRecording(data.recordedTimeBoxes, data.reoccuring, date, time);
    const timeboxIsntRecording = timeboxRecording[0] == -1;
    const timeboxIsRecording = timeboxRecording[0] == data.id && timeboxRecording[1] == date;
    const iconSize = 20

    function startRecording() {
        dispatch({type: 'timeboxRecording/set', payload: [data.id, date]});
        dispatch(setActiveOverlayInterval());
        setRecordedStartTime(new Date());
    }

    function stopRecording() {
        dispatch({type: 'timeboxRecording/set', payload: [-1, 0]});
        dispatch(resetActiveOverlayInterval());
        axios.post('/api/createRecordedTimebox', 
            {recordedStartTime: recordedStartTime, recordedEndTime: new Date(), timeBox: {connect: {id: data.id}}, schedule: {connect: {id}}
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

    function autoRecord() {
        axios.post('/api/createRecordedTimebox', 
            {recordedStartTime: convertToDateTime(time, date), 
                recordedEndTime: convertToDateTime(addBoxesToTime(boxSizeUnit, boxSizeNumber, time, data.numberOfBoxes), date),
                 timeBox: {connect: {id: data.id}}, schedule: {connect: {id}}
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
            <span {...tags} className="timeboxText">{data.title}</span>
        </div>
    )
}