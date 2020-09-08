import React from 'react';
import './Categories.css';

export const DefaultCategory = class DefaulCategory extends React.Component {
    render() {
        return (
            <li className="collection-item categories-list">
                <h6>{this.props.category}</h6>
                <input type="number" className="allocation" required min="0.01" max={Number.MAX_SAFE_INTEGER} step="0.01" placeholder="$ 0.00" onKeyDown={this.props.checkE} onBlur={this.props.handleInputChange}></input>
                <div className="secondary-content">
                    <i className="material-icons delete-icon" onClick={this.props.handleDelete} category={this.props.category}>delete</i>
                </div>
            </li>
        );
    }
}

export const CustomCategory = class CustomCategory extends React.Component {
    render() {
        return (
            <li className="collection-item categories-list">
                <input type="text" className="custom-category-input validate" required maxLength="75" placeholder="New Category"></input>
                <input type="number" className="allocation" required min="0.01" max={Number.MAX_SAFE_INTEGER} step="0.01" placeholder="$ 0.00" onKeyDown={this.props.checkE} onBlur={this.props.handleInputChange}></input>
                <div className="secondary-content">
                    <i className="material-icons delete-icon" onClick={this.props.handleDelete} index={this.props.index}>delete</i>
                </div>
            </li>
        );
    }
}