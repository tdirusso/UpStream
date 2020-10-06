import React from 'react';
import { checkE } from '../../../utils/budget-utils';

export default class EditCategory extends React.Component {

    constructor(props) {
        super();

        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleAllocationChange = this.handleAllocationChange.bind(this);
        this.save = this.save.bind(this);

        this.state = {
            categories: props.categories
        };
    }

    componentDidUpdate() {
        const paramsPassed = this.props.params !== undefined;
        const setParamState = this.state.category !== undefined;

        if (paramsPassed && !setParamState) {
            this.setState({
                category: this.props.params.category,
                categories: this.props.categories,
                allocation: this.props.params.allocation
            });
        }
    }

    handleCategoryChange(event) {
        this.setState({ category: event.target.value });
    }

    handleAllocationChange(event) {
        this.setState({ allocation: event.target.value });
    }

    save() {
        const modal = window.M.Modal.getInstance(window.$('#edit-category-modal'));
        const category = this.state.category;
        const allocation = this.state.allocation;
        const categories = this.state.categories;
        const oldCategory = this.props.params.category;

        const duplicate = categories.some(existingCategory => existingCategory.name === category && category !== oldCategory);

        if (duplicate) {
            alert(`You already have a "${category}" category created for this month.`);
            return;
        }

        this.props.save(oldCategory, category, allocation, modal);
    }

    render() {

        const categoryValue = this.state.category ? this.state.category : '';
        const allocationValue = this.state.allocation ? this.state.allocation : '0.00';

        return (
            <div>
                <div className="modal modal-fixed-footer input-modal" id="edit-category-modal">
                    <div className="modal-content">
                        <div className="modal-title">
                            <h4>Edit Category</h4>
                        </div>
                        <div className="modal-body">
                            <div className="edit-category-field">
                                <input
                                    className="edit-category-field"
                                    type="text"
                                    placeholder="Category Name"
                                    value={categoryValue}
                                    onChange={this.handleCategoryChange}
                                ></input>
                                <input
                                    className="edit-allocation-field"
                                    type="number"
                                    placeholder="$ 0.00"
                                    min="0.01"
                                    max={Number.MAX_SAFE_INTEGER}
                                    step="0.01"
                                    value={allocationValue}
                                    onChange={this.handleAllocationChange}
                                    onKeyDown={checkE}
                                ></input>
                                <div className="allocation-input-label">{allocationValue.toDollarString()}</div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <a className="waves-effect waves-light btn modal-close">Cancel</a>
                        <a className="waves-effect waves-light btn modal-save" onClick={this.save}>Save</a>
                    </div>
                </div>
            </div>
        );
    }
}