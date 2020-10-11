import React from 'react';
import EditIncomeModal from './EditIncome';
import AddCategoryModal from './AddCategory';
import AddExpenseModal from './AddExpense';
import EditCategoryModal from './EditCategory';
import EditExpenseModal from './EditExpense';
import ImportModal from './Import';

export default class Modals extends React.Component {
    render() {
        return (
            <div>
                <EditIncomeModal income={this.props.curData.income} save={this.props.saveIncome} entryKey={this.props.curData.entryKey} />
                <AddCategoryModal params={this.props.modalParams} save={this.props.saveExpense} />
                <AddExpenseModal params={this.props.modalParams} />
                <EditCategoryModal params={this.props.modalParams} categories={this.props.curData.categories} save={this.props.updateCategory} />
                <EditExpenseModal />
                <ImportModal />
            </div>
        );
    }
}