import React from 'react';
import { capitalize } from '../utils';

const ListTab = ({ type, onClick, onDestroy, current, readOnly }) => {

	function destroy(e) {
		e.stopPropagation();
		if (window.confirm('Are you sure you want to delete this list?')) {
			onDestroy();
		};
	};

    return(
        <div 
            className={`list-tab ${current ? 'current-list-tab' : ''}`}
            onClick={onClick}
        >
        	<div className="mega-heading">
	            <div>{capitalize(type)}</div>
				<div>{readOnly ? null : <i className="fas fa-times-circle delete-list icon-delete" onClick={destroy} />}</div>
	        </div>
	        
        </div>
    );
};

export default ListTab;