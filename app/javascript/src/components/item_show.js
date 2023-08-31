import React, { useContext } from 'react';
import { ShowMore, Editor, CommentList, NewComment } from '.';
import Context from '../context';

const ItemShow = ({ title, image_url, description, subtitle, ...item }) => {
    const { api, state } = useContext(Context);

    console.log(item)

    return(
        <div style={{marginTop: '20px', height: '100%'}}>
            <div className="flex items-start">
                <img
                    src={image_url}
                    width="200px"
                    className='flex-grow'
                    style={{marginRight: '20px'}}
                />
                <div>
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
                    {
                        !!state.item?.user_notes

                        &&   <div className='mt-5'>
                                <p className='b-copy' style={{ fontSize: '18px'}}>
                                    {state.item.user_name}'s notes
                                </p>
                                <Editor
                                    defaultValue={item.user_notes}
                                    onSave={user_notes => api.updateItem(item.id, { user_notes })}
                                    owner={item.owner_id === state.current_user_id}
                                />
                            </div>
                        
                        
                    }
                    {
                        !state.item?.user_notes && item.owner_id === state.current_user_id &&

                        <Editor
                            defaultValue={item.user_notes}
                            onSave={user_notes => api.updateItem(item.id, { user_notes })}
                            owner={item.owner_id === state.current_user_id}
                        />
                    }
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