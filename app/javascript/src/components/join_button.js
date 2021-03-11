import React, { useContext, useEffect, useState } from 'react';
import Context from '../context';

const JoinButton = ({ id, joined, count, show }) => {

	const { state, api } = useContext(Context);
	const [joinState, setJoinState] = useState(joined);
	const [countState, setCountState] = useState(count);

	useEffect(() => {
		setJoinState(joined);
		setCountState(count);
	}, [joined, count]);

	async function handleClick(e) {
		e.stopPropagation();
		const res = joinState ? await api.destroyGroupRelationship(id) : await api.createGroupRelationship({ group_id: id, user_id: state.current_user_id, accepted: true });
		if (joinState) {
			setCountState(prev => prev - 1);
		} else {
			setCountState(prev => prev + 1);
		}
		setJoinState(prev => !prev);
	};

	return(
		<div className="flex" >
			{
				show

				?	<div 
						className={joinState ? 'btn-following' : 'btn-follow'}
						onClick={handleClick}
					>
						{joinState ? 'Leave' : 'Join'}
					</div>

				: 	null
			}
			<div className="follower-count">
				{countState || ''}
			</div>
		</div>
	);
}; 

export default JoinButton;