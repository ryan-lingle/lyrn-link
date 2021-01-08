import React from 'react';
import { capitalize } from '../utils';

const ListTab = ({ type, onClick, current, readOnly }) => {

    return(
        <div 
            className={`list-tab ${current ? 'current-list-tab' : ''}`}
            onClick={onClick}
        >
        	<div className="tab-heading">
	            <div>{capitalize(type)}</div>
	        </div>
        </div>
    );
};

export default ListTab;