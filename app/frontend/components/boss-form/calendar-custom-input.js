import React from 'react';

class CalendarCustomInput extends React.Component {

  static defaultProps = {
    errorClass: '',
  }

  render() {
    const {
      value,
      onClick,
      errorClass,
    } = this.props;

    return (
      <div className={`date-picker-input date-picker-input_type_icon`} onClick={onClick}>
        <div className="react-datepicker__input-container react-datepicker__tether-target react-datepicker__tether-element-attached-bottom react-datepicker__tether-element-attached-left react-datepicker__tether-target-attached-top react-datepicker__tether-target-attached-left react-datepicker__tether-enabled">
          <div className={`date-picker-input-field ${errorClass}`}>{value}</div>
        </div>
      </div>
    )
  }
}

export default CalendarCustomInput;
