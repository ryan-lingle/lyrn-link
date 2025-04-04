import React, { useContext, useState, useEffect, useRef } from 'react';
import { Form, ImageEditor } from '../components';
import Context from '../context';
import AvatarEditor from 'react-avatar-editor';
import { userParams } from '../params';

const Profile = () => {
    const { api, state } = useContext(Context);
    const fileInput = useRef();
    const [password, setPassword] = useState('');
    const [passwordCopy, setPasswordCopy] = useState('');
    const [profilePicture, setProfilePicture] = useState(state.user.profile_picture_url);

    useEffect(() => {
        api.getUser();
    }, []);

    function updateUser(params) {
        api.updateUser(state.user.id, params);
    } 

    function changePassword() {        
        if (PasswordConditions.allConditionsPass(password, passwordCopy)) {
            api.updateUser(state.user.id, { password }, 'update_password');
        }
    }

    function handleFile({ target }) {
        setProfilePicture(target.files[0]);
    }

    return(
        <div id="profile">
            <div id="page-header">
                <div className="page-title">{state.user.first_name}'s Profile</div>
            </div>
            <div id="section-header">
                <div className="section-title">
                <i class="fa-regular fa-id-card"></i>
                    &nbsp;
                    Profile Details</div>
            </div>
            <Form
                onSubmit={updateUser}
                submitCopy="Save Changes"
                type="update_user"
                inputs={userParams(state.user)}
            />
            <div id="section-header">
            <div className="section-title">
                <i class="fa-regular fa-camera-retro"/>
                    &nbsp;
                    Profile Photo</div>
            </div>
            <input 
                type="file" 
                ref={fileInput}
                style={{display: 'none'}}
                accept="image/jpeg,image/png,image/webp" 
                onChange={({ target }) => setProfilePicture(target.files[0])} 
            />
            <div className="input-primary profile-picture-input" >
                <div onClick={() => fileInput.current.click()}>
                    {
                        state.user.profile_picture_url

                        ?   <div>
                                <img src={state.user.profile_picture_url} />
                                <i className="fa-solid fa-user-edit"></i>
                            </div>

                        :  <button className="btn">Upload</button>

                    }
                </div>
            </div>
            <ImageEditor 
                image={profilePicture}
                onSubmit={() => setProfilePicture(null)}
            />
        </div>
    );
}

export default Profile;