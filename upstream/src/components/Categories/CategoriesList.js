import React from 'react';
import colors from '../../constants/constants';
import ExpensesTable from './ExpensesTable';

function AddExpenseButton() {
    return (
        <div className="add-expense-btn">
            <a className="btn-floating btn-small waves-effect waves-light" href="#0">
                <i className="material-icons">add</i>
            </a>
            <span>Add Expense</span>
        </div>
    );
}

export default function CategoriesList(props) {
    return props.categories.map(category => {
        const categoryExpenses = props.expenses.filter(expense => expense.category === category.name);
        categoryExpenses.sort((a, b) => (Date.parse(a.date) > Date.parse(b.date)) ? 1 : -1);

        const spent = categoryExpenses.reduce((previous, current) => (previous + parseFloat(current.amount)), 0).toFixed(2);

        const statusColor = parseFloat(spent) <= parseFloat(category.allocation) ? colors.underBudget : colors.overBudget;

        const modalParams = {
            category: category.name,
            allocation: category.allocation
        };

        return (
            <li key={category.name}>
                <div className="collapsible-header">
                    {category.name}
                    <div className="category-status" style={{ color: statusColor }}>
                        {spent.toDollarString()}
                        &nbsp;/&nbsp;
                        {category.allocation.toDollarString()}
                    </div>
                </div>
                <div className="collapsible-body">
                    <div className="edit-category-btn">
                        <a
                            className="btn-floating btn-small waves-effect waves-light"
                            onClick={(event) => props.modalOpener(event, 'edit-category-modal', modalParams)}
                        >
                            <i className="material-icons">edit</i>
                        </a>
                        <span>Edit Category</span>
                    </div>
                    <ExpensesTable expenses={categoryExpenses} />
                    <AddExpenseButton />
                </div>
            </li>
        )
    });
}