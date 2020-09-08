import React from 'react';
import IncomeForm from './Forms/IncomeForm';
import CategoriesForm from './Forms/CategoriesForm';
const { ipcRenderer } = window.require('electron');

export default class CreatBudget extends React.Component {

	constructor() {
		super();

		this.incomeForm = React.createRef();
		this.categoriesForm = React.createRef();

		this.state = {
			income: '',
			incomeRemaining: '',
			incomeAllocated: '',
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
		this.showCategoriesForm = this.showCategoriesForm.bind(this);
		this.backToIncomeForm = this.backToIncomeForm.bind(this);
		this.submit = this.submit.bind(this);
	}

	componentDidMount() {
		this.incomeContainer = this.incomeForm.current.incomeContainer.current;
		this.categoriesContainer = this.categoriesForm.current.categoriesContainer.current;
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

	submit(event) {
		event.preventDefault();

		document.querySelectorAll('.allocation').forEach(allocation => { if (!allocation.value) allocation.value = '0.00' });

		const invalidInput = document.querySelector('.invalid');

		if (invalidInput) {
			invalidInput.focus();
			return;
		}

		const categoryRows = document.querySelectorAll('.categories-list.collection-item');
		const categories = Array.from(categoryRows).map(categoryRow => {
			const categoryNameElement = categoryRow.firstChild;
			const isCustomCategory = categoryNameElement.className.includes('custom');

			return {
				name: isCustomCategory ? categoryNameElement.value : categoryNameElement.innerText,
				allocation: categoryRow.children[1].value
			};
		});

		this.setState({ categories }, () => {
			ipcRenderer.send('budget:create', {
				income: this.state.income,
				incomeRemaining: this.state.incomeRemaining,
				incomeAllocated: this.state.incomeAllocated,
				overBudget: this.state.overBudget,
				categories: this.state.categories
			});
		});
	}

	render() {
		return (
			<div>
				<IncomeForm ref={this.incomeForm} state={this.state} setState={this.setState} next={this.showCategoriesForm} />
				<CategoriesForm ref={this.categoriesForm} state={this.state} setState={this.setState} back={this.backToIncomeForm} submit={this.submit} />
			</div>
		);
	}
}