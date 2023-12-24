import { useState } from "react";
import axios from "axios";
import { queryClient } from './../../pages/_app';
import {toast} from "react-toastify";

export default function CreateGoalForm(props) {
    const [name, setName] = useState("");
    const [priority, setPriority] = useState(1);
    const [targetDate, setTargetDate] = useState(new Date().toISOString());

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('/api/createGoal', {
            name,
            priority: parseInt(priority), //damn thing won't convert auto even with number input
            targetDate: new Date(targetDate).toISOString(),
            schedule: {
                connect: {id: props.id}
            } 
        }).then(function() {
            queryClient.refetchQueries();
            toast.success("Added goal!", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(function(error) {
            toast.error("Error occurred please try again or contact developer");
            console.log(error); 
        })
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Name: </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required></input><br />
            <label>Priority: </label>
            <input type="number" min={1} value={priority} onChange={(e) => setPriority(e.target.value)} required></input><br />
            <label>Target Date: </label>
            <input type="datetime-local" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required></input><br />
            <button type="submit">Create Goal</button>
        </form>
    )
}