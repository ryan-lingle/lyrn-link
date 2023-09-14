import React, { useRef, useContext, useState, useEffect } from 'react';
import { BookmarkButton, LikeButton, JoinButton } from '../components';
import Icon from '../assets/icon.png';
import { withStuff } from "../hocs";


const ActivityCard = ({ api, state, href, icon, html, image_url, lastItem, owner_type, owner_avatar, owner_href }) => {
    const card = useRef();
    
    console.log(owner_avatar)
    return(
        <a href={href} className="item-card-wrapper no-underline cursor-pointer" ref={card} >
            <div className={`item-card items-center activity-card p-3 ${owner_type == 'group' ? 'group-activity' : ''}`} >
                <a href={owner_href}>
                    <img className="rounded-full" style={{width: '40px', height: '40px'}} src={owner_avatar} />
                </a>
                <div class="flex flex-grow items-center">
                    <div className='ml-3 flex-1 flex-grow'>
                        <div className="item-details truncate m-0 mt-2">
                            <div className="truncate text-base" dangerouslySetInnerHTML={{ __html: html }}>
                            </div>
                        </div>
                    </div>
                    <div className="item-box m-0 ml-auto">
                        <img src={image_url || Icon} className="item-image" />
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