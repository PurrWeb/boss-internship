import React from 'react';
import oFetch from 'o-fetch';
import PropTypes from 'prop-types';

class DashboardDropdownFilter extends React.PureComponent {
  state = {
    filter: '',
  };

  handleFilterChange = e => {
    this.setState({ filter: e.target.value });
  };

  handleFilterUpdate = () => {
    const onFilterUpdate = oFetch(this.props, 'onFilterUpdate');
    onFilterUpdate(this.state.filter);
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleFilterUpdate();
    }
  };

  render() {
    return (
      <div className="boss-dropdown__content boss-dropdown__content_state_opened" style={{ paddingBottom: '25px' }}>
        <div className="boss-dropdown__content-inner" style={{ paddingTop: '30px', marginTop: 0 }}>
          <div className="boss-form">
            <div className="boss-form__row boss-form__row_layout_wrap-xs">
              <div className="boss-form__field boss-form__field_layout_max">
                <label className="boss-form__label">
                  <span className="boss-form__label-text">Card number</span>
                  <input
                    name="card-nmber"
                    type="number"
                    className="boss-form__input"
                    value={this.state.filter}
                    onChange={this.handleFilterChange}
                    onKeyPress={this.handleKeyPress}
                  />
                </label>
              </div>
              <div className="boss-form__field boss-form__field_layout_min boss-form__field_justify_end boss-form__field_no-label">
                <button
                  onClick={this.handleFilterUpdate}
                  className="boss-button boss-form__submit boss-form__submit_adjust_single"
                  type="submit"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DashboardDropdownFilter.propTypes = {
  onFilterUpdate: PropTypes.func.isRequired,
};

export default DashboardDropdownFilter;
