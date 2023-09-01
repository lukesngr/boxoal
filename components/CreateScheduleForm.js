import { useState } from "react";


export default function CreateScheduleForm() {
    const [name, setName] = useState("");
    const [boxSizeNumber, setBoxSizeNumber] = useState(0);
    const [boxSizeUnit, setBoxSizeUnit] = useState("min");
    const [endDate, setEndDate] = useState("");
    const [endDateType, setEndDateType] = useState(false);
    const [wakeupTime, setWakeupTime] = useState("07:30");

    function handleSubmit(event) {
        event.preventDefault();
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Name: </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required></input><br />
            <label>Box Size: </label>
            <input type="number" value={boxSizeNumber} onChange={(e) => setBoxSizeNumber(e.target.value)} required></input>
            <select value={boxSizeUnit} onChange={(e) => setBoxSizeUnit(e.target.value)} required>
                <option value="min">Min</option>
                <option value="hr">Hour</option>
            </select><br />
            <label>End Date: </label>
            <select value={endDateType} onChange={(e) => {setEndDateType(e.target.value)}}>
                <option value={"none"}>None</option>
                <option value={"initial"}>Choose</option>
            </select>
            <input type="date" style={{display: endDateType} }value={endDate} onChange={(e) => setEndDate(e.target.value)} required></input>
            <br />
            <label>Average Wakeup Time: </label>
            <input type="time" value={wakeupTime} onChange={(e) => setWakeupTime(e.target.value)} required></input> <br />
            <button type="submit">Create</button>
        </form>
    )
}