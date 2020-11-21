import React from 'react';

const SuccessBox = ({ success }) => {
    if (success) return(
        <div className="card card-success nohover">
            <div className="card-header-wrapper">
                <div className="card-text card-text-icon">
                <i class="fas fa-shield-check"></i>
                </div>
                {success}
            </div>
        </div>
    );

    return <div></div>;
}

export default SuccessBox;