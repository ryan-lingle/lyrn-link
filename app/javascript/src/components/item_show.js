import React, { useContext } from 'react';
import { ShowMore, Editor, CommentList, NewComment } from '.';
import Context from '../context';

const ItemShow = ({ title, image_url, description, subtitle, ...item }) => {
    const { api, state } = useContext(Context);

    console.log(item)

    return(
        <div style={{marginTop: '20px', height: '100%', overflowY: 'scroll'}}>
            <div className="flex items-start">
                <img
                    src={image_url}
                    width="200px"
                    className='flex-grow sticky top-0'
                    style={{marginRight: '20px'}}
                />
                <div className='overflow-y-scroll'>
                    <h1 style={{marginTop: '10px'}}>{title}</h1>
                    <h2>{subtitle}</h2>
                    {
                        !!description &&

                        <div>
                            <p className='b-copy' style={{ fontSize: '18px', margin: '10px 0px'}}>Description</p>
                            <ShowMore
                                text={description}
                                maxLength={300}
                            />
                        </div>
                    }
                    <Editor
                        defaultValue={item.user_notes}
                        onSave={user_notes => api.updateItem(item.id, { user_notes })}
                        owner={item.owner_id === state.current_user_id}
                        userName={item.user_name}
                    />
                    <p className='b-copy' style={{ fontSize: '18px', margin: '20px 0px'}}>Comments</p>
                    <CommentList comments={item.comments} />
                    {
                        state.current_user_id &&
                        
                        <NewComment item_id={item.id} />
                    } 
                </div>
            </div>
        </div>
    );
};

export default ItemShow;