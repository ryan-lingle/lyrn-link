import React, { useContext, useRef, useState } from 'react';
import Context from '../context';
import { Editable, ImageEditor, LikeButton, ProfileTabs } from '../components';
import { Tooltip } from 'react-tippy';

const UserProfile = () => {
	const { api, state } = useContext(Context);
	const readOnly = state.readOnly;
    const fileInput = useRef();
    const [profilePicture, setProfilePicture] = useState(null);
    const link = 'https://lyrn.link/' + state.user.handle;
    const tweetText = `Check out my LyrnLink: ${link}`;

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
		navigator.clipboard.writeText(link);
	}

	return(
		<div id="user-profile" className="mobile-flex">
			<div>
				{
					readOnly

					? 	null

					:	<div className="flex-between" style={{marginBottom: '10px'}}>
							<div>
								<div className="text-left tiny-body" ><strong>my lyrnlink:&nbsp;</strong></div>
								<div className="flex">
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
							</div>
							<a className="btn-item" href={`https://twitter.com/intent/tweet?text=${tweetText}`}>Share <i className="fab fa-twitter" /></a>
						</div>
				}
				<div id="profile-header">
					<div id="user-profile-picture-wrapper">
						<img 
							src={state.user.profile_picture_url} 
							id="user-profile-picture"
							onClick={
								readOnly

								?	null

								: 	() => setProfilePicture(state.user.profile_picture_url || 1)
							}
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
							Sharing since {state.user.created}
						</div>
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
			<div style={{marginTop: '10px'}} />
			{readOnly ? <LikeButton id={state.user.id} liked={state.user.liked} /> : null}
		</div>
	);
};

export default UserProfile;