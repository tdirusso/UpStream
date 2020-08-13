import React from 'react';
import './NewUser.css';

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

		basicsContainer.addEventListener('animationend', () => {
			basicsContainer.style.display = 'none';
			incomeContainer.classList.add('animate__fadeIn', 'show-income');
			this.income.current.focus();
		});

		basicsContainer.classList.add('animate__fadeOut');
	}

	updateIncomeLabel() {
		const incomeValue = parseFloat(this.income.current.value);
		if (!isNaN(incomeValue)) {
			this.income.current.nextElementSibling.innerHTML = `$ ${incomeValue.toFixed(2)}`;
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

	}

	render() {
		return (
			<div>
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
						<div className="submit-basics">
							<a className="waves-effect waves-light btn-large" href="#s" onClick={(event) => this.validateBasics(event)}>Next</a>
						</div>
					</form>
				</div>

				<div className="inputs-container income animate__animated animate__faster" ref={this.incomeContainer}>
					<h3 className="income-header">What is your monthly income?</h3>
					<h5 className="income-description">This will be used as a baseline and can be easily modified later</h5>
					<form>
						<div className="input-field">
							<input id="income" type="number" className="validate" required min="0.01" max={Number.MAX_SAFE_INTEGER} step="0.01" ref={this.income} placeholder="0.00" onChange={() => this.updateIncomeLabel()}></input>
							<label htmlFor="income">$ 0.00</label>
							<span className="helper-text" data-error="Please enter a valid monthly income" data-success=""></span>
						</div>
						<div className="back-button">
							<a className="waves-effect waves-light btn-large" href="#s" onClick={() => {}}>Back</a>
						</div>
						<div className="submit-income">
							<a className="waves-effect waves-light btn-large" href="#s" onClick={(event) => this.validateIncome(event)}>Next</a>
						</div>
					</form>
				</div>
			</div>
		);
	}
}