import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {addBoxesToTime, calculateMaxNumberOfBoxes, convertToDateTime} from '@/modules/dateLogic';
import '../../styles/timebox.scss';
import { useState, useContext } from 'react';
import '../../styles/addtimebox.scss';
import axios from 'axios';
import { TimeboxContext } from './TimeboxContext';

export default function TimeBox(props) {

    const [timeBoxFormVisible, setTimeBoxFormVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [numberOfBoxes, setNumberOfBoxes] = useState(1);

    const {timeBoxInUse, setTimeBoxInUse} = useContext(TimeboxContext);

    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(props.schedule, props.time);

    function addTimeBox() {
        if(!timeBoxInUse) {
            setTimeBoxFormVisible(true);
            setTimeBoxInUse(true);
        }
    }

    function closeTimeBox() {
        setTimeBoxFormVisible(false);
        setTimeBoxInUse(false);
    }

    function handleSubmit(event) {
        event.preventDefault();
        let endTime = addBoxesToTime(props.schedule, props.time, numberOfBoxes);

        axios.post('/api/createTimebox', {
            title,
            description,
            startTime: convertToDateTime(props.time, props.date),
            endTime: convertToDateTime(endTime, props.date),
            numberOfBoxes: parseInt(numberOfBoxes),
            schedule: {
                connect: {id: props.schedule.id}
            }
        }).catch(function(error) {
            console.log(error);
        })

        setTimeBoxFormVisible(false);
        setTimeBoxInUse(false);
        setDescription("");
        setNumberOfBoxes(1);
        setTitle("");
    }

    console.log(props.data)

    return (
    <div className={props.active ? 'col-1 timeBox' : 'col-1 inactiveTimebox'}>
        {timeBoxFormVisible && <div id={props.dayName == 'Sat' ? 'addTimeBoxConstrained' : 'addTimeBox'}>
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
        {props.data && <div style={{height: `calc(${(props.data.numberOfBoxes * 100)}% + ${(props.data.numberOfBoxes - 1) * 2}px)`}} id="placeholderTimeBox">{props.data.title}</div>}
        {timeBoxFormVisible && <div style={{height: `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)`}} id="placeholderTimeBox">{title}</div>}
        {props.active && !timeBoxFormVisible && !timeBoxInUse &&
        <button data-testid="addTimeBoxButton" onClick={addTimeBox} className="btn btn-dark addBoxButton"><FontAwesomeIcon height={25} width={25} icon={faCirclePlus}/></button>}
    </div>)
}