import React from 'react';
import { checkE } from '../../../utils/budget-utils';

export default class EditIncome extends React.Component {

    constructor(props) {
        super();

        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);

        this.state = {
            income: props.income,
            entryKey: props.entryKey
        };
    }

    componentDidUpdate() {
        if (this.props.entryKey !== this.state.entryKey) {
            this.setState({
                income: this.props.income,
                entryKey: this.props.entryKey
            });
        }
    }

    handleChange(event) {
        this.setState({ income: event.target.value });
    }

    save() {
        const modal = window.M.Modal.getInstance(window.$('#edit-income-modal'));
        const income = this.state.income;
        this.props.save(income, modal);
    }

    render() {
        const incomeValue = this.state.income ? this.state.income : '0.00';

        return (
            <div>
                <div className="modal modal-fixed-footer input-modal" id="edit-income-modal">
                    <div className="modal-content">
                        <div className="modal-title">
                            <h4>Edit Income</h4>
                        </div>
                        <div className="modal-body">
                            <div className="income-input-container">
                                <input
                                    className="edit-income-field"
                                    type="number"
                                    placeholder="$ 0.00"
                                    min="0.01"
                                    max={Number.MAX_SAFE_INTEGER}
                                    step="0.01"
                                    value={this.state.income}
                                    onChange={this.handleChange}
                                    onKeyDown={checkE}
                                ></input>
                            </div>
                            <div className="income-input-label">{incomeValue.toDollarString()}</div>
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