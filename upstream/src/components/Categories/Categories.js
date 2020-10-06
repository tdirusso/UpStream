import React from 'react';
import './Categories.css';
import Navigation from '../Navigation/Navigation';
import Loader from '../Loader/Loader';
import DatePicker from '../DatePicker/DatePicker';
import { months } from '../../constants/constants';
import Modals from './Modals/Modals';
import CategoriesList from './CategoriesList';

const { ipcRenderer } = window.require('electron');

function CopyLastMonthButton() {
    return (
        <div className="copy-button">
            <a className="waves-effect waves-light btn-large"
                href="#0"
                onClick={(event) => { }}>
                Copy Categories and Income from Last Month
            </a>
        </div>
    );
}

function ImportButton() {
    return (
        <div className="import-button">
            <a className="waves-effect waves-light btn-large"
                href="#0"
                onClick={(event) => { }}>
                Import Expenses
            </a>
        </div>
    );
}

function AddCategoryButton() {
    return (
        <div className="category-button">
            <a className="waves-effect waves-light btn-large"
                href="#0"
                onClick={(event) => { }}>
                Add Category
            </a>
        </div>
    );
}

function EditIncomeButton(props) {
    return (
        <div className="edit-income-btn">
            <span>Edit Income</span>
            <a className="btn-floating btn-small waves-effect waves-light"
                href="#0"
                onClick={(event) => props.handleClick(event)}>
                <i className="material-icons">attach_money</i>
            </a>
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
        this.saveIncome = this.saveIncome.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    componentDidMount() {
        const list = this.categoriesList.current;
        const collapsible = window.M.Collapsible.init(list, {
            accordion: false
        });
        collapsible.open(0);

        const modals = window.$$('.input-modal');
        window.M.Modal.init(modals, {});

        this.setState({ collapsible });
    }

    openModal(event, id, modalParams) {
        event.preventDefault();
        this.setState({ modalParams }, () => window.M.Modal.getInstance(window.$(`#${id}`)).open());
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

        const totalSpent = expenses.reduce((prev, cur) => prev + parseFloat(cur.amount), 0).toFixed(2);

        const stateObject = {
            month,
            year,
            categories,
            expenses,
            income,
            totalSpent,
            entryKey
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

    saveIncome(income, modal) {
        const key = this.state.entryKey;

        ipcRenderer.invoke('income:save', { income, key })
            .then((isSaved) => {
                if (isSaved) {
                    modal.close();
                    this.setState({ income });
                }
            });
    }

    updateCategory(oldName, newName, allocation, modal) {
        const key = this.state.entryKey;

        ipcRenderer.invoke('category:update', { oldName, newName, allocation, key })
            .then((isSaved) => {
                if (isSaved) {
                    modal.close();
                    const categories = this.state.categories;
                    const expenses = this.state.expenses;

                    categories.some(category => {
                        if (category.name === oldName) {
                            category.allocation = allocation;
                            if (newName !== oldName) {
                                category.name = newName;
                            }
                            return true;
                        }
                    });

                    expenses.forEach(expense => {
                        if (expense.category === oldName) {
                            expense.category = newName;
                        }
                    });

                    this.setState({ categories, expenses });
                }
            });
    }

    render() {
        const categories = this.state.categories;
        const displayIfCategories = categories.length === 0 ? { display: 'none' } : { display: 'flex' };
        const displayIfNoCategories = categories.length === 0 ? { display: 'flex' } : { display: 'none' };

        let progressWidth = '0%';
        if (this.state.income !== '0.00') {
            progressWidth = (parseFloat(this.state.totalSpent) / parseFloat(this.state.income) * 100).toFixed(2) + '%';
        }

        const progressStatusClass = parseFloat(progressWidth) <= 100 ? 'underBudget' : 'overBudget';

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
                    <div className="main-row category-progress">
                        <h5>{this.state.totalSpent.toDollarString()}</h5>
                        <div className="progress">
                            <div className={`determinate ${progressStatusClass}`} style={{ width: progressWidth }}></div>
                        </div>
                        <h5>{this.state.income.toDollarString()}</h5>
                    </div>
                    <div className="main-row">
                        <EditIncomeButton handleClick={(event) => this.openModal(event, 'edit-income-modal')} />
                    </div>
                    <div className="main-row" style={displayIfNoCategories}>
                        <CopyLastMonthButton />
                    </div>
                    <div className="main-row" style={displayIfCategories}>
                        <ul className="collapsible main-categories-list" ref={this.categoriesList}>
                            <CategoriesList categories={this.state.categories} expenses={this.state.expenses} modalOpener={this.openModal} />
                        </ul>
                    </div>
                    <div className="main-row" style={displayIfCategories}>
                        <AddCategoryButton />
                        <ImportButton />
                    </div>
                    <div className="main-row" style={displayIfNoCategories}>
                        <AddCategoryButton />
                    </div>
                    <Modals
                        curData={this.state}
                        modalParams={this.state.modalParams}
                        saveIncome={this.saveIncome}
                        updateCategory={this.updateCategory}
                    />
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