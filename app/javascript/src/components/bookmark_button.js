import React, { useState, useContext, useEffect } from 'react';
import Context from '../context';

const BookmarkButton = ({ id, bookmarked, count }) => {

	const { api } = useContext(Context);
	const [bookmarkState, setBookmarkState] = useState(bookmarked);
	const [countState, setCountState] = useState(count);

	useEffect(() => {
		setBookmarkState(bookmarked);
		setCountState(count);
	}, [bookmarked, count]);

	async function handleClick(e) {
		e.stopPropagation();
		const res = bookmarkState ? await api.destroyBookmark(id) : await api.createBookmark(id);
		setBookmarkState(res);
	};

	return(
		<div className="flex">
			<i 
				className={`${bookmarkState ? 'fas' : 'fal'} bookmark-icon fa-bookmark ${bookmarkState ? 'bookmarked' : ''}`} 
				onClick={handleClick}
			/>
			<div className="bookmark-count">
				{countState || ''}
			</div>
		</div>
	);
}; 

export default BookmarkButton;