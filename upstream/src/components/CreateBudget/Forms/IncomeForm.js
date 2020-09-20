import React from 'react';
import './Forms.css';
import { checkE } from '../../../utils/budget-utils';

export default class IncomeForm extends React.Component {

    constructor() {
        super();
        this.income = React.createRef();
        this.incomeContainer = React.createRef();

        this.updateIncome = this.updateIncome.bind(this);
    }

    componentDidMount() {
        this.income.current.focus();
        this.incomeContainer.current.addEventListener('animationend', () => {
            this.incomeContainer.current.classList.remove('animate__fadeIn', 'animate__fadeOut');
        });
    }

    updateIncome(event) {
        let incomeValue = event.target.value;

        if (!isNaN(incomeValue)) {
            let incomeValueParsed = parseFloat(incomeValue).toFixed(2);
            event.target.nextElementSibling.innerHTML = incomeValueParsed.toDollarString();
            this.props.setState({ income: incomeValue });
        } else {
            event.target.nextElementSibling.innerHTML = '$ 0.00';
            this.props.setState({ income: '' });
        }
    }

    validateIncome(event) {
        event.preventDefault();

        const income = this.income.current;

        if (income.className.includes('invalid')) {
            income.focus();
            return;
        }

        this.props.setState({ income: parseFloat(this.props.state.income).toFixed(2) });
        this.props.next();
    }

    render() {
        return (
            <div className="inputs-container income animate__animated animate__fadeIn animate__faster" ref={this.incomeContainer}>
                <h3 className="income-header">What is your <b>monthly</b> income?</h3>
                <h5 className="income-description">This will be used as a baseline and can be edited later</h5>
                <form>
                    <div className="input-field">
                        <input
                            id="income"
                            type="number"
                            className="validate"
                            required
                            min="0.01"
                            max={Number.MAX_SAFE_INTEGER}
                            step="0.01"
                            ref={this.income}
                            placeholder="$ 0.00"
                            onChange={this.updateIncome}
                            onKeyDown={event => checkE(event)}
                            value={this.props.state.income}>
                        </input>
                        <label htmlFor="income">$ 0.00</label>
                        <span className="helper-text" data-error="Please enter a valid monthly income" data-success=""></span>
                    </div>
                    <div className="submit-income-button">
                        <a className="waves-effect waves-light btn-large" href="#0" onClick={(event) => this.validateIncome(event)}>Next</a>
                    </div>
                </form>
            </div>
        );
    }
}