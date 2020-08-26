import React from 'react';
import BasicsForm from './Forms/BasicsForm';
import IncomeForm from './Forms/IncomeForm';
import CategoriesForm from './Forms/CategoriesForm';

export default class NewUser extends React.Component {

	constructor() {
		super();

		this.basicsForm = React.createRef();
		this.incomeForm = React.createRef();
		this.categoriesForm = React.createRef();

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
		};

		this.setState = this.setState.bind(this);
		this.showIncomeForm = this.showIncomeForm.bind(this);
		this.showCategoriesForm = this.showCategoriesForm.bind(this);
		this.backToBasicsForm = this.backToBasicsForm.bind(this);
		this.backToIncomeForm = this.backToIncomeForm.bind(this);
	}

	componentDidMount() {
		this.incomeContainer = this.incomeForm.current.incomeContainer.current;
		this.categoriesContainer = this.categoriesForm.current.categoriesContainer.current;
		this.basicsContainer = this.basicsForm.current.basicsContainer.current;
		this.incomeField = this.incomeForm.current.income.current;
	}

	showCategoriesForm() {
		const fadeInCategoriesForm = () => {
			this.incomeContainer.classList.remove('show');
			this.incomeContainer.classList.add('hidden');
			this.categoriesContainer.classList.add('animate__fadeIn', 'show');
			this.incomeContainer.removeEventListener('animationend', fadeInCategoriesForm);
		};

		this.incomeContainer.addEventListener('animationend', fadeInCategoriesForm);
		this.incomeContainer.classList.add('animate__fadeOut');
	}

	backToBasicsForm(event) {
		event.preventDefault();

		const fadeInBasicsForm = () => {
			this.incomeContainer.classList.add('hidden');
			this.incomeContainer.classList.remove('show');
			this.basicsContainer.classList.remove('hidden');
			this.basicsContainer.classList.add('animate__fadeIn', 'show');
			this.incomeContainer.removeEventListener('animationend', fadeInBasicsForm);
		};

		this.incomeContainer.addEventListener('animationend', fadeInBasicsForm);
		this.incomeContainer.classList.add('animate__fadeOut');
	}

	backToIncomeForm(event) {
		event.preventDefault();

		const fadeInIncomeForm = () => {
			this.categoriesContainer.classList.add('hidden');
			this.categoriesContainer.classList.remove('show');
			this.incomeContainer.classList.remove('hidden');
			this.incomeContainer.classList.add('animate__fadeIn', 'show');
			this.incomeField.focus();
			this.categoriesContainer.removeEventListener('animationend', fadeInIncomeForm);
		};

		this.categoriesContainer.addEventListener('animationend', fadeInIncomeForm);
		this.categoriesContainer.classList.add('animate__fadeOut');
	}

	showIncomeForm() {
		const fadeInIncomeForm = () => {
			this.basicsContainer.classList.remove('show');
			this.basicsContainer.classList.add('hidden');
			this.incomeContainer.classList.add('animate__fadeIn', 'show');
			this.incomeField.focus();
			this.basicsContainer.removeEventListener('animationend', fadeInIncomeForm);
		};

		this.basicsContainer.addEventListener('animationend', fadeInIncomeForm);
		this.basicsContainer.classList.add('animate__fadeOut');
	}

	submit(event) {
		event.preventDefault();
	}

	render() {
		return (
			<div>
				<BasicsForm ref={this.basicsForm} state={this.state} setState={this.setState} next={this.showIncomeForm} />
				<IncomeForm ref={this.incomeForm} state={this.state} setState={this.setState} next={this.showCategoriesForm} back={this.backToBasicsForm}/>
				<CategoriesForm ref={this.categoriesForm} state={this.state} setState={this.setState} back={this.backToIncomeForm} submit={this.submit}/>
			</div>
		);
	}
}