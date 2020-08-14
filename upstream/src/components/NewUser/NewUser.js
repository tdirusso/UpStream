import React from 'react';
import './NewUser.css';

class Test extends React.Component {
	render() {
		return(
			<div>testett</div>
		);
	}
}

export default class NewUser extends React.Component {

	constructor() {
		super();
		this.fname = React.createRef();
		this.lname = React.createRef();
		this.email = React.createRef();
		this.password = React.createRef();
		this.income = React.createRef();

		this.basicsContainer = React.createRef();
		this.incomeContainer = React.createRef();
		this.categoriesContainer = React.createRef();
	}

	componentDidMount() {
		this.basicsContainer.current.addEventListener('animationend', () => {
			this.basicsContainer.current.classList.remove('animate__fadeIn', 'animate__fadeOut');
		});

		this.incomeContainer.current.addEventListener('animationend', () => {
			this.incomeContainer.current.classList.remove('animate__fadeIn', 'animate__fadeOut');
		});
	}

	validateBasics(event) {
		event.preventDefault();

		const fnameValue = this.fname.current.value;
		const lnameValue = this.lname.current.value;
		const emailValue = this.email.current.value;
		const passwordValue = this.password.current.value;

		if (fnameValue === '') {
			this.fname.current.focus();
			return;
		}

		if (lnameValue === '') {
			this.lname.current.focus();
			return;
		}

		if (emailValue === '' || this.email.current.className.includes('invalid')) {
			this.email.current.focus();
			return;
		}

		if (passwordValue === '') {
			this.password.current.focus();
			return;
		}

		this.showIncomeScreen();
	}

	showIncomeScreen() {
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

	updateIncomeLabel() {
		const incomeValue = parseFloat(this.income.current.value);
		if (!isNaN(incomeValue)) {
			this.income.current.nextElementSibling.innerHTML = `$ ${incomeValue.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
		} else {
			this.income.current.nextElementSibling.innerHTML = '$ 0.00';
		}
	}

	validateIncome(event) {
		event.preventDefault();

		const income = this.income.current;

		if (income.value === '' || income.className.includes('invalid')) {
			income.focus();
			return;
		}

		this.showCategoriesScreen();
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

	showCategoriesScreen() {
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
	}

	renderCategories() {
		let c = ['test', 'test2'];
		return <Test />;
	}

	render() {
		return (
			<div>
				<Test/>
				<div className="inputs-container basics animate__animated animate__fadeIn animate__faster" ref={this.basicsContainer}>
					<h3 className="basics-header">Let's start with the basics</h3>
					<form>
						<div className="input-field">
							<input id="fname" type="text" className="validate" autoFocus={true} required ref={this.fname} value="test"></input>
							<label htmlFor="fname">First Name</label>
							<span className="helper-text" data-error="Please enter your first name" data-success=""></span>
						</div>
						<div className="input-field">
							<input id="lname" type="text" className="validate" ref={this.lname} required value="test"></input>
							<label htmlFor="lname">Last Name</label>
							<span className="helper-text" data-error="Please enter your last name" data-success=""></span>
						</div>
						<div className="input-field">
							<input id="email" type="email" className="validate" ref={this.email} required value="test@gmail.com"></input>
							<label htmlFor="email">Email</label>
							<span className="helper-text" data-error="Please enter a valid email address" data-success=""></span>
						</div>
						<div className="input-field">
							<input id="password" type="password" className="validate" ref={this.password} required value="test"></input>
							<label htmlFor="password">Password</label>
							<span className="helper-text" data-error="Please enter a password" data-success=""></span>
						</div>
						<div className="submit-basics-button">
							<a className="waves-effect waves-light btn-large" href="#s" onClick={(event) => this.validateBasics(event)}>Next</a>
						</div>
					</form>
				</div>

				<div className="inputs-container income animate__animated animate__faster" ref={this.incomeContainer}>
					<h3 className="income-header">What is your monthly income?</h3>
					<h5 className="income-description">This will be used as a baseline and can be edited later</h5>
					<form>
						<div className="input-field">
							<input id="income" type="number" className="validate" required min="0.01" max={Number.MAX_SAFE_INTEGER} step="0.01" ref={this.income} placeholder="$ 0.00" onChange={() => this.updateIncomeLabel()}></input>
							<label htmlFor="income">$ 0.00</label>
							<span className="helper-text" data-error="Please enter a valid monthly income" data-success=""></span>
						</div>
						<div className="back-to-basics-button">
							<a className="btn-floating btn-large waves-effect waves-light" href="#none" onClick={(event) => this.backToBasicsForm(event)}><i className="material-icons">arrow_back</i></a>
						</div>
						<div className="submit-income-button">
							<a className="waves-effect waves-light btn-large" href="#none" onClick={(event) => this.validateIncome(event)}>Next</a>
						</div>
					</form>
				</div>

				<div className="inputs-container categories animate__animated animate__faster" ref={this.categoriesContainer}>
					<h3 className="categories-header">Time to build the budget</h3>
					<h5 className="categories-description">
						Please select your initial budget categories, along with thier associated monthly allocations.
						These will be used as baselines and can be edited later</h5>
					<form>
						<ul className="collection">
							{
								this.renderCategories()
							}
							{/* <li className="collection-item categories-list">
								<h6>Alvin</h6>
								<input id="test" type="number" className="allocation" required min="0.01" max={Number.MAX_SAFE_INTEGER} step="0.01" placeholder="$ 0.00"></input>
								<a href="#none" className="secondary-content">
									<i className="material-icons delete-icon">delete</i>
								</a>
							</li> */}
						</ul>
						<div className="back-to-income-button">
							<a className="btn-floating btn-large waves-effect waves-light" href="#none" onClick={(event) => this.backToIncomeForm(event)}><i className="material-icons">arrow_back</i></a>
						</div>
						<div className="submit-categories-button">
							<a className="waves-effect waves-light btn-large" href="#none" onClick={(event) => this.validateCategories(event)}>Finish</a>
						</div>
					</form>
				</div>
			</div>
		);
	}
}