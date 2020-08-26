import React from 'react';
import './Forms.css';

export default class BasicsForm extends React.Component {

    constructor() {
        super();
        this.fname = React.createRef();
        this.lname = React.createRef();
        this.basicsContainer = React.createRef();
    }

    componentDidMount() {
        this.basicsContainer.current.addEventListener('animationend', () => {
            this.basicsContainer.current.classList.remove('animate__fadeIn', 'animate__fadeOut');
        });
    }

    updateBasic(field, event) {
        this.props.setState({ [field]: event.target.value });
    }

    validateBasics(event) {
        event.preventDefault();

        const fnameValue = this.props.state.fname;
        const lnameValue = this.props.state.lname;

        if (fnameValue === '') {
            this.fname.current.focus();
            return;
        }

        if (lnameValue === '') {
            this.lname.current.focus();
            return;
        }

        this.props.next();
    }

    render() {
        return (
            <div className="inputs-container basics animate__animated animate__fadeIn animate__faster" ref={this.basicsContainer}>
                <h3 className="basics-header">Let's start with the basics</h3>
                <form>
                    <div className="input-field">
                        <input id="fname" type="text" className="validate" autoFocus={true} required maxLength="75" ref={this.fname} value={this.props.state.fname} onChange={(event) => this.updateBasic('fname', event)}></input>
                        <label htmlFor="fname">First Name</label>
                        <span className="helper-text" data-error="Please enter your first name" data-success=""></span>
                    </div>
                    <div className="input-field">
                        <input id="lname" type="text" className="validate" ref={this.lname} required maxLength="75" value={this.props.state.lname} onChange={(event) => this.updateBasic('lname', event)}></input>
                        <label htmlFor="lname">Last Name</label>
                        <span className="helper-text" data-error="Please enter your last name" data-success=""></span>
                    </div>
                    <div className="submit-basics-button">
                        <a className="waves-effect waves-light btn-large" href="#0" onClick={(event) => this.validateBasics(event)}>Next</a>
                    </div>
                </form>
            </div>
        );
    }
}