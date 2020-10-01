import React from 'react';
import './Categories.css';
import Navigation from '../Navigation/Navigation';
import Loader from '../Loader/Loader';
import DatePicker from '../DatePicker/DatePicker';
import { months } from '../../constants/constants';

const { ipcRenderer } = window.require('electron');

function ExpensesTable(props) {
    return (
        <table className="highlight expense-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.expenses.map((expense, index) => {
                        const key = `${expense.category}-expense-${index}`;
                        return (
                            <tr key={key}>
                                <td>{expense.date}</td>
                                <td>{expense.name}</td>
                                <td>{expense.amount}</td>
                                <td>
                                    <i className="material-icons delete-icon">remove_circle_outline</i>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

function CategoriesList(props) {
    return props.categories.map(category => {
        const categoryExpenses = props.expenses.filter(expense => expense.category === category.name);
        categoryExpenses.sort((a, b) => (Date.parse(a.date) > Date.parse(b.date)) ? 1 : -1);

        return (
            <li key={category.name}>
                <div className="collapsible-header">
                    {category.name}
                </div>
                <div className="collapsible-body">
                    <ExpensesTable expenses={categoryExpenses} />
                    <a className="btn-floating btn waves-effect waves-light add-item-btn">
                        <i className="material-icons">add</i>
                    </a>
                </div>
            </li>
        )
    })
}

class CategoriesMain extends React.Component {
    constructor(props) {
        super();

        let initialDate = new Date();

        const savedDate = sessionStorage.getItem('categories-date');
        if (savedDate) {
            initialDate = new Date(savedDate);
        }

        const month = months[initialDate.getMonth()];
        const year = initialDate.getFullYear();

        const entryKey = month.toLowerCase() + '-' + year;
        const entriesObj = props.budget.entries[entryKey] || {};

        const categories = entriesObj.categories || [];
        categories.sort((a, b) => (a.name > b.name) ? 1 : -1);

        const expenses = entriesObj.expenses || [];
        const income = entriesObj.income || '0.00';

        const initialState = {
            month,
            year,
            categories,
            expenses,
            income
        };

        this.state = initialState;

        this.categoriesList = React.createRef();
    }

    componentDidMount() {
        const list = this.categoriesList.current;

        const instance = window.M.Collapsible.init(list, {
            accordion: false
        });

        instance.open(0);
    }

    changeDate() {

    }

    prevMonth() {

    }

    nextMonth() {

    }

    render() {
        return (
            <div className="categories-main animate__animated animate__fadeIn animate__faster">
                <div className="categories-main-content">
                    <div className="main-row">
                        <DatePicker
                            month={this.state.month}
                            year={this.state.year}
                            changeDate={this.changeDate}
                            prev={this.prevMonth}
                            next={this.nextMonth}
                        />
                    </div>
                    <div className="main-row">
                        <h5>Total Income {this.state.income.toDollarString()}</h5>
                    </div>
                    <div className="main-row">
                        <ul className="collapsible main-categories-list" ref={this.categoriesList}>
                            <CategoriesList categories={this.state.categories} expenses={this.state.expenses} />
                        </ul>
                    </div>
                    <div className="main-row">
                        <div className="import-button">
                            <a className="waves-effect waves-light btn-large" href="#0" onClick={(event) => { }}>Save</a>
                        </div>
                    </div>

                    {/* <div className="main-row">
                        <div className="import-button">
                            <a className="waves-effect waves-light btn-large" href="#0" onClick={(event) => { }}>Import</a>
                        </div>
                    </div>
                    <div className="main-row">
                        <div className="import-button">
                            <a className="waves-effect waves-light btn-large" href="#0" onClick={(event) => { }}>Copy Last Month's Categories &amp; Income</a>
                        </div>
                    </div>*/}
                </div>
            </div>
        );
    }
}


export default class Categories extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            budget: {}
        };
    }

    componentDidMount() {
        ipcRenderer.invoke('budget:get').then(budget => {
            this.setState({
                loading: false,
                budget: budget
            });
        });
    }

    render() {
        return (
            <div>
                <Navigation />
                {
                    this.state.loading ?
                        <div style={{ marginLeft: '200px' }}>
                            <Loader />
                        </div> :
                        <CategoriesMain budget={this.state.budget} />
                }
            </div>
        );
    }
}