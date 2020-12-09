import React, { useContext } from 'react';
import Context from '../context';
import { Editable } from '../components';

const UserProfile = ({ readOnly }) => {
	const { api, state } = useContext(Context);

	const isLoggedIn = localStorage.getItem('authToken');

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
				<div className={isLoggedIn ? 'flex-grow' : ''} >
					<Editable
						readOnly={readOnly}
						className="h h-name"
						value={state.user.name}
						onUpdate={updateName}
					/>
					<div className="user-handle flex">
						/
						<Editable
							readOnly={readOnly}
							className="h h-handle"
							value={state.user.handle}
							onUpdate={updateHandle}
						/>
						{
							readOnly

							? 	null

							: 	<a  href={`/u/${state.user.handle}`} target="_blank" >
									<i className="fal fa-link user-link-icon" />
								</a>
						}
					</div>
					<div className="b b-since">
						Sharing since December '20
					</div>
				</div>
				{
					isLoggedIn

					?	null

					: 	<a className="flex-grow little-strong-body text-right" href="/" >
							Join Lyrn Link
						</a>
				}
				
			</div>
			<Editable
				readOnly={readOnly}
				className="b b-description"
				value={state.user.description}
				onUpdate={updateDescription}
				textArea={true}
			/>
		</div>
	);
};

export default UserProfile;