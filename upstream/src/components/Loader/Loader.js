import React from 'react';
import './Loader.css';

export default class Loader extends React.Component {

    render() {
        return (
            <div className="loader">
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            </div>
        );
    }
}