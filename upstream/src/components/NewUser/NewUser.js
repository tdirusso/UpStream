import React from 'react';
import './NewUser.css';

class DefaulCategory extends React.Component {
	render() {
		return (
			<li className="collection-item categories-list">
				<h6>{this.props.category}</h6>
				<input type="number" className="allocation validate" required min="0.01" max={Number.MAX_SAFE_INTEGER} step="0.01" placeholder="$ 0.00" onKeyDown={this.props.checkE} onBlur={this.props.handleInputChange}></input>
				<div className="secondary-content">
					<i className="material-icons delete-icon" onClick={this.props.handleDelete} category={this.props.category}>delete</i>
				</div>
			</li>
		);
	}
}

class CustomCategory extends React.Component {
	render() {
		return (
			<li className="collection-item categories-list">
				<input type="text" className="custom-category-input validate" required maxLength="75" placeholder="New Category"></input>
				<input type="number" className="allocation validate" required min="0.01" max={Number.MAX_SAFE_INTEGER} step="0.01" placeholder="$ 0.00" onKeyDown={this.props.checkE} onBlur={this.props.handleInputChange}></input>
				<div className="secondary-content">
					<i className="material-icons delete-icon" onClick={this.props.handleDelete} index={this.props.index}>delete</i>
				</div>
			</li>
		);
	}
}

export default class NewUser extends React.Component {

	constructor() {
		super();
		this.fname = React.createRef();
		this.lname = React.createRef();
		this.income = React.createRef();

		this.basicsContainer = React.createRef();
		this.incomeContainer = React.createRef();
		this.categoriesContainer = React.createRef();

		this.progress = React.createRef();

		this.state = {
			fname: '',
			lname: '',
			income: '',
			incomeRemaining: '',
			incomeSpent: '',
			overBudget: false,
			defaultCategories: [
				'Groceries',
				'Transportation',
				'Housing',
				'Utilities',
				'Savings'
			],
			customCategories: []
		}

		this.updateIncome = this.updateIncome.bind(this);
		this.updateProgress = this.updateProgress.bind(this);
		this.removeDefaultCategory = this.removeDefaultCategory.bind(this);
		this.removeCustomCategory = this.removeCustomCategory.bind(this);
		this.addCategory = this.addCategory.bind(this);
	}

	componentDidMount() {
		this.basicsContainer.current.addEventListener('animationend', () => {
			this.basicsContainer.current.classList.remove('animate__fadeIn', 'animate__fadeOut');
		});

		this.incomeContainer.current.addEventListener('animationend', () => {
			this.incomeContainer.current.classList.remove('animate__fadeIn', 'animate__fadeOut');
		});

		this.categoriesContainer.current.addEventListener('animationend', () => {
			this.categoriesContainer.current.classList.remove('animate__fadeIn', 'animate__fadeOut');
		});
	}

	validateBasics(event) {
		event.preventDefault();

		const fnameValue = this.state.fname;
		const lnameValue = this.state.lname;

		if (fnameValue === '') {
			this.fname.current.focus();
			return;
		}

		if (lnameValue === '') {
			this.lname.current.focus();
			return;
		}

		this.showIncomeForm();
	}

	showIncomeForm() {
		const basicsContainer = this.basicsContainer.current;
		const incomeContainer = this.incomeContainer.current;

		const fadeInIncomeForm = () => {
			basicsContainer.classList.remove('show');
			basicsContainer.classList.add('hidden');
			incomeContainer.classList.add('animate__fadeIn', 'show');
			this.income.current.focus();
			basicsContainer.removeEventListener('animationend', fadeInIncomeForm);
		};

		basicsContainer.addEventListener('animationend', fadeInIncomeForm);
		basicsContainer.classList.add('animate__fadeOut');
	}

	updateBasic(field, event) {
		this.setState({ [field]: event.target.value });
	}

	updateIncome(event) {
		let incomeValue = event.target.value;

		if (!isNaN(incomeValue)) {
			let incomeValueParsed = parseFloat(incomeValue).toFixed(2);
			event.target.nextElementSibling.innerHTML = `$ ${incomeValueParsed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
			this.setState({ income: incomeValue });
		} else {
			event.target.nextElementSibling.innerHTML = '$ 0.00';
			this.setState({ income: '' });
		}
	}

	validateIncome(event) {
		event.preventDefault();

		const income = this.income.current;

		if (income.className.includes('invalid')) {
			income.focus();
			return;
		}

		this.setState({ income: parseFloat(this.state.income).toFixed(2) });
		this.showCategoriesForm();
	}

	backToBasicsForm(event) {
		event.preventDefault();
		const basicsContainer = this.basicsContainer.current;
		const incomeContainer = this.incomeContainer.current;

		const fadeInBasicsForm = () => {
			incomeContainer.classList.add('hidden');
			incomeContainer.classList.remove('show');
			basicsContainer.classList.remove('hidden');
			basicsContainer.classList.add('animate__fadeIn', 'show');
			incomeContainer.removeEventListener('animationend', fadeInBasicsForm);
		};

		incomeContainer.addEventListener('animationend', fadeInBasicsForm);
		incomeContainer.classList.add('animate__fadeOut');
	}

	showCategoriesForm() {
		const incomeContainer = this.incomeContainer.current;
		const categoriesContainer = this.categoriesContainer.current;

		const fadeInCategoriesForm = () => {
			incomeContainer.classList.remove('show');
			incomeContainer.classList.add('hidden');
			categoriesContainer.classList.add('animate__fadeIn', 'show');
			incomeContainer.removeEventListener('animationend', fadeInCategoriesForm);
		};

		incomeContainer.addEventListener('animationend', fadeInCategoriesForm);
		incomeContainer.classList.add('animate__fadeOut');
	}

	validateCategories(event) {
		event.preventDefault();
	}

	backToIncomeForm(event) {
		event.preventDefault();
		const incomeContainer = this.incomeContainer.current;
		const categoriesContainer = this.categoriesContainer.current;

		const fadeInIncomeForm = () => {
			categoriesContainer.classList.add('hidden');
			categoriesContainer.classList.remove('show');
			incomeContainer.classList.remove('hidden');
			incomeContainer.classList.add('animate__fadeIn', 'show');
			categoriesContainer.removeEventListener('animationend', fadeInIncomeForm);
		};

		categoriesContainer.addEventListener('animationend', fadeInIncomeForm);
		categoriesContainer.classList.add('animate__fadeOut');
	}

	updateProgress() {
		const income = this.state.income;

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
			this.setState({ overBudget: true });
		} else {
			this.setState({ overBudget: false });
		}

		this.setState({
			incomeSpent: incomeSpent,
			incomeRemaining: incomeRemaining.toFixed(2)
		});

		const progressBar = this.progress.current;
		const progress = (incomeSpent / income * 100).toFixed(0);

		progressBar.style.width = `${progress}%`;
	}

	removeDefaultCategory(event) {
		this.setState({ defaultCategories: this.state.defaultCategories.filter(category => category !== event.target.getAttribute('category')) }, () => this.updateProgress());
	}

	removeCustomCategory(event) {
		event.preventDefault();
		this.setState({ customCategories: this.state.customCategories.filter(category => category.props.index !== event.target.getAttribute('index')) }, () => this.updateProgress());
	}

	addCategory(event) {
		event.preventDefault();
		const currentCustomCategories = this.state.customCategories;
		currentCustomCategories.push(<CustomCategory key={`custom-category-${currentCustomCategories.length}`} index={currentCustomCategories.length.toString()} handleInputChange={this.updateProgress} handleDelete={this.removeCustomCategory} checkE={event => this.checkE(event)}/>);
		
		this.setState({ customCategories: currentCustomCategories }, () => {
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
			<div>
				<div className="inputs-container basics animate__animated animate__fadeIn animate__faster" ref={this.basicsContainer}>
					<h3 className="basics-header">Let's start with the basics</h3>
					<form>
						<div className="input-field">
							<input id="fname" type="text" className="validate" autoFocus={true} required maxLength="75" ref={this.fname} value={this.state.fname} onChange={(event) => this.updateBasic('fname', event)}></input>
							<label htmlFor="fname">First Name</label>
							<span className="helper-text" data-error="Please enter your first name" data-success=""></span>
						</div>
						<div className="input-field">
							<input id="lname" type="text" className="validate" ref={this.lname} required maxLength="75" value={this.state.lname} onChange={(event) => this.updateBasic('lname', event)}></input>
							<label htmlFor="lname">Last Name</label>
							<span className="helper-text" data-error="Please enter your last name" data-success=""></span>
						</div>
						<div className="submit-basics-button">
							<a className="waves-effect waves-light btn-large" href="#0" onClick={(event) => this.validateBasics(event)}>Next</a>
						</div>
					</form>
				</div>
				<div className="inputs-container income animate__animated animate__faster" ref={this.incomeContainer}>
					<h3 className="income-header">What is your <b>monthly</b> income?</h3>
					<h5 className="income-description">This will be used as a baseline and can be edited later</h5>
					<form>
						<div className="input-field">
							<input id="income" type="number" className="validate" required min="0.01" max={Number.MAX_SAFE_INTEGER} step="0.01" ref={this.income} placeholder="$ 0.00" onChange={this.updateIncome} onKeyDown={event => this.checkE(event)} value={this.state.income}></input>
							<label htmlFor="income">$ 0.00</label>
							<span className="helper-text" data-error="Please enter a valid monthly income" data-success=""></span>
						</div>
						<div className="back-to-basics-button">
							<a className="btn-floating btn-large waves-effect waves-light" href="#0" onClick={(event) => this.backToBasicsForm(event)}><i className="material-icons">arrow_back</i></a>
						</div>
						<div className="submit-income-button">
							<a className="waves-effect waves-light btn-large" href="#0" onClick={(event) => this.validateIncome(event)}>Next</a>
						</div>
					</form>
				</div>
				<div className="inputs-container categories animate__animated animate__faster" ref={this.categoriesContainer}>
					<h3 className="categories-header">Time to build the budget</h3>
					<h5 className="categories-description">
						Please select your initial budget categories, along with thier associated <b>monthly</b> allocations.
						These will be used as baselines and can be edited later
					</h5>
					<div className="income-remaining-container">
						<h5>$&nbsp;{this.state.incomeSpent ? this.state.incomeSpent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0.00'}</h5>
						<div className="progress">
							<div className="determinate" ref={this.progress}></div>
						</div>
						<h5>$&nbsp;{this.state.income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h5>
					</div>
					<h6 className="income-remaining" style={{ color: this.state.overBudget ? '#ff5555' : '#00d0d0' }}><b>$&nbsp;{this.state.incomeRemaining ? this.state.incomeRemaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : this.state.income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b> remaining</h6>
					<form>
						<ul className="collection">
							{
								this.state.defaultCategories.map((category, index) => <DefaulCategory category={category} key={`default-category-${index}`} handleInputChange={this.updateProgress} handleDelete={this.removeDefaultCategory} checkE={event => this.checkE(event)}/>)
							}
							{
								this.state.customCategories.map((category) => category)
							}
						</ul>
						<div className="add-category-button">
							<a className="waves-effect waves-light btn" href="#0" onClick={this.addCategory}>New Category</a>
						</div>
						<div className="back-to-income-button">
							<a className="btn-floating btn-large waves-effect waves-light" href="#0" onClick={(event) => this.backToIncomeForm(event)}><i className="material-icons">arrow_back</i></a>
						</div>
						<div className="submit-categories-button">
							<a className="waves-effect waves-light btn-large" href="#0" onClick={(event) => this.validateCategories(event)}>Finish</a>
						</div>
					</form>
				</div>
			</div>
		);
	}
}