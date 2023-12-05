import { faCirclePlus, faCircleDot, faCircleStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {addBoxesToTime, calculateMaxNumberOfBoxes, convertToDateTime} from '@/modules/dateLogic';
import '../../styles/timebox.scss';
import { useState, useContext } from 'react';
import '../../styles/addtimebox.scss';
import axios from 'axios';
import { TimeboxContext } from './TimeboxContext';

export default function TimeBox(props) {

    const {schedule, time, date, active, dayName, data} = props;
    const [timeBoxFormVisible, setTimeBoxFormVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [numberOfBoxes, setNumberOfBoxes] = useState(1);
    const {addTimeBoxDialogOpen, setAddTimeBoxDialogOpen, listOfColors, timeboxRecording, setTimeBoxRecording} = useContext(TimeboxContext);

    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(schedule, time, date);

    function addTimeBox() {
        if(!addTimeBoxDialogOpen) {
            setTimeBoxFormVisible(true);
            setAddTimeBoxDialogOpen(true);
        }
    }

    function closeTimeBox() {
        setTimeBoxFormVisible(false);
        setAddTimeBoxDialogOpen(false);
    }

    function getHeightForBoxes(numberOfBoxes) { return `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)` }

    function startRecording() {}

    function handleSubmit(event) {
        event.preventDefault();
        let startTime = convertToDateTime(time, date);
        let endTime = convertToDateTime(addBoxesToTime(schedule, time, numberOfBoxes), date); //add boxes to start time to get end time
        let color = listOfColors[Math.floor(Math.random() * listOfColors.length)]; //randomly pick a box color

        //post to api
        axios.post('/api/createTimebox', 
            {title, description, startTime, endTime,
            numberOfBoxes, color, schedule: {connect: {id: schedule.id}}
        }).catch(function(error) {console.log(error); })

        //reset the form
        setAddTimeBoxDialogOpen(false);
        setTimeBoxFormVisible(false);
        setTitle("");
        setDescription("");
        setNumberOfBoxes(1);
    }

    return (
    <div className={'col-1 timeBox'}>
        {/* Form section of this TimeBox component */}
        {timeBoxFormVisible && <div id={dayName == 'Sat' ? 'addTimeBoxConstrained' : 'addTimeBox'}> 
            <div id="timeBoxBubble"></div>
            <button onClick={closeTimeBox} id="addTimeBoxExitButton">X</button>
            <form onSubmit={handleSubmit}>
                <h4>Add TimeBox</h4>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input><br />
                <label htmlFor="description">Description</label>
                <input type="text" name="description" id="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></input><br />
                <label htmlFor="boxes">Boxes</label>
                <input min="1" max={maxNumberOfBoxes} type="number" name="boxes" id="boxes" placeholder="Boxes" value={numberOfBoxes} onChange={(e) => setNumberOfBoxes(e.target.value)}></input><br />
                <button id="addTimeBoxButton">Add TimeBox</button>
            </form>
        </div>}

        {/* Normal time box */}
        {data && <div style={{height: getHeightForBoxes(data.numberOfBoxes), backgroundColor: data.color}} id="timeBox">
            <span className="timeboxText">{data.title}</span>
            {timeboxRecording != -1 ? <button onClick={startRecording} ><FontAwesomeIcon height={25} width={25} icon={faCircleDot} /></button> : 
            <FontAwesomeIcon height={25} width={25} icon={faCircleStop} />}
        </div>}

        {/* Placeholder */}
        {timeBoxFormVisible && <div style={{height: getHeightForBoxes(numberOfBoxes)}} id="placeholderTimeBox">{title}</div>}

        {/* Add timebox button */}
        {active && !timeBoxFormVisible && !addTimeBoxDialogOpen && !props.data &&
        <button data-testid="addTimeBoxButton" onClick={addTimeBox} className="btn btn-dark addBoxButton">
            <FontAwesomeIcon height={25} width={25} icon={faCirclePlus}/>
        </button>}
    </div>)
}