import React, { useEffect, useContext } from 'react';
import Context from '../context';

const LikeButton = ({ authed }) => {
	const { state, api } = useContext(Context);

	useEffect(() => {
		api.getLike(state.user.id, authed);
	}, []);

	return(
		<div className="flex" style={{marginTop: '10px'}} >
			<div id="like-count">{state.likeCount}</div>
			<i 
				className={`fas fa-thumbs-up like-icon ${state.liked ? 'liked-icon' : ''}`} 
				onClick={
					() => 	state.liked

							?	api.destroyLike(state.user.id)

							: 	api.createLike(state.user.id)
				}
			/>
		</div>
	);
}; 

export default LikeButton;