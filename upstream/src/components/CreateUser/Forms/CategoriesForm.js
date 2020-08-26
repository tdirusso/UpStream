import React from 'react';
import './Forms.css';
import { CustomCategory, DefaultCategory } from '../Categories/Categories';

export default class CategoriesForm extends React.Component {

    constructor() {
        super();
        this.categoriesContainer = React.createRef();
        this.progress = React.createRef();

        this.updateProgress = this.updateProgress.bind(this);
        this.removeDefaultCategory = this.removeDefaultCategory.bind(this);
        this.removeCustomCategory = this.removeCustomCategory.bind(this);
        this.addCategory = this.addCategory.bind(this);
    }

    componentDidMount() {
        this.categoriesContainer.current.addEventListener('animationend', () => {
            this.categoriesContainer.current.classList.remove('animate__fadeIn', 'animate__fadeOut');
        });
    }

    updateProgress() {
        const income = this.props.state.income;

        const incomeSpent = Array.from(document.getElementsByClassName('allocation')).reduce((total, currentField) => {
            let amount = currentField.value;
            if (amount) {
                amount = parseFloat(amount).toFixed(2);
                currentField.value = amount;
                return total + parseFloat(amount);
            } else {
                return total;
            }
        }, 0).toFixed(2);

        const incomeRemaining = parseFloat(income - incomeSpent);

        if (incomeRemaining < 0) {
            this.props.setState({ overBudget: true });
        } else {
            this.props.setState({ overBudget: false });
        }

        this.props.setState({
            incomeSpent: incomeSpent,
            incomeRemaining: incomeRemaining.toFixed(2)
        });

        const progressBar = this.progress.current;
        const progress = (incomeSpent / income * 100).toFixed(0);

        progressBar.style.width = `${progress}%`;
    }

    removeDefaultCategory(event) {
        this.props.setState({ defaultCategories: this.props.state.defaultCategories.filter(category => category !== event.target.getAttribute('category')) }, () => this.updateProgress());
    }

    removeCustomCategory(event) {
        event.preventDefault();
        this.props.setState({ customCategories: this.props.state.customCategories.filter(category => category.props.index !== event.target.getAttribute('index')) }, () => this.updateProgress());
    }

    addCategory(event) {
        event.preventDefault();
        const currentCustomCategories = this.props.state.customCategories;
        currentCustomCategories.push(<CustomCategory key={`custom-category-${currentCustomCategories.length}`} index={currentCustomCategories.length.toString()} handleInputChange={this.updateProgress} handleDelete={this.removeCustomCategory} checkE={event => this.checkE(event)} />);

        this.props.setState({ customCategories: currentCustomCategories }, () => {
            const customInputs = document.getElementsByClassName('custom-category-input');
            const lastInput = customInputs[customInputs.length - 1];
            if (lastInput) {
                lastInput.focus();
            }
        });
    }

    checkE(event) {
        if (event.keyCode === 69) event.preventDefault();
    }

    render() {
        return (
            <div className="inputs-container categories animate__animated animate__faster" ref={this.categoriesContainer}>
                <h3 className="categories-header">Time to build the budget</h3>
                <h5 className="categories-description">
                    Please select your initial budget categories, along with thier associated <b>monthly</b> allocations.
						These will be used as baselines and can be edited later
					</h5>
                <div className="income-remaining-container">
                    <h5>$&nbsp;{this.props.state.incomeSpent ? this.props.state.incomeSpent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0.00'}</h5>
                    <div className="progress">
                        <div className="determinate" ref={this.progress}></div>
                    </div>
                    <h5>$&nbsp;{this.props.state.income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h5>
                </div>
                <h6 className="income-remaining" style={{ color: this.props.state.overBudget ? '#ff5555' : '#00d0d0' }}><b>$&nbsp;{this.props.state.incomeRemaining ? this.props.state.incomeRemaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : this.props.state.income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b> remaining</h6>
                <form>
                    <ul className="collection">
                        {this.props.state.defaultCategories.map((category, index) => <DefaultCategory category={category} key={`default-category-${index}`} handleInputChange={this.updateProgress} handleDelete={this.removeDefaultCategory} checkE={event => this.checkE(event)} />)}
                        {this.props.state.customCategories.map((category) => category)}
                    </ul>
                    <div className="add-category-button">
                        <a className="waves-effect waves-light btn" href="#0" onClick={this.addCategory}>New Category</a>
                    </div>
                    <div className="back-to-income-button">
                        <a className="btn-floating btn-large waves-effect waves-light" href="#0" onClick={(event) => this.props.back(event)}><i className="material-icons">arrow_back</i></a>
                    </div>
                    <div className="submit-categories-button">
                        <a className="waves-effect waves-light btn-large" href="#0" onClick={(event) => this.props.submit(event)}>Finish</a>
                    </div>
                </form>
            </div>
        );
    }
}