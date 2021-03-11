import React, { useContext } from 'react';
import Context from '../context';
import { Tooltip } from 'react-tippy';

const JoinButton = () => {

	const { state, api } = useContext(Context);

	async function handleClick(e) {
		e.stopPropagation();
		api.updateGroup(state.group.id, { private: !state.group.private });
	};

	return(
		<Tooltip
	        title={state.group.private ? "Make Group Public" : "Make Group Private"}
	        position= "right"
	        trigger= "mouseenter"
	        inertia= "true"
	        transitionFlip= "true"
	        delay='0'
	        arrow="true"
	    >
			<div 
				className='btn-white'
				onClick={handleClick}
			>
				{state.group.private ? 'Private Group' : 'Public Group'}
			</div>
		</Tooltip>
	);
}; 

export default JoinButton;