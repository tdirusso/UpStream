import React from 'react';
import Loader from '../Loader/Loader';
import './Dashboard.css';
import Chart from 'chart.js';
import { months, colors } from '../../constants/constants';

const { ipcRenderer } = window.require('electron');

class Navigation extends React.Component {
    render() {
        return (
            <div className="side-navigation">
                <h1 className="nav-title">
                    <span className="up-span">Up</span>
                    <span className="stream-span">Stream</span>
                </h1>
                <ul className="nav-list">
                    <li className="nav-button active">Dashboard</li>
                    <li className="nav-button">Categories</li>
                    <li className="nav-button">Reports</li>
                    <li className="nav-button">Settings</li>
                </ul>
            </div>
        );
    }
}

class Actions extends React.Component {
    render() {
        return (
            <div>Import / Add Item / Change Month</div>
        );
    }
}

class CategoryChart extends React.Component {
    constructor(props) {
        super();
        this.chart = React.createRef();

        const spendingMap = {};

        props.entries.forEach(entry => {
            const spent = spendingMap[entry.category];
            if (!spent) {
                spendingMap[entry.category] = entry.amount;
            } else {
                spendingMap[entry.category] = (parseFloat(entry.amount) + parseFloat(spent)).toFixed(2)
            }
        });

        this.state = { spendingMap };
    }

    createChart() {
        new Chart(this.chart.current, {
            type: 'pie',
            data: {
                datasets: [{
                    data: Object.keys(this.state.spendingMap).map(key => this.state.spendingMap[key]),
                    backgroundColor: colors.pieChart.slice(0, Object.keys(this.state.spendingMap).length),
                    borderWidth: 1
                }],
                labels: Object.keys(this.state.spendingMap)
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
        this.createChart();
    }

    componentDidUpdate() {
        this.createChart();
    }

    render() {
        return (
            <div className="chart-container dash-container">
                <h5 className="section-title">Expense Chart</h5>
                <canvas ref={this.chart}></canvas>
            </div>
        );
    }
}

class BudgetStatus extends React.Component {
    constructor(props) {
        super();
        const remainingColor = props.remaining < 0 ? colors.overBudget : colors.underBudget;
        const remainingValue = props.remaining < 0 ? Math.abs(props.remaining) : props.remaining;

        this.state = { remainingColor, remainingValue }
    }

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
                            <td className="align-right" style={{ color: this.state.remainingColor }}>
                                {
                                    this.props.remaining < 0 ? '–' : null
                                }
                                $
                                {
                                    this.state.remainingValue
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
    constructor(props) {
        super();

        const categoriesData = props.categories.map(category => {
            const spent = props.entries.reduce((previous, current) => {
                if (current.category === category.name) {
                    return previous + parseFloat(current.amount)
                }
                return previous;
            }, 0).toFixed(2);

            const remaining = (parseFloat(category.allocation) - parseFloat(spent)).toFixed(2);
            const percentage = ((parseFloat(spent) / parseFloat(category.allocation)) * 100).toFixed(2)

            return {
                name: category.name,
                allocation: category.allocation,
                spent: spent,
                remaining: remaining,
                percentage: percentage,
                statusColor: remaining < 0 ? colors.overBudget : colors.underBudget
            };
        });

        this.state = { categoriesData };
    }

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
                            this.state.categoriesData.map(categoryData => {
                                return (
                                    <tr key={categoryData.name}>
                                        <td>{categoryData.name}</td>
                                        <td>{categoryData.allocation}</td>
                                        <td>$ {categoryData.spent}</td>
                                        <td style={{ color: categoryData.statusColor }}>
                                            {categoryData.remaining < 0 ? '–' : null} $ {Math.abs(categoryData.remaining).toFixed(2)}
                                        </td>
                                        <td className="table-progress" style={{ color: categoryData.statusColor }}>
                                            <div className="progress">
                                                <div className={`determinate ${categoryData.remaining < 0 ? 'overBudget' : ''}`} style={{ width: categoryData.percentage + '%' }}></div>
                                            </div>
                                            <span className="table-percentage">{categoryData.percentage} %</span>
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

        const now = new Date();
        const entryKey = `${months[now.getMonth()].toLowerCase()}-${now.getFullYear()}`;
        const entries = props.budget.entries[entryKey];

        const total = props.budget.income;
        const spent = entries.reduce((previous, current) => (previous + parseFloat(current.amount)), 0).toFixed(2);
        const remaining = (parseFloat(total) - parseFloat(spent)).toFixed(2);

        const categories = props.budget.categories;

        this.state = { entries, total, spent, remaining, categories };
    }

    render() {
        return (
            <div className="main animate__animated animate__fadeIn animate__faster">
                <Navigation />
                <div className="main-content">
                    <div className="dash-row">
                        <BudgetStatus total={this.state.total} spent={this.state.spent} remaining={this.state.remaining} />
                        <CategoryChart entries={this.state.entries} />
                    </div>
                    <div className="dash-row">
                        <BudgetTable categories={this.state.categories} entries={this.state.entries} />
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