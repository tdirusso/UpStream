import React from 'react';

export default class AddExpense extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <div className="modal modal-fixed-footer input-modal" id="add-expense-modal">
                    <div className="modal-content">
                        <h4>Modal Header</h4>
                        <p>A bunch of text</p>
                    </div>
                    <div className="modal-footer">
                        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</a>
                    </div>
                </div>
            </div>
        );
    }
}