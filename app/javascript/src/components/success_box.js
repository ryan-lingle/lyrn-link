import React from 'react';

const SuccessBox = ({ success }) => {
    if (success) return(
        <div className="card card-success nohover">
            <div className="card-header-wrapper flex">
                <div className="card-text card-text-icon">
                <i className="fa-solid fa-shield-check"></i>
                </div>
                {success}
            </div>
        </div>
    );

    return <div></div>;
}

export default SuccessBox;