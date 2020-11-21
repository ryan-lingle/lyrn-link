import React from 'react';
import BtnSpinner from './btn_spinner.js';

const Submit = ({ copy, loading, style }) => {
    if (loading) return <BtnSpinner style={style} />;

    return(
        <input
            className="btn-navy"
            type="submit"
            value={copy}
            style={style}
        />
    );
}

export default Submit;