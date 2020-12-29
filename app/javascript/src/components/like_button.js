import React, { useContext } from 'react';
import Context from '../context';

const LikeButton = ({ authed }) => {
	const { state, api } = useContext(Context);

	return(
		<div className="flex" style={{marginTop: '10px'}} >
			<div 
				className={`follow-button ${state.liked ? 'followed' : ''}`} 
				onClick={
					() => 	state.liked

							?	api.destroyLike(state.user.id)

							: 	api.createLike(state.user.id)
				}
			>
				{state.liked ? 'Unfollow' : 'Follow'}
			</div>
		</div>
	);
}; 

export default LikeButton;