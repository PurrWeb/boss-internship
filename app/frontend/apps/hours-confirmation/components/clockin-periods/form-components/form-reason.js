import React, { Component } from 'react';
import debounce from 'lodash/debounce';

class FormReason extends Component {
  static defaultProps = {
    className: '',
    naValue: 'N/A',
    globalError: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.input.value,
    };
    this.changed = debounce(props.input.onChange, 1500)
  }

  onChange = (value) => {
    this.setState({ value }, () => {
      this.changed(value);
    })
  }

  render() {
    const {
      label,
      naValue,
      input,
      className,
      meta: { touched, error, warning },
      globalError,
    } = this.props;

    return (
      <div className={className}>
        <p className="boss-time-shift__label">
          <span className="boss-time-shift__label-text">{label}</span>
        </p>
        <p className="boss-time-shift__message-value">{naValue}</p>
        <textarea
          value={this.state.value}
          onChange={e => this.onChange(e.target.value)}
          className="boss-time-shift__textarea"
        />
      </div>
    );
  }
}

export default FormReason;
