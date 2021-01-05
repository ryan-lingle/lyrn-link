import React, { useState, useContext, useEffect } from 'react';
import Context from '../context';

const BookmarkButton = ({ id, bookmarked, authed }) => {

	useEffect(() => {
		setBookmarkState(bookmarked);
	}, [bookmarked]);

	const { api } = useContext(Context);
	const [bookmarkState, setBookmarkState] = useState(bookmarked);

	async function handleClick(e) {
		e.stopPropagation();
		const res = bookmarkState ? await api.destroyBookmark(id) : await api.createBookmark(id);
		setBookmarkState(res);
	};

	return(
		<i 
			className={`${bookmarkState ? 'fas' : 'fal'} bookmark-icon fa-bookmark ${bookmarkState ? 'bookmarked' : ''}`} 
			onClick={handleClick}
		/>
	);
}; 

export default BookmarkButton;