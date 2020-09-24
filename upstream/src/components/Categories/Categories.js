import React from 'react';
import './Categories.css';
import Navigation from '../Navigation/Navigation';

const { ipcRenderer } = window.require('electron');

export default class Categories extends React.Component {

    constructor() {
        super();
    }


    render() {
        return (
            <div>
                <Navigation />
            </div>
        );
    }
}