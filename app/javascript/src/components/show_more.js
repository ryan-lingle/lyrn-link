import React, { useState } from 'react';

const ShowMore = ({ text, maxLength }) => {
    const [show, setShow] = useState(false);

    const exceedsMaxLength = (text || '').length > maxLength;

    const copy = show ? text : (text || '').substring(0, maxLength) + (exceedsMaxLength ? '...' : '');

    return(
       <div>
            <span>{copy}</span>
            {
                exceedsMaxLength &&

                <span
                    onClick={() => setShow(prev => !prev)}
                    className='b-copy'
                    style={{ 
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        marginLeft: '5px',
                    }}
                >
                    Show {show ? "less" : "more"}
                </span>
            }
        </div>
    );
};

export default ShowMore;
