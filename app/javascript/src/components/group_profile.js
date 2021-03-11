import React, { useContext, useRef, useState } from 'react';
import Context from '../context';
import { Editable, ImageEditor, JoinButton, PrivateToggle, ProfileTabs } from '../components';
import { Tooltip } from 'react-tippy';
import Icon from '../assets/icon.png';

const GroupProfile = () => {
	const { api, state } = useContext(Context);
	const readOnly = state.groupReadOnly;
    const fileInput = useRef();
    const [groupImage, setGroupImage] = useState(null);
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

	function destroyGroup() {
        if (window.confirm('Are you sure you want to delete this group?')) {
            api.destroyGroup(state.group.id);
        };
    };

    function copyGroupLink() {
		navigator.clipboard.writeText(link);
	}

	const DeleteGroup = () => (
		<div className="btn-red" style={{marginRight: '5px'}} onClick={destroyGroup}>
		    <i className="far fa-trash" style={{marginRight: '4px'}}/>
		    Group
		</div>
	);

	return(
		<div id="lyrn">
			{/*
				readOnly

				? 	null

				:	<div className="mylink">
						<div className="flex-between big-body">
							<div>
								<strong>Group Sign Up Link:&nbsp;</strong>
								<a className="big-body" href={`/${state.user.handle}`} target="_blank" >
									https://lyrn.link/{state.user.handle}
								</a>
							</div>
							<Tooltip
								title="Copy LyrnLink"
								position= "right"
								trigger= "mouseenter"
								inertia= "true"
								transitionFlip= "true"
								delay='0'
							>
								<i 
									className="far fa-copy btn-copy"
									style={{fontSize: 'x-small', marginLeft: '5px'}}
									onClick={copyGroupLink}
								/>
							</Tooltip>
						</div>
					</div>
			*/}
			<div id="user-profile" >
				<div id="profile-header">
					<div id="user-profile-picture-wrapper">
						<img 
							src={state.group.image} 
							id="user-profile-picture"
							onClick={
								readOnly

								?	null

								: 	() => setGroupImage(state.group.image || 1)
							}
						/>
					</div>
					<ImageEditor 
						image={groupImage} 
						onUpdate={async (image) => { await api.updateGroupImage(state.group.id, image); setGroupImage(null);}}
						onClose={() => setGroupImage(null)}
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
						{readOnly ? <JoinButton id={state.group.id} joined={state.group.joined} show={true} /> : <DeleteGroup />}
						<div style={{marginTop: '5px'}}>
							{readOnly ? null : <PrivateToggle />}
						</div>
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
				<div className="non-mobile-only flex" style={{marginTop: '10px'}}>
					{readOnly ? <JoinButton id={state.group.id} joined={state.group.joined} show={true} /> : <DeleteGroup />}
					{readOnly ? null : <PrivateToggle />}
				</div>
			</div>
		</div>
	);
};

export default GroupProfile;
