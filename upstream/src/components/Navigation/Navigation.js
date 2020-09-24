import React from 'react';
import './Navigation.css';

export default class Navigation extends React.Component {

    open(view) {
        window.location.assign(`#/${view}`);
    }

    render() {
        const views = {
            dashboard: 'dashboard',
            categories: 'categories'
        };

        const isDashActive = window.location.hash.includes(views.dashboard) ? 'active' : '';
        const isCategoriesActive = window.location.hash.includes(views.categories) ? 'active' : '';

        return (
            <div className="side-navigation">
                <h1 className="nav-title">
                    <span className="up-span">Up</span>
                    <span className="stream-span">Stream</span>
                </h1>
                <ul className="nav-list">
                    <li className={`nav-button ${isDashActive}`} onClick={() => this.open(views.dashboard)}>Dashboard</li>
                    <li className={`nav-button ${isCategoriesActive}`} onClick={() => this.open(views.categories)}>Categories</li>
                    <li className={`nav-button `}>Reports</li>
                    <li className={`nav-button `}>Settings</li>
                </ul>
            </div>
        );
    }
}