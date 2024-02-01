import React, { useRef, useState, useContext, useEffect, useMemo } from 'react';
import { getDayNumbers, returnTimesSeperatedForSchedule, ifCurrentDay, ifEqualOrBeyondCurrentDay,
     convertToTimeAndDate, calculateSizeOfOverlayBasedOnCurrentTime, calculateSizeOfRecordingOverlay, whereRecordedStartTimeSameAsCurrent } from '@/modules/dateLogic';
import '../../styles/timeboxes.scss';
import TimeBox from './Timebox';
import { ScheduleContext } from '../schedule/ScheduleContext';
import { TimeboxContextProvider } from "./TimeboxContext";
import Overlay from '../overlay/Overlay';
import ActiveOverlay from '../overlay/ActiveOverlay';
import RecordingOverlay from '../overlay/RecordingOverlay';
import RecordedTimeBoxOverlay from './RecordedTimeBoxOverlay';
import TimeboxHeading from './TimeboxHeading';
import dayjs from 'dayjs';
import { generateTimeBoxGrid } from '@/modules/coreLogic';

export default function TimeBoxes(props) {

    const gridContainerRef = useRef(null);
    const headerContainerRef = useRef(null);
    const timeboxColumnRef = useRef(null);
    const activeOverlayInterval = useRef(null);
    const activeOverlayResetTime = 5000;

    const [overlayDimensions, setOverlayDimensions] = useState(0);
    const [activeOverlayHeight, setActiveOverlayHeight] = useState(0);
 
    //get schedule that is selected in sidebar and assign it to schedule variable
    const {selectedSchedule, setSelectedSchedule, expanded, setExpanded, selectedDate, setSelectedDate} = useContext(ScheduleContext);
    let schedule = props.data.data[selectedSchedule];

    const dayToName = getDayNumbers(selectedDate.toDate()); //get all info to make headers look nice
    const listOfTimes = returnTimesSeperatedForSchedule(schedule); //get times that go down each row
    
    //make a map for the timeboxes with a map inside it
    //this allows fast lookup based on date than time first
    let timeBoxGrid = new Map();
    useEffect(() => {
        generateTimeBoxGrid(schedule, selectedDate, timeBoxGrid);
    }, [props.data, selectedSchedule])

    console.log(timeBoxGrid);
   
    function calculateOverlayDimensions() {
        if (gridContainerRef.current && headerContainerRef.current && timeboxColumnRef.current) { //if ref working
            const gridHeight = gridContainerRef.current.offsetHeight; //get height of grid
            const headerHeight = headerContainerRef.current.offsetHeight; //get height of headers

            const headerWidth = headerContainerRef.current.offsetWidth; //get width of headers
            const overlayHeight = gridHeight - headerHeight; //overlay is under headers but goes till end of grid
            const timeboxHeight = timeboxColumnRef.current.getBoundingClientRect().height; //decimal for a bit more accuracy as this for active overlay

            setOverlayDimensions([headerWidth, overlayHeight, timeboxHeight]);
        }
    };

    //when page first loads calculate overlay dimensions
    useEffect(() => {
        calculateOverlayDimensions();
        window.addEventListener('resize', calculateOverlayDimensions); //if resized calculate overlay dimensions
    
        return () => {
            clearInterval(activeOverlayInterval.current);
            window.removeEventListener('resize', calculateOverlayDimensions);
        };
    }, []);
    //if schedule changes recalculate overlay dimensions
    useEffect(() => {
        calculateOverlayDimensions();
    }, [selectedSchedule]);
    //if sidebar changes recalculate overlay dimensions
    useEffect(() => {
        setTimeout(calculateOverlayDimensions, 600);
    }, [expanded]);

    //when overlay dimensions changes set active overlay height
    useEffect(() => {
        setActiveOverlayHeight(calculateSizeOfOverlayBasedOnCurrentTime(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions));

        activeOverlayInterval.current = setInterval(() => { setActiveOverlayHeight(calculateSizeOfOverlayBasedOnCurrentTime(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions))}, activeOverlayResetTime);
        
        return () => { clearInterval(activeOverlayInterval.current); };
    }, [overlayDimensions])

    function pauseActiveOverlay() { clearInterval(activeOverlayInterval.current); }

    function resumeActiveOverlay() { 
        activeOverlayInterval.current = setInterval(() => {setActiveOverlayHeight(calculateSizeOfOverlayBasedOnCurrentTime(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions))}, activeOverlayResetTime);
    }

   

    return (
    <>
        <TimeboxHeading expanded={expanded} setExpanded={setExpanded} selectedDate={selectedDate} setSelectedDate={setSelectedDate}></TimeboxHeading>
        <div ref={gridContainerRef} className="container-fluid mt-2 timeboxesGrid">
            <TimeboxContextProvider>

                {/*Headers */}
                <div className="row">
                    <div className="col-1"></div>
                    
                    {dayToName.map((day, index) => (
                        <div ref={headerContainerRef} key={index} style={{padding: '0'}} className={'col '+ifCurrentDay(index, 'currentDay', '')}>
                            <span className='timeboxHeadingText'>{day.name}<br />{" ("+day.date+"/"+day.month+")"}</span>
                            {ifCurrentDay(index, true, false) && <>
                                <ActiveOverlay width={overlayDimensions[0]} overlayHeight={activeOverlayHeight}></ActiveOverlay>
                                <RecordingOverlay overlayDimensions={overlayDimensions} schedule={schedule} 
                                activeOverlayHeight={activeOverlayHeight}></RecordingOverlay>
                            </>}
                            {!ifCurrentDay(index, true, false) && <Overlay dimensions={overlayDimensions} active={ifEqualOrBeyondCurrentDay(index, true, false)}></Overlay>}
                            <RecordedTimeBoxOverlay data={schedule.recordedTimeboxes.filter(function(obj) {
                                let recordedStartTime = new Date(obj.recordedStartTime);
                                return (recordedStartTime.getMonth()+1) == day.month && (recordedStartTime.getDate()) == day.date;
                            })} overlayDimensions={overlayDimensions} schedule={schedule}></RecordedTimeBoxOverlay>
                        </div>
                    ))}
                </div>
                
                {/* Timeboxes */}
                {listOfTimes.map(time => (
                    <div key={time} className="row">
                        <div ref={timeboxColumnRef} className="col-1 timeCol">{time}</div>
                        {dayToName.map((day, index) => (
                            <TimeBox key={index} dayName={day.name} active={ifEqualOrBeyondCurrentDay(index, true, false)}
                             schedule={schedule} time={time} date={day.date+"/"+day.month} data={timeBoxGrid.get(day.date+"/"+day.month)?.get(time)}
                             overlayFuncs={[pauseActiveOverlay, resumeActiveOverlay]}></TimeBox>
                        ))}
                    </div>))}
            </TimeboxContextProvider>
        </div>
    </>
    )
    
}