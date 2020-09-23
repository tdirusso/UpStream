import React from 'react';
import './Navigation.css';

export default class Navigation extends React.Component {
    render() {
        return (
            <div className="side-navigation">
                <h1 className="nav-title">
                    <span className="up-span">Up</span>
                    <span className="stream-span">Stream</span>
                </h1>
                <ul className="nav-list">
                    <li className="nav-button active">Dashboard</li>
                    <li className="nav-button">Categories</li>
                    <li className="nav-button">Reports</li>
                    <li className="nav-button">Settings</li>
                </ul>
            </div>
        );
    }
}