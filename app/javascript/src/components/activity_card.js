import React, { useRef, useContext, useState, useEffect } from 'react';
import { BookmarkButton, LikeButton, JoinButton } from '../components';
import Icon from '../assets/icon.png';
import { withStuff } from "../hocs";


const ActivityCard = ({ api, state, href, icon, html, image_url, lastItem, owner_type }) => {
    const card = useRef();
    
    return(
        <a href={href} className="item-card-wrapper no-underline cursor-pointer" ref={card} >
            <div className={`item-card items-start activity-card p-3 ${owner_type == 'group' ? 'group-activity' : ''}`} >
                <div className="rounded-full text-center bg-black" style={{height: '50px', width: '50px'}}>
                    <i className={icon + " " + "text-white text-lg"} style={{marginTop: '16px'}} />
                </div>
                <div className='ml-3'>
                    <div className="item-box m-0">
                        <img src={image_url || Icon} className="item-image" />
                    </div>
                    
                    <div className="item-details truncate m-0 mt-2">
                        <div className="truncate" dangerouslySetInnerHTML={{ __html: html }}>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default withStuff(ActivityCard, {
    api: true,
    state: true,
});