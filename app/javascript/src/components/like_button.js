import React, { useContext, useEffect, useState } from 'react';
import Context from '../context';

const LikeButton = ({ id, liked, count }) => {

	const { state, api } = useContext(Context);
	const [likeState, setLikeState] = useState(liked);
	const [countState, setCountState] = useState(count);

	useEffect(() => {
		setLikeState(liked);
		setCountState(count);
	}, [liked, count]);

	async function handleClick(e) {
		e.stopPropagation();
		const res = likeState ? await api.destroyLike(id) : await api.createLike(id);
		setLikeState(res);
		if (res) {
			setCountState(prev => prev + 1);
		} else {
			setCountState(prev => prev - 1);
		}
	};

	if (state.current_user_id === id) 
		return(
			<div className="follower-count">
				{countState || ''}
			</div>
		)

	return(
		<div className="flex" >
			<div 
				className={likeState ? 'btn-following' : 'btn-follow'}
				onClick={handleClick}
			>
				{likeState ? 'Following' : 'Follow'}
			</div>
			<div className="follower-count">
				{countState || ''}
			</div>
		</div>
	);
}; 

export default LikeButton;