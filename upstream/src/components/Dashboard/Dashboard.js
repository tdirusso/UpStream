import React from 'react';
import Loader from '../Loader/Loader';
import './Dashboard.css';
import Chart from 'chart.js';
const { ipcRenderer } = window.require('electron');

const chartPalette = ['#f76c82', '#61ddbc', '#fbd277', '#74b0f4', '#b3a4ee', '#b4df80', '#d94452', '#36ba9b', '#f5b946', '#9479da', '#d56fab', '#424852'];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class BudgetTable extends React.Component {
    render() {
        return (
            <div>Table</div>
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
                    backgroundColor: chartPalette.slice(0, Object.keys(this.state.spendingMap).length),
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
        const remainingColor = props.remaining < 0 ? '#ff5555' : '#00d0d0';
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
                            <td><b>Total</b></td>
                            <td>$ {this.props.total}</td>
                        </tr>
                        <tr>
                            <td><b>Spent</b></td>
                            <td>&ndash; $ {this.props.spent}</td>
                        </tr>
                        <tr className="no-border-bottom">
                            <td><b>Remaining</b></td>
                            <td style={{ color: this.state.remainingColor }}>
                                {this.props.remaining < 0 ? '–' : null} $ {this.state.remainingValue} 
                            </td>
                        </tr>
                    </tbody>
                </table>
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

class Navigation extends React.Component {
    render() {
        return (
            <div className="side-navigation">
                <h1 className="nav-title"><span className="up-span">Up</span><span className="stream-span">Stream</span></h1>
                <ul className="nav-list">
                    <li className="nav-button active">Dashboard</li>
                    <li className="nav-button">Reports</li>
                    <li className="nav-button">Categories</li>
                    <li className="nav-button">Settings</li>
                </ul>
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

        this.state = { entries, entryKey, total, spent, remaining };
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