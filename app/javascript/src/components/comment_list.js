import React from 'react';

const CommentList = ({ comments=[] }) => {

    return(
        <div className='comments-container'>
            {comments.map((comment, i) => (
                <div key={i} className='comment item-card'>
                    <img
                        width='50px'
                        height='50px'
                        className=''
                        src={comment.user.profile_picture_url}
                    />
                    <div style={{ marginLeft: '10px'}}>
                        <div className='flex'>
                            <span className='comment-handle b-copy'>/{comment.user.handle}</span>
                            <span className='comment-ts'>{comment.time_since}</span>
                        </div>
                        <div className='comment-text'>
                            {comment.text}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default CommentList;