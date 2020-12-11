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
						className="huge-heading"
						value={state.user.name}
						onUpdate={updateName}
						defaultValue="( name )"
					/>
					<div className="user-handle">
						/&nbsp;
						<Editable
							readOnly={readOnly}
							className="big-heading"
							value={state.user.handle}
							onUpdate={updateHandle}
							defaultValue="( handle )"
						/>
						{
							readOnly

							? 	null

							: 	<a  href={`/${state.user.handle}`} target="_blank" >
									<i className="far fa-external-link user-link-icon" />
								</a>
						}
					</div>
					<div className="tiny-heading">
						Sharing since December '20
					</div>
				</div>
				{
					isLoggedIn

					?	null

					: 	<a className="flex-grow tiny-body text-right" href="/" >
							Join Lyrn Link
						</a>
				}
				
			</div>
			<Editable
				readOnly={readOnly}
				className="big-body user-description"
				value={state.user.description}
				onUpdate={updateDescription}
				textArea={true}
				defaultValue="I don't have a description."
			/>
		</div>
	);
};

export default UserProfile;