import React from 'react';

export default function ExpensesTable(props) {
    return (
        <table className="highlight expense-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.expenses.map((expense, index) => {
                        const key = `${expense.category}-expense-${index}`;
                        return (
                            <tr key={key}>
                                <td>{expense.date}</td>
                                <td>{expense.name}</td>
                                <td>{expense.amount.toDollarString()}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}
