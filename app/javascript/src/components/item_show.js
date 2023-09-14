import React, { useContext } from 'react';
import { ShowMore, Editor, CommentList, NewComment } from '.';
import Context from '../context';

const ItemShow = ({ title, image_url, description, ...item }) => {
    const { api, state } = useContext(Context);

    console.log(item)

    return(
        <div style={{marginTop: '20px', height: '100%', overflowY: 'scroll'}}>
            <div>
                <div className='flex text-center'>
                    <img className="rounded-sm" src={image_url} style={{maxWidth: '100px', maxHeight: '100px'}} />

                    <div className='ml-5'>
                        <a href={item.url} target="_blank">
                            <h2 style={{marginTop: '10px'}}>
                                {title}
                                {item.url && <i className='fa-solid fa-external-link-alt text-base' style={{marginLeft: '10px'}}/>}
                            </h2>
                        </a>
                        <div className="b-copy" style={{fontSize: '18px'}} >{item.creator}</div>
                    </div>
                </div>
                <div>
                    {
                        !!description &&

                        <div>
                            <p className='b-copy' style={{ fontSize: '18px', margin: '20px 0px 10px 0px'}}>Description</p>
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
                    <p className='b-copy' style={{ fontSize: '18px', margin: '30px 0px 10px 0px'}}>Comments</p>
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