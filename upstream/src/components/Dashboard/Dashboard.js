import React from 'react';
import Loader from '../Loader/Loader';
import './Dashboard.css';
import Chart from 'chart.js';
import Navigation from '../Navigation/Navigation';
import { months, colors } from '../../constants/constants';
import { calcSpent, calcCategoryExpenses, calcSpendingMap } from '../../utils/budget-utils';

const { ipcRenderer } = window.require('electron');

class DateHeader extends React.Component {
    constructor() {
        super();
        this.monthPicker = React.createRef();

        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
    }

    componentDidMount() {
        const picker = this.monthPicker.current;
        const month = this.props.month;
        const year = this.props.year;
        const defaultDate = new Date(month + ' ' + year);

        window.M.Datepicker.init(picker, {
            defaultDate: defaultDate,
            setDefaultDate: true,
            format: 'mmmm yyyy',
            onClose: () => {
                const date = this.monthPicker.current.value
                this.props.changeDate(date);
            }
        });
    }

    prev() {
        const pickerInstance = window.M.Datepicker.getInstance(this.monthPicker.current);
        this.props.prevMonth(pickerInstance);
    }

    next() {
        const pickerInstance = window.M.Datepicker.getInstance(this.monthPicker.current);
        this.props.nextMonth(pickerInstance);
    }

    render() {
        return (
            <div className="date-header">
                <i className="material-icons" onClick={this.prev}>arrow_back</i>
                <input type="text" className="datepicker dashboard" ref={this.monthPicker}></input>
                <i className="material-icons" onClick={this.next}>arrow_forward</i>
            </div>
        )
    }
}

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

class BudgetStatus extends React.Component {
    render() {
        return (
            <div className="status-container dash-container">
                <h5 className="section-title">Status</h5>
                <table className="centered status">
                    <tbody>
                        <tr className="no-border-bottom">
                            <td className="align-left"><b>Total</b></td>
                            <td className="align-right">$ {this.props.total}</td>
                        </tr>
                        <tr>
                            <td className="align-left"><b>Spent</b></td>
                            <td className="align-right">&ndash; $ {this.props.spent}</td>
                        </tr>
                        <tr>
                            <td className="align-left"><b>Remaining</b></td>
                            <td className="align-right" style={{ color: this.props.remainingColor }}>
                                {
                                    this.props.remainingValue < 0 ? '–' : null
                                }
                                $
                                {
                                    this.props.remainingText
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

class BudgetTable extends React.Component {
    render() {
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
                            this.props.categoryExpenses.map(expenseData => {
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
}

class Main extends React.Component {
    constructor(props) {
        super();

        this.changeDate = this.changeDate.bind(this);
        this.prevMonth = this.prevMonth.bind(this);
        this.nextMonth = this.nextMonth.bind(this);

        const initialState = this.computeBudgetItems(new Date(), props);
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
        const entries = this.props.budget.entries[entryKey] || [];

        const total = this.props.budget.income;
        const spent = calcSpent(entries);
        const remaining = (parseFloat(total) - parseFloat(spent)).toFixed(2);
        const remainingColor = remaining < 0 ? colors.overBudget : colors.underBudget;
        const remainingText = remaining < 0 ? Math.abs(remaining) : remaining;

        const categories = this.props.budget.categories;
        const categoryExpenses = calcCategoryExpenses(entries, categories);

        const spendingMap = calcSpendingMap(entries);

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
            <div className="main animate__animated animate__fadeIn animate__faster">
                <Navigation />
                <div className="main-content">
                    <div className="dash-row">
                        <DateHeader
                            month={this.state.month}
                            year={this.state.year}
                            changeDate={this.changeDate}
                            prevMonth={this.prevMonth}
                            nextMonth={this.nextMonth}
                        />
                    </div>
                    <div className="dash-row">
                        <BudgetStatus
                            total={this.state.total}
                            spent={this.state.spent}
                            remainingValue={this.state.remaining}
                            remainingText={this.state.remainingText}
                            remainingColor={this.state.remainingColor}
                        />
                        <CategoryChart spendingMap={this.state.spendingMap} />
                    </div>
                    <div className="dash-row">
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
        setTimeout(() => {
            ipcRenderer.invoke('budget:get').then(budget => {
                this.setState({
                    loading: false,
                    budget: budget
                });
            });
        }, 1000);
    }

    render() {
        return (
            <div className="animate__animated animate__fadeIn animate__faster">
                {this.state.loading ? <Loader /> : <Main budget={this.state.budget} />}
            </div>
        );
    }
}