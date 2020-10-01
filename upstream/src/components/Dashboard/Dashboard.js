import React from 'react';
import Loader from '../Loader/Loader';
import './Dashboard.css';
import Chart from 'chart.js';
import Navigation from '../Navigation/Navigation';
import DatePicker from '../DatePicker/DatePicker';
import { months, colors } from '../../constants/constants';
import { calcSpent, calcCategoryExpenses, calcSpendingMap } from '../../utils/budget-utils';

const { ipcRenderer } = window.require('electron');

class CategoryChart extends React.Component {
    constructor() {
        super();
        this.chart = React.createRef();
    }

    createChart() {
        const spendingMapKeys = Object.keys(this.props.spendingMap);

        new Chart(this.chart.current, {
            type: 'pie',
            data: {
                datasets: [{
                    data: spendingMapKeys.map(key => this.props.spendingMap[key]),
                    backgroundColor: colors.pieChart.slice(0, spendingMapKeys.length),
                    borderWidth: 1
                }],
                labels: spendingMapKeys
            },
            options: {
                legend: {
                    labels: {
                        fontFamily: 'Roboto',
                        fontColor: '#404040',
                        fontSize: 15
                    }
                }
            }
        })
    }

    componentDidMount() {
        if (this.isSpendingData()) {
            this.createChart();
        }
    }

    componentDidUpdate() {
        Chart.helpers.each(Chart.instances, (instance) => {
            instance.destroy();
        });

        if (this.isSpendingData()) {
            this.createChart();
        }
    }

    isSpendingData = () => Object.keys(this.props.spendingMap).length > 0;

    render() {
        return (
            <div className="chart-container dash-container">
                <h5 className="section-title">Expense Chart</h5>
                {
                    this.isSpendingData() ?
                        <canvas ref={this.chart}></canvas> :
                        <h6 className="no-data">No expense data for current month.</h6>
                }
            </div>
        );
    }
}

function BudgetStatus(props) {
    return (
        <div className="status-container dash-container">
            <h5 className="section-title">Status</h5>
            <table className="centered status">
                <tbody>
                    <tr className="no-border-bottom">
                        <td className="align-left"><b>Total</b></td>
                        <td className="align-right">$ {props.total}</td>
                    </tr>
                    <tr>
                        <td className="align-left"><b>Spent</b></td>
                        <td className="align-right">&ndash; $ {props.spent}</td>
                    </tr>
                    <tr>
                        <td className="align-left"><b>Remaining</b></td>
                        <td className="align-right" style={{ color: props.remainingColor }}>
                            {
                                props.remainingValue < 0 ? '–' : null
                            }
                                $
                                {
                                props.remainingText
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function BudgetTable(props) {
    return (
        <div className="table-container dash-container">
            <h5 className="section-title">Expense Table</h5>
            <table className="centered expenses">
                <tbody>
                    <tr>
                        <td style={{ width: '25%' }}><b>Category</b></td>
                        <td><b>Budget</b></td>
                        <td><b>Spent</b></td>
                        <td><b>Remaining</b></td>
                        <td style={{ width: '33%' }}><b>% of Budget</b></td>
                    </tr>
                    {
                        props.categoryExpenses.map(expenseData => {
                            return (
                                <tr key={expenseData.name}>
                                    <td>{expenseData.name}</td>
                                    <td>{expenseData.allocation}</td>
                                    <td>$ {expenseData.spent}</td>
                                    <td style={{ color: expenseData.statusColor }}>
                                        {expenseData.remaining < 0 ? '–' : null} $ {Math.abs(expenseData.remaining).toFixed(2)}
                                    </td>
                                    <td className="table-progress" style={{ color: expenseData.statusColor }}>
                                        <div className="progress">
                                            <div
                                                className={`determinate ${expenseData.remaining < 0 ? 'overBudget' : ''}`}
                                                style={{ width: expenseData.percentage + '%' }}>
                                            </div>
                                        </div>
                                        <span className="table-percentage">{expenseData.percentage} %</span>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

class DashboardMain extends React.Component {
    constructor(props) {
        super();

        this.changeDate = this.changeDate.bind(this);
        this.prevMonth = this.prevMonth.bind(this);
        this.nextMonth = this.nextMonth.bind(this);

        let initialDate = new Date();

        const savedDate = sessionStorage.getItem('dashboard-date');
        if (savedDate) {
            initialDate = new Date(savedDate);
        }

        const initialState = this.computeBudgetItems(initialDate, props);
        this.state = initialState;
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

        const expenses = entriesObj.expenses || [];

        const total = entriesObj.income || '0.00';
        const spent = calcSpent(expenses);
        const remaining = (parseFloat(total) - parseFloat(spent)).toFixed(2);
        const remainingColor = remaining < 0 ? colors.overBudget : colors.underBudget;
        const remainingText = remaining < 0 ? Math.abs(remaining) : remaining;

        const categories = entriesObj.categories || [];
        const categoryExpenses = calcCategoryExpenses(expenses, categories);

        const spendingMap = calcSpendingMap(expenses);

        const stateObject = {
            total,
            spent,
            remaining,
            remainingColor,
            remainingText,
            categoryExpenses,
            spendingMap,
            month,
            year
        };

        sessionStorage.setItem('dashboard-date', date);

        if (returnInitialState) {
            return stateObject;
        } else {
            this.setState(stateObject);
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

    render() {
        return (
            <div className="dash-main animate__animated animate__fadeIn animate__faster">
                <div className="dash-main-content">
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
                        <BudgetStatus
                            total={this.state.total}
                            spent={this.state.spent}
                            remainingValue={this.state.remaining}
                            remainingText={this.state.remainingText}
                            remainingColor={this.state.remainingColor}
                        />
                        <CategoryChart spendingMap={this.state.spendingMap} />
                    </div>
                    <div className="main-row">
                        <BudgetTable categoryExpenses={this.state.categoryExpenses} />
                    </div>
                </div>
            </div>
        );
    }
}

export default class Dashboard extends React.Component {

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
                        <DashboardMain budget={this.state.budget} />
                }
            </div>
        );
    }
}