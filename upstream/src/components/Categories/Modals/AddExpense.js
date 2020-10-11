import React from 'react';
import { checkE } from '../../../utils/budget-utils';

export default class AddExpense extends React.Component {

    constructor() {
        super();

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        // this.save = this.save.bind(this);

        this.state = {
            expenseName: '',
            expenseAmount: '',
            expenseDate: ''
        };

    }

    componentDidUpdate() {
        const params = this.props.params;
        if (params && params.category !== this.state.category) {
            this.setState({
                category: this.props.params.category,
                expenseName: '',
                expenseAmount: '',
                expenseDate: ''
            });
        }
    }

    handleNameChange(event) {
        this.setState({ expenseName: event.target.value });
    }

    handleAmountChange(event) {
        this.setState({ expenseAmount: event.target.value });
    }

    handleDateChange(event) {
        this.setState({ expenseDate: event.target.value });
    }

    // save() {
    //     const modal = window.M.Modal.getInstance(window.$('#edit-category-modal'));
    //     const category = this.state.category;
    //     const allocation = this.state.allocation;
    //     const categories = this.state.categories;
    //     const oldCategory = this.props.params.category;

    //     const duplicate = categories.some(existingCategory => existingCategory.name === category && category !== oldCategory);

    //     if (duplicate) {
    //         alert(`You already have a "${category}" category created for this month.`);
    //         return;
    //     }

    //     this.props.save(oldCategory, category, allocation, modal);
    // }

    render() {
        const date = new Date();
        const defaultDateVal = date.getFullYear() + '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('0' + date.getDate()).slice(-2);

        const minDateVal = date.getFullYear() + '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '-01';

        const maxDateVal = date.getFullYear() + '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
            (new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate())

        return (
            <div>
                <div className="modal modal-fixed-footer input-modal" id="add-expense-modal">
                    <div className="modal-content">
                        <div className="modal-title">
                            <h4>New Expense</h4>
                        </div>
                        <div className="modal-body">
                            <div className="new-expense-fields">
                                <input
                                    className="txt-center"
                                    type="text"
                                    disabled
                                    placeholder={this.state.category}
                                    style={{ marginBottom: '40px', fontWeight: '500', borderBottom: 'none' }}
                                ></input>
                                <input
                                    className="txt-center"
                                    type="text"
                                    placeholder="Expense Name"
                                    value={this.state.expenseName}
                                    onChange={this.handleNameChange}
                                ></input>
                                <input
                                    className="txt-center"
                                    type="number"
                                    placeholder="$ 0.00"
                                    min="0.01"
                                    max={Number.MAX_SAFE_INTEGER}
                                    step="0.01"
                                    value={this.state.expenseAmount}
                                    onChange={this.handleAmountChange}
                                    onKeyDown={checkE}
                                ></input>
                                <input
                                    className="txt-center"
                                    type="date"
                                    value={this.state.expenseDate || defaultDateVal}
                                    style={{ paddingLeft: '25px' }}
                                    onChange={this.handleDateChange}
                                    max={maxDateVal}
                                    min={minDateVal}
                                ></input>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <a className="waves-effect waves-light btn modal-close">Cancel</a>
                        <a className="waves-effect waves-light btn modal-save" >Save</a>
                    </div>
                </div>
            </div>
        );
    }
}