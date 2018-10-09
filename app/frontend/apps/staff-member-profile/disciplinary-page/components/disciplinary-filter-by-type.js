import React from 'react';
import oFetch from 'o-fetch';
import PropTypes from 'prop-types';
import * as constants from '../constants';

class DisciplinaryFilterByType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expired: props.show.includes(constants.EXPIRED),
      disabled: props.show.includes(constants.DISABLED),
    };
  }

  handleExpiredChange = () => {
    this.setState({ expired: !this.state.expired });
  };

  handleDisabledChange = () => {
    this.setState({ disabled: !this.state.disabled });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.expired !== this.state.expired || prevState.disabled !== this.state.disabled) {
      const show = [this.state.expired && constants.EXPIRED, this.state.disabled && constants.DISABLED].filter(
        value => value,
      );
      this.props.onFilterChange({ show });
    }
  };

  render() {
    const { expired, disabled } = this.state;

    return (
      <div className="boss-form__group boss-form__group_layout_min">
        <div className="boss-form__row boss-form__row_layout_wrap-xs">
          <div className="boss-form__field boss-form__field_layout_actual boss-form__field_no-label">
            <label className="boss-form__checkbox-label">
              <input
                name="show-expired"
                checked={expired}
                onChange={this.handleExpiredChange}
                type="checkbox"
                className="boss-form__checkbox-input"
              />
              <span className="boss-form__checkbox-label-text boss-form__checkbox-label-text_layout_reverse">
                Show Expired
              </span>
            </label>
          </div>
          <div className="boss-form__field boss-form__field_layout_actual boss-form__field_no-label">
            <label className="boss-form__checkbox-label">
              <input
                name="show-disabled"
                type="checkbox"
                className="boss-form__checkbox-input"
                checked={disabled}
                onChange={this.handleDisabledChange}
              />
              <span className="boss-form__checkbox-label-text boss-form__checkbox-label-text_layout_reverse">
                Show Disabled
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  }
}

DisciplinaryFilterByType.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  show: PropTypes.array.isRequired,
};

export default DisciplinaryFilterByType;
