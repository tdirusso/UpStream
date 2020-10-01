import React from 'react'
import './DatePicker.css';

export default class DatePicker extends React.Component {
    constructor() {
        super();
        this.monthPicker = React.createRef();

        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
    }

    componentDidMount() {
        const picker = this.monthPicker.current;
        const month = this.props.month;
        const year = this.props.year;
        const defaultDate = new Date(month + ' ' + year);

        window.M.Datepicker.init(picker, {
            defaultDate: defaultDate,
            setDefaultDate: true,
            format: 'mmmm yyyy',
            onClose: () => {
                const date = this.monthPicker.current.value
                this.props.changeDate(date);
            }
        });
    }

    prev() {
        const pickerInstance = window.M.Datepicker.getInstance(this.monthPicker.current);
        this.props.prev(pickerInstance);
    }

    next() {
        const pickerInstance = window.M.Datepicker.getInstance(this.monthPicker.current);
        this.props.next(pickerInstance);
    }

    render() {
        return (
            <div className="date-header">
                <i className="material-icons" onClick={this.prev}>arrow_back</i>
                <input type="text" className="datepicker" ref={this.monthPicker}></input>
                <i className="material-icons" onClick={this.next}>arrow_forward</i>
            </div>
        )
    }
}
