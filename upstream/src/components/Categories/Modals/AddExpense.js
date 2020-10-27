import React from 'react';
import { checkE } from '../../../utils/budget-utils';

export default class AddExpense extends React.Component {

    constructor() {
        super();

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.save = this.save.bind(this);

        this.state = {
            expenseName: '',
            expenseAmount: '',
            expenseDate: this.getTodayString()
        };
    }

    componentDidUpdate() {
        const params = this.props.params;
        if (params && params.category !== this.state.category) {
            this.setState({
                category: this.props.params.category,
                expenseName: '',
                expenseAmount: '',
                expenseDate: this.getTodayString()
            });
        }
    }

    getTodayString() {
        const date = new Date();
        return date.getFullYear() + '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('0' + date.getDate()).slice(-2);
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

    save() {
        const modal = window.M.Modal.getInstance(window.$('#add-expense-modal'));
        const category = this.state.category;
        const expenseName = this.state.expenseName;
        const expenseDate = this.state.expenseDate;
        const expenseAmount = this.state.expenseAmount || 0.00;

        if (!expenseName) {
            alert(`Please enter a name for the new ${category} expense.`);
            return;
        }

        this.props.save(expenseName, parseFloat(expenseAmount).toFixed(2), expenseDate, category, modal);

        setTimeout(() => {
            this.setState({
                expenseName: '',
                expenseAmount: '',
                expenseDate: this.getTodayString()
            });
        }, 500);
    }

    render() {
        const date = new Date();
        const minDateVal = date.getFullYear() + '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '-01';

        const maxDateVal = date.getFullYear() + '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
            (new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());

        const expenseValue = this.state.expenseAmount || '0.00';

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
                                    value={expenseValue}
                                    onChange={this.handleAmountChange}
                                    onKeyDown={checkE}
                                ></input>
                                <input
                                    className="txt-center"
                                    type="date"
                                    value={this.state.expenseDate}
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
                        <a className="waves-effect waves-light btn modal-save" onClick={this.save}>Save</a>
                    </div>
                </div>
            </div>
        );
    }
}