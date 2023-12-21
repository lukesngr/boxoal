import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CreateAreaModal from '../area/CreateAreaModal';
import { useState } from 'react';

export default function ScheduleSidebarButton(props) {
    const [isAddAreaVisible, setIsAddAreaVisible] = useState(false);

    function toggleAddAreaButton() {
        setIsAddAreaVisible(!isAddAreaVisible);
    }

    return (
        <div onClick={() => props.selectSchedule(props.index)} className={props.selectedSchedule == props.index ? 'selectedSchedule' : 'schedule'}>
            {props.schedule.name}
            {!isAddAreaVisible && <FontAwesomeIcon onClick={toggleAddAreaButton} className='scheduleButton' icon={faChevronDown}/> }
            {isAddAreaVisible && <FontAwesomeIcon onClick={toggleAddAreaButton} className='scheduleButton' icon={faChevronUp}/> }
            <FontAwesomeIcon className='scheduleButton' icon={faGear} />
            {isAddAreaVisible && props.schedule.goals.map(goal => (<div key={goal.id} className="areaButton">{goal.name}</div>))}
            {isAddAreaVisible && <>
                <button type="button" className="btn btn-dark createButton" data-bs-toggle="modal" data-bs-target="#createAreaModal">
                    Add area 
                </button>
                <CreateAreaModal id={props.schedule.id}/>
            </>}
        </div>)
}