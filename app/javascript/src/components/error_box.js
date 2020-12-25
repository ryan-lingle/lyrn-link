import React from 'react';

const ErrorBox = ({ error }) => {
    if (error) return(
        <div className="card card-error nohover">
            <div className="card-header-wrapper">
                <div className="card-text card-text-icon">
                    <i className="fas fa-exclamation-triangle"></i>
                </div>
                {error}
            </div>
        </div>
    );

    return <div></div>;
}

export default ErrorBox;