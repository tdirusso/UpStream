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
                                <td>{expense.amount.toDollarString()}</td>
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
                    <div className="edit-category-btn">
                        <a className="btn-floating btn-small waves-effect waves-light">
                            <i className="material-icons">edit</i>
                        </a>
                        <span>Edit Category</span>
                    </div>
                    <ExpensesTable expenses={categoryExpenses} />
                    <div className="add-expense-btn">
                        <a className="btn-floating btn-small waves-effect waves-light">
                            <i className="material-icons">add</i>
                        </a>
                        <span>Add Expense</span>
                    </div>
                </div>
            </li>
        )
    });
}

function CopyLastMonthButton() {
    return (
        <div className="copy-button">
            <a className="waves-effect waves-light btn-large" href="#0" onClick={(event) => { }}>Copy Categories and Income from Last Month</a>
        </div>
    );
}

function ImportButton() {
    return (
        <div className="import-button">
            <a className="waves-effect waves-light btn-large" href="#0" onClick={(event) => { }}>Import Expenses</a>
        </div>
    );
}

function SaveButton() {
    return (
        <div className="save-button">
            <a className="waves-effect waves-light btn-large" href="#0" onClick={(event) => { }}>Save</a>
        </div>
    );
}

function AddCategoryButton() {
    return (
        <div className="category-button">
            <a className="waves-effect waves-light btn-large" href="#0" onClick={(event) => { }}>Add Category</a>
        </div>
    );
}

class CategoriesMain extends React.Component {
    constructor(props) {
        super();

        let initialDate = new Date();

        const savedDate = sessionStorage.getItem('categories-date');
        if (savedDate) {
            initialDate = new Date(savedDate);
        }

        const initialState = this.computeBudgetItems(initialDate, props);
        this.state = initialState;

        this.categoriesList = React.createRef();
        this.changeDate = this.changeDate.bind(this);
        this.prevMonth = this.prevMonth.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
    }

    computeBudgetItems(date, props) {
        let returnInitialState = false;

        if (typeof this.props === 'undefined') {
            returnInitialState = true;
            this.props = props;
        };

        const month = months[date.getMonth()];
        const year = date.getFullYear();

        const entryKey = `${month.toLowerCase()}-${year}`;
        const entriesObj = this.props.budget.entries[entryKey] || {};

        const categories = entriesObj.categories || [];
        categories.sort((a, b) => (a.name > b.name) ? 1 : -1);

        const expenses = entriesObj.expenses || [];
        const income = entriesObj.income || '0.00';

        const stateObject = {
            month,
            year,
            categories,
            expenses,
            income
        };

        sessionStorage.setItem('categories-date', date);

        if (returnInitialState) {
            return stateObject;
        } else {
            this.setState(stateObject, () => {
                if (this.state.collapsible) {
                    const collapsible = this.state.collapsible;
                    const firstCategory = collapsible.el.firstChild;
                    if (firstCategory && !firstCategory.className.includes('active')) {
                        collapsible.open(0);
                    }
                }
            });
        }
    }

    componentDidMount() {
        const list = this.categoriesList.current;

        const instance = window.M.Collapsible.init(list, {
            accordion: false
        });

        instance.open(0);
        this.setState({ collapsible: instance });
    }

    changeDate(date) {
        this.computeBudgetItems(new Date(date));
    }

    prevMonth(pickerInstance) {
        const date = new Date(pickerInstance.date);
        date.setMonth(date.getMonth() - 1);
        this.updateValueAndState(pickerInstance, date);
    }

    nextMonth(pickerInstance) {
        const date = new Date(pickerInstance.date);
        date.setMonth(date.getMonth() + 1);
        this.updateValueAndState(pickerInstance, date);
    }

    updateValueAndState(pickerInstance, newDate) {
        pickerInstance.setDate(newDate);

        const prevMonth = months[newDate.getMonth()];
        const prevYear = newDate.getFullYear();

        pickerInstance.$el[0].value = prevMonth + ' ' + prevYear;

        this.computeBudgetItems(newDate);
    }

    render() {
        const categories = this.state.categories;
        const displayIfCategories = categories.length === 0 ? { display: 'none' } : { display: 'flex' };
        const displayIfNoCategories = categories.length === 0 ? { display: 'flex' } : { display: 'none' };

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
                    <div className="main-row" style={displayIfNoCategories}>
                        <CopyLastMonthButton />
                    </div>
                    <div className="main-row" style={displayIfCategories}>
                        <ul className="collapsible main-categories-list" ref={this.categoriesList}>
                            <CategoriesList categories={this.state.categories} expenses={this.state.expenses} />
                        </ul>
                    </div>
                    <div className="main-row" style={displayIfCategories}>
                        <AddCategoryButton />
                        <ImportButton />
                        <SaveButton />
                    </div>
                    <div className="main-row" style={displayIfNoCategories}>
                        <AddCategoryButton />
                    </div>
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