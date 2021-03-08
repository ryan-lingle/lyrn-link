import React, { useContext, useRef, useState } from 'react';
import Context from '../context';
import { Editable, ImageEditor, LikeButton, ProfileTabs } from '../components';
import { Tooltip } from 'react-tippy';
import Icon from '../assets/icon.png';

const GroupProfile = () => {
	const { api, state } = useContext(Context);
	const readOnly = state.readOnly;
    const fileInput = useRef();
    const [profilePicture, setProfilePicture] = useState(null);
    const link = 'https://lyrn.link/' + state.user.handle;
    const tweetText = `Check out my LyrnLink: ${link}`;

	function updateName(name) {
		api.updateGroup(state.group.id, { name });
	};

	function updateHandle(handle) {
		api.updateGroup(state.group.id, { handle });
	};

	function updateDescription(description) {
		api.updateGroup(state.group.id, { description });
	};

	return(
		<div id="lyrn">
			<div id="user-profile" >
				<div id="profile-header">
					<div id="user-profile-picture-wrapper">
						<img 
							src={Icon} 
							id="user-profile-picture"
							onClick={
								readOnly

								?	null

								: 	() => setProfilePicture(state.group.image_url || 1)
							}
						/>
					</div>
					<ImageEditor 
						image={profilePicture} 
						onClose={() => setProfilePicture(null)}
					/>
					<div className="flex-grow profile-info" >
						<div className="user-name truncate">
							<Editable
								readOnly={readOnly}
								className="big-heading"
								value={state.group.name}
								onUpdate={updateName}
								defaultValue="( name )"
							/>
						</div>
						<div className="user-handle" style={{marginTop: '-5px'}}>
							<span className="main-heading">/g/</span>
							<Editable
								readOnly={readOnly}
								className="main-heading"
								value={state.group.handle}
								onUpdate={updateHandle}
								defaultValue="( handle )"
							/>
						</div>
					</div>
					<div className="mobile-only" >
						{/* join/leave button */}
					</div>
				</div>
				<Editable
					readOnly={readOnly}
					className="user-description"
					value={state.group.description}
					onUpdate={updateDescription}
					textArea={true}
					defaultValue="I don't have a description."
				/>
				<div className="non-mobile-only" style={{marginTop: '10px'}}>
					{/* join/leave button */}
				</div>
			</div>
		</div>
	);
};

export default GroupProfile;
