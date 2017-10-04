import React from 'react';

class CalendarCustomInputLeft extends React.Component {

  render() {
    const {
      value,
      onClick,
    } = this.props;

    return (
      <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min boss-form__field_position_last" onClick={onClick}>
        <p className="boss-form__label boss-form__label_type_icon-date boss-form__label_type_icon-single"></p>
        <div className="react-datepicker__input-container react-datepicker__tether-target react-datepicker__tether-element-attached-bottom react-datepicker__tether-element-attached-left react-datepicker__tether-target-attached-top react-datepicker__tether-target-attached-left react-datepicker__tether-enabled">
          <div className="date-picker-input-field">{value}</div>
        </div>
      </div>
    )
  }
}

export default CalendarCustomInputLeft;
