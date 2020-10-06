import React from 'react';
import EditIncomeModal from './EditIncome';
import AddCategoryModal from './AddCategory';
import AddExpenseModal from './AddExpense';
import EditCategoryModal from './EditCategory';
import EditExpenseModal from './EditExpense';
import ImportModal from './Import';

export default class Modals extends React.Component {

    constructor(props) {
        super();
    }

    render() {
        return (
            <div>
                <EditIncomeModal income={this.props.curData.income} save={this.props.saveIncome} entryKey={this.props.curData.entryKey} />
                <AddCategoryModal />
                <AddExpenseModal />
                <EditCategoryModal categories={this.props.curData.categories} params={this.props.modalParams} save={this.props.updateCategory} />
                <EditExpenseModal />
                <ImportModal />
            </div>
        );
    }
}