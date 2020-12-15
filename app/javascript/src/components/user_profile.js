import React, { useContext, useRef, useState } from 'react';
import Context from '../context';
import { Editable, ImageEditor } from '../components';

const UserProfile = ({ readOnly }) => {
	const { api, state } = useContext(Context);
    const fileInput = useRef();
    const [profilePicture, setProfilePicture] = useState(null);
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
			<div id="profile-header">
				<div id="user-profile-picture-wrapper">
					<img 
						src={state.user.profile_picture_url} 
						id="user-profile-picture"
						onClick={() => setProfilePicture(state.user.profile_picture_url)}
					/>
				</div>
				<ImageEditor 
					image={profilePicture} 
					onClose={() => setProfilePicture(null)}
				/>
				<div className="flex-grow profile-info" >
					<div className="user-name">
						<Editable
							readOnly={readOnly}
							className="huge-heading"
							value={state.user.name}
							onUpdate={updateName}
							defaultValue="( name )"
						/>
					</div>
					<div className="user-handle" style={{marginTop: '-5px'}}>
						/&nbsp;
						<Editable
							readOnly={readOnly}
							className="big-heading"
							value={state.user.handle}
							onUpdate={updateHandle}
							defaultValue="( handle )"
						/>
					</div>
					<div className="user-since tiny-heading">
						Sharing since December '20
					</div>
				</div>
				{
					isLoggedIn

					?	<div className="flex">
							<span className="text-right tiny-body" ><b>My lyrnlink:&nbsp;</b></span>
							<a className="text-right tiny-body" href={`/${state.user.handle}`} target="_blank" >
								https://lyrn.link/{state.user.handle}
							</a>
							<i className="far fa-copy btn-share" style={{fontSize: 'small', marginLeft: '10px'}} />
						</div>
						
					: 	<a className="btn-black" href="/signup" >
							Sign Up
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