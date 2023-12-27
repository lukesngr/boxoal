import { useState } from "react";
import axios from "axios";
import { queryClient } from '../../pages/_app';
import {toast} from "react-toastify";
import { calculateMaxNumberOfBoxes } from "@/modules/dateLogic";

export default function UpdateTimeBoxForm(props) {
    const [title, setTitle] = useState(props.timebox.title);
    const [description, setDescription] = useState(props.timebox.description);
    const [targetDate, setTargetDate] = useState(new Date(props.goal.targetDate).toISOString().slice(0, 19));
    const [numberOfBoxes, setNumberOfBoxes] = useState(props.timebox.numberOfBoxes);

    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(schedule, time, date);

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('/api/updateGoal', {
            name,
            priority: parseInt(priority), //damn thing won't convert auto even with number input
            targetDate: new Date(targetDate).toISOString(),
            id: props.goal.id
        }).then(function() {
            queryClient.refetchQueries();
            toast.success("Updated goal!", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(function(error) {
            toast.error("Error occurred please try again or contact developer");
            console.log(error); 
        })
    }

    function deleteGoal() {

        axios.post('/api/deleteGoal', {
            id: props.goal.id, 
        }).then(() => {
            const closeButton = document.querySelector(`#updateGoalModal .close`);
            if (closeButton) {
                closeButton.click();
            }
            
            queryClient.refetchQueries();
            toast.success("Deleted goal!", {
                position: toast.POSITION.TOP_RIGHT,
            });
            
        }).catch(function(error) {
            toast.error("Error occurred please try again or contact developer");
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Title: </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required></input><br />
            <label>Description: </label>
            <input type="text" value={priority} onChange={(e) => setPriority(e.target.value)} required></input><br />
            <label>Start Time: </label>
            <input type="datetime-local" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required></input><br />
            <label>Number Of Boxes: </label>
            <input type="number" min={1} value={priority} onChange={(e) => setPriority(e.target.value)} required></input><br />
            <button type="submit">Update</button>
            <button type="button" className="btn btn-danger" onClick={deleteGoal}>Delete</button>
        </form>
    )
}