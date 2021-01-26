import React, { useContext, useEffect, useState } from 'react';
import Context from '../context';

const LikeButton = ({ id, liked, follower_count }) => {

	const { state, api } = useContext(Context);
	const [likeState, setLikeState] = useState(liked);
	const [count, setCount] = useState(follower_count);

	useEffect(() => {
		setLikeState(liked);
		setCount(follower_count);
	}, [liked, follower_count]);

	async function handleClick(e) {
		e.stopPropagation();
		const res = likeState ? await api.destroyLike(id) : await api.createLike(id);
		setLikeState(res);
		if (res) {
			setCount(count => count + 1);
		} else {
			setCount(count => count - 1);
		}
	};

	if (state.current_user_id === id) 
		return(
			<div className="follower-count">
				{count || ''}
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
				{count || ''}
			</div>
		</div>
	);
}; 

export default LikeButton;