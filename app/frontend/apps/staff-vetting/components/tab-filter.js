import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  selectStaffMembersByStaffType,
  selectSecurityStaffMembers,
  selectStaffMembersByVenue,
} from '../utils';

class TabFilter extends Component {
  state = {
    activeTabIndex: -1,
  };

  getVenues() {
    if (!this.props.showVenues) {
      return [];
    }
    return this.props.venues.reduce((acc, venue) => {
      const staffMembers = selectStaffMembersByVenue(
        this.props.staffMembers,
        venue.get('id'),
      );
      const staffCount = staffMembers.size;
      if (staffCount === 0) {
        return acc;
      }
      const title = `${venue.get('name')} (${staffCount})`;

      return [
        ...acc,
        {
          title,
          onClick: () => this.props.onChangeTab(staffMembers),
          onClear: () => this.props.onChangeTab(this.props.staffMembers),
          icon: 'venue',
        },
      ];
    }, []);
  }

  getSecurity() {
    if (!this.props.showSecurity) {
      return [];
    }
    const securityStaff = selectSecurityStaffMembers(this.props.staffMembers);
    const securityStaffCount = securityStaff.size;

    if (securityStaffCount === 0) {
      return [];
    }

    return [
      {
        title: `Security (${securityStaffCount})`,
        onClick: () => this.props.onChangeTab(securityStaff),
        onClear: () => this.props.onChangeTab(this.props.staffMembers),
        icon: 'security',
      },
    ];
  }

  getPayRates() {
    if (!this.props.showPayRates) {
      return [];
    }

    const {
      staffMembersWronglyOn18To20Payrate,
      staffMembersWronglyOn21To24Payrate,
      staffMembersWronglyOn25PlusPayrate,
    } = this.props.payRates;

    const allStaffMembers = staffMembersWronglyOn18To20Payrate
      .concat(staffMembersWronglyOn21To24Payrate)
      .concat(staffMembersWronglyOn25PlusPayrate);

    const staffMembersWronglyOn18To20PayrateTab = {
      title: `Age 18-20 (${staffMembersWronglyOn18To20Payrate.size})`,
      onClick: () => this.props.onChangeTab(staffMembersWronglyOn18To20Payrate),
      onClear: () => this.props.onChangeTab(allStaffMembers),
    };
    const staffMembersWronglyOn21To24PayrateTab = {
      title: `Age 21-24 (${staffMembersWronglyOn21To24Payrate.size})`,
      onClick: () => this.props.onChangeTab(staffMembersWronglyOn21To24Payrate),
      onClear: () => this.props.onChangeTab(allStaffMembers),
    };
    const staffMembersWronglyOn25PlusPayrateTab = {
      title: `Age 21-24 (${staffMembersWronglyOn25PlusPayrate.size})`,
      onClick: () => this.props.onChangeTab(staffMembersWronglyOn25PlusPayrate),
      onClear: () => this.props.onChangeTab(allStaffMembers),
    };

    return [
      staffMembersWronglyOn18To20PayrateTab,
      staffMembersWronglyOn21To24PayrateTab,
      staffMembersWronglyOn25PlusPayrateTab,
    ];
  }

  render() {
    const tabs = [
      ...this.getVenues(),
      ...this.getPayRates(),
      ...this.getSecurity(),
    ];
    return (
      <div className="boss-page-main__controls">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => {
              if (this.state.activeTabIndex === index) {
                this.setState({ activeTabIndex: -1 }, () => {
                  tab.onClear();
                });
              } else {
                this.setState({ activeTabIndex: index }, () => {
                  tab.onClick();
                });
              }
            }}
            className={`boss-page-main__control ${
              tab.icon === 'venue'
                ? 'boss-page-main__control_role_venue'
                : tab.icon === 'security'
                  ? 'boss-page-main__control_role_staff-type'
                  : ''
            } ${
              index === this.state.activeTabIndex
                ? 'boss-page-main__control_state_active'
                : ''
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
    );
  }
}

TabFilter.propTypes = {
  showPayRates: PropTypes.bool,
  showVenues: PropTypes.bool,
  showSecurity: PropTypes.bool,
  payRates: PropTypes.object,
  onChangeTab: PropTypes.func,
};

export default TabFilter;