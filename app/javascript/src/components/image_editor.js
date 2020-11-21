import React, { useState, useRef, useContext } from 'react';
import Context from '../context';
import AvatarEditor from 'react-avatar-editor';
import { Submit } from '../components';

const ImageEditor = ({ image, onSubmit }) => {
    const { api, state } = useContext(Context);
    const editor = useRef();
    const [scale, setScale] = useState(1);

    async function getCroppedImage(e) {
        e.preventDefault();
        const canvas = editor.current.getImage().toDataURL();
        const res = await api.updateProfilePicture(state.user.id, canvas);
        if (res) onSubmit();
    }

    if (image) return(
        <div>
            <AvatarEditor
                image={image}
                ref={editor}
                width={200}
                height={200}
                borderRadius={500}
                border={50}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={scale}
                rotate={0}
                id="edit-profile-pic"
            />
            <div className="profile-pic-slider">
                <input
                    type="range"
                    className="slider"
                    id="scale-slider"
                    min="1"
                    max="3"
                    step="0.01"
                    value={scale}
                    onChange={({ target }) => setScale(parseFloat(target.value))}
                />
                <br/>
                <form onSubmit={getCroppedImage} >
                    <Submit
                        copy="Save Changes"
                        loading={state.loading.profile_picture}
                    />
                </form>
            </div>
        </div>
    );

    return <div></div>;

};

export default ImageEditor;