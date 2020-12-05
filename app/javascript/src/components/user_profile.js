import React, { useContext } from 'react';
import Context from '../context';
import { Editable } from '../components';

const UserProfile = ({ readOnly }) => {
	const { api, state } = useContext(Context);



	function updateName(name) {
		api.updateUser(state.user.id, { name });
	};

	function updateHandle(handle) {
		api.updateUser(state.user.id, { handle });
	};

	function updateDescription(description) {
		api.updateUser(state.user.id, { description });
	};

	return(
		<div id="user-profile">
			<div className="flex-between">
				<img src={state.user.profile_picture_url} id="user-profile-picture" />
				<div>
					<Editable
						readOnly={readOnly}
						className="big-heading"
						value={state.user.name}
						onUpdate={updateName}
					/>
					<div className="user-handle flex">
						/
						<Editable
							readOnly={readOnly}
							className="little-heading"
							value={state.user.handle}
							onUpdate={updateHandle}
						/>
						<a  href={`/u/${state.user.handle}`} >
							<i className="fal fa-link user-link-icon" />
						</a>
					</div>
					<div className="little-strong-body">
						Sharing since December 2020
					</div>
				</div>
				<div className="flex-grow little-strong-body text-right">
					Join Lyrn Link
				</div>
			</div>
			<div style={{marginTop: '10px'}}></div>
			<Editable
				readOnly={readOnly}
				className="main-body"
				value={state.user.description}
				onUpdate={updateDescription}
			/>
		</div>
	);
};

export default UserProfile;