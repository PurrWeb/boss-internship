import React from 'react';
import oFetch from 'o-fetch';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';

class Dashboard extends React.PureComponent {
  state = { isOpen: false };

  toggleDropdown = () => this.setState({ isOpen: !this.state.isOpen });

  renderDropdownFilter() {
    const dropdownFilter = oFetch(this.props, 'dropdownFilter');
    return React.cloneElement(dropdownFilter);
  }

  renderActiveFilter() {
    const activeFilter = oFetch(this.props, 'activeFilter');
    return React.cloneElement(activeFilter);
  }

  render() {
    const total = oFetch(this.props, 'total');
    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <h1 className="boss-page-dashboard__title">
                Welcome to Liverpool Cards <span className="boss-page-dashboard__title-info">{total}</span>
              </h1>
            </div>
            <div className="boss-page-dashboard__filter" style={{ marginBottom: '0px' }}>
              <div className="boss-dropdown boss-dropdown_page_maintenance-index">
                <div className="boss-dropdown__header" style={{ marginBottom: '15px' }}>
                  <button
                    onClick={this.toggleDropdown}
                    className={`boss-dropdown__switch boss-dropdown__switch_role_filter ${
                      this.state.isOpen ? 'boss-dropdown__switch_state_opened' : ''
                    }`}
                  >
                    Filtering
                  </button>
                  {this.renderActiveFilter()}
                </div>

                <Collapse isOpened={this.state.isOpen} style={{ display: 'block' }}>
                  {this.renderDropdownFilter()}
                </Collapse>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  dropdownFilter: PropTypes.element.isRequired,
  activeFilter: PropTypes.element.isRequired,
  total: PropTypes.number.isRequired,
};

export default Dashboard;
