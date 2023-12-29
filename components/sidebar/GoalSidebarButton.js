import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CreateGoalModal from '../modal/CreateGoalModal';
import { useState } from 'react';
import PortalComponent from '../modal/PortalComponent';
import UpdateGoalModal from '../modal/UpdateGoalModal';
import UpdateTimeBoxModal from '../modal/UpdateTimeBoxModal';
import ChevronExpandable from '../base/ChevronExpandable';

export default function GoalSidebarButton(props) {
    
    return (
        <div className='goalButton'>
            <span className='sidebarExpandableTitle'>{props.goal.name}</span>
            <ChevronExpandable render={button => (
                <div className='sidebarExpandableButtons'>
                    {button}
                    <UpdateGoalModal render={tags => ( <FontAwesomeIcon {...tags} className='sidebarExpandableButton' icon={faGear} />)} goal={props.goal}></UpdateGoalModal>
                </div>
            )}>
                {props.goal.timeboxes.map(timebox => (
                <div key={timebox.id} className="sidebarTimeBox">
                    {timebox.title}
                    <UpdateTimeBoxModal render={tags => ( <FontAwesomeIcon {...tags} className='sidebarExpandableButton' icon={faGear} />)} timebox={timebox}></UpdateTimeBoxModal>
                </div>))}
            </ChevronExpandable>
        </div>)
}