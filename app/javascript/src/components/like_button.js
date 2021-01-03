import React, { useContext, useEffect, useState } from 'react';
import Context from '../context';

const LikeButton = ({ id, liked }) => {

	const { state, api } = useContext(Context);
	const [likeState, setLikeState] = useState(liked);

	useEffect(() => {
		setLikeState(liked);
	}, [liked]);

	async function handleClick() {
		const res = likeState ? await api.destroyLike(id) : await api.createLike(id);
		setLikeState(res);
	};

	// if (state.user.id === id) return <div/>;

	return(
		<div className="flex" >
			<div 
				className={`follow-button ${likeState ? 'followed' : ''}`} 
				onClick={handleClick}
			>
				{likeState ? 'Unfollow' : 'Follow'}
			</div>
		</div>
	);
}; 

export default LikeButton;