import { TimeboxContext } from '../timebox/TimeboxDialogContext';
import { useContext, useEffect, useState } from 'react';
import { calculateSizeOfRecordingOverlay } from '@/modules/coreLogic';

export default function RecordingOverlay(props) {
    const {addTimeBoxDialogOpen, setAddTimeBoxDialogOpen, listOfColors, timeboxRecording, setTimeBoxRecording} = useContext(TimeboxContext);
    const [recordingOverlayHeight, setRecordingOverlayHeight] = useState(0);
    const {schedule, activeOverlayHeight, overlayDimensions} = props;

    useEffect(() => {
        if(timeboxRecording[0] != -1) {
            let recordingOverlayInterval = setInterval(() => {
                setRecordingOverlayHeight(calculateSizeOfRecordingOverlay(schedule, overlayDimensions, activeOverlayHeight));
            }, 5000);
        
            return () => {
                clearInterval(recordingOverlayInterval);
            };
        }else{
            setRecordingOverlayHeight("0px");
        }
    }, [timeboxRecording])

    return (
        <>
            {timeboxRecording != -1 && <div className="recordingOverlay"
             style={{width: overlayDimensions[0]+"px", 
             height: recordingOverlayHeight,
            transform: `translate(-3px, ${activeOverlayHeight+3}px)`}}></div>}
        </>
    )
}