import React, { useContext, useRef, useState } from 'react';
import Context from '../context';
import { Editable, ImageEditor, LikeButton } from '../components';
import { Tooltip } from 'react-tippy';

const UserProfile = ({ readOnly }) => {
	const { api, state } = useContext(Context);
    const fileInput = useRef();
    const [profilePicture, setProfilePicture] = useState(null);
	const isLoggedIn = localStorage.getItem('authToken') ? 1 : 0;

	function updateName(name) {
		api.updateUser(state.user.id, { name });
	};

	function updateHandle(handle) {
		api.updateUser(state.user.id, { handle });
	};

	function updateDescription(description) {
		api.updateUser(state.user.id, { description });
	};

	function copyLyrnLink() {
		navigator.clipboard.writeText('https://lyrn.link/' + state.user.handle);
	}

	return(
		<div id="user-profile">
			<div id="profile-header">
				<div id="user-profile-picture-wrapper">
					<img 
						src={state.user.profile_picture_url} 
						id="user-profile-picture"
						onClick={() => setProfilePicture(state.user.profile_picture_url || 1)}
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
				<div>
					{
						readOnly

						? 	isLoggedIn
							
							?	null

							: 	<a className="btn-black" href="/signup" >
									Sign Up
								</a>

						:	<div className="flex">
								<span className="text-right tiny-body" ><strong>My lyrnlink:&nbsp;</strong></span>
								<a className="text-right tiny-body" href={`/${state.user.handle}`} target="_blank" >
									https://lyrn.link/{state.user.handle}
								</a>
								<Tooltip
							        title="Copy LyrnLink"
							        position= "right"
							        trigger= "mouseenter"
							        inertia= "true"
							        transitionFlip= "true"
							        delay='0'
							    >
									<i 
										className="far fa-copy btn-share"
										style={{fontSize: 'small', marginLeft: '10px'}}
										onClick={copyLyrnLink}
									/>
								</Tooltip>
							</div>
					}
					{readOnly ? <LikeButton authed={isLoggedIn} /> : null}
				</div>
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