import React, { Component } from 'react';
import PropTypes from 'prop-types';

class StaffMemberFilter extends Component {
  state = {
    text: '',
  };

  onChange = event => {
    const text = event.target.value;
    this.setState({ text }, () => {
      this.props.onChange(text);
    });
  };

  render() {
    return (
      <div className="boss-users__filter">
        <form className="boss-form">
          <div className="boss-form__row boss-form__row_position_last boss-form__row_hidden-xs">
            <div className="boss-form__field boss-form__field_role_control">
              <p className="boss-form__label boss-form__label_type_light">
                <span className="boss-form__label-text">
                  Showing {this.props.showing} of {this.props.total}
                </span>
              </p>
              <div className="boss-form__search">
                <input
                  onChange={this.onChange}
                  value={this.state.text}
                  type="text"
                  className="boss-form__input"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
          <div className="boss-form__row boss-form__row_position_last boss-form__row_visible-xs">
            <div className="boss-form__field">
              <p className="boss-form__label boss-form__label_justify_center">
                <span className="boss-form__label-text">
                  Showing {this.props.showing} of {this.props.total}
                </span>
              </p>
              <div className="boss-form__search">
                <input
                  onChange={this.onChange}
                  value={this.state.text}
                  type="text"
                  className="boss-form__input"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

StaffMemberFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  showing: PropTypes.number.isRequired,
};

export default StaffMemberFilter;
