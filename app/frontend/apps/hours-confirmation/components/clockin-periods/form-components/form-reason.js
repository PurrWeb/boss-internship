import React, { Component } from 'react';

class FormReason extends Component {
  static defaultProps = {
    className: '',
    naValue: 'N/A',
  };

  render() {
    const {
      label,
      naValue,
      input,
      className,
      meta: { touched, error, warning },
    } = this.props;
    return (
      <div className={className}>
        <p className="boss-time-shift__label">
          <span className="boss-time-shift__label-text">{label}</span>
        </p>
        <p className="boss-time-shift__message-value">{naValue}</p>
        <textarea {...input} className="boss-time-shift__textarea" />
      </div>
    );
  }
}

export default FormReason;
