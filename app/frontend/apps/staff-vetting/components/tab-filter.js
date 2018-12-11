import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { selectStaffMembersByStaffType, selectSecurityStaffMembers, selectStaffMembersByVenue } from '../utils';

class TabFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: props,
      tabs: [],
    };
  }

  componentDidMount = () => {
    this.props.getClearFunc && this.props.getClearFunc(this.clearFilter);
  };

  clearFilter = () => {
    this.setState({
      activeTabIndex: -1,
    });
  };

  getVenues() {
    if (!this.props.showVenues) {
      return [];
    }
    return this.props.venues.reduce((acc, venue) => {
      const staffMembers = selectStaffMembersByVenue(this.props.staffMembers, venue.get('id'));
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

  getTimeDodges() {
    if (!this.props.timeDodgers) {
      return [];
    }

    const { imStaffMembersHardDodgers, imStaffMembersSoftDodgers, imStaffMembers } = this.props.timeDodgers;
    const hardTabName = 'hard';
    const staffMembersHardDodgersTab = {
      title: `Hard Dodgers - under 45h (${imStaffMembersHardDodgers.size})`,
      name: 'hard',
      onClick: () => this.props.onChangeTab(imStaffMembersHardDodgers, hardTabName),
      onClear: () => this.props.onChangeTab(imStaffMembers),
    };
    const softTabName = 'soft';
    const staffMembersSoftDodgersTab = {
      title: `Soft Dodgers 45-47h (${imStaffMembersSoftDodgers.size})`,
      name: 'soft',
      onClick: () => this.props.onChangeTab(imStaffMembersSoftDodgers, softTabName),
      onClear: () => this.props.onChangeTab(imStaffMembers),
    };
    return [staffMembersSoftDodgersTab, staffMembersHardDodgersTab];
  }

  getRepeatOffenders() {
    if (!this.props.onOffendersClick) {
      return [];
    }

    const { repeatOffendersCount } = this.props;
    const repeatOffendersTab = {
      title: `Repeat Offenders (${repeatOffendersCount})`,
      onClick: () => this.props.onOffendersClick(),
      onClear: () => this.props.onOffendersClick(),
    };
    return [repeatOffendersTab];
  }

  handleChangeTab = (items, name) => {
    this.props.onTabClick(name);
    this.props.onChangeTab(items);
  };

  setTabs = selectedTab => {
    const tabs = [
      ...this.getVenues(),
      ...this.getPayRates(),
      ...this.getSecurity(),
      ...this.getTimeDodges(),
      ...this.getRepeatOffenders(),
    ];
    let activeTabIndex = this.state.activeTabIndex;
    if (selectedTab) {
      activeTabIndex = tabs.findIndex(tab => tab.name === selectedTab);
      if (activeTabIndex !== -1) {
        tabs[activeTabIndex].onClick();
      }
    }
    this.setState({ tabs, activeTabIndex });
  };

  componentDidMount = () => {
    this.setTabs(this.props.selectedTab);
  };

  componentWillReceiveProps = nextProps => {
    nextProps.getClearFunc && nextProps.getClearFunc(this.clearFilter);
    if (this.props.selectedTab !== nextProps.selectedTab) {
      this.setTabs(nextProps.selectedTab);
    }
  };

  render() {
    if (this.state.tabs.length === 0) {
      return null;
    }

    return (
      <div ref={node => (this.ref = node)} className="boss-page-main__controls">
        {this.state.tabs.map((tab, index) => (
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
                : tab.icon === 'security' ? 'boss-page-main__control_role_staff-type' : ''
            } ${index === this.state.activeTabIndex ? 'boss-page-main__control_state_active' : ''}`}
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
  timeDodgers: PropTypes.object,
  payRates: PropTypes.object,
  onChangeTab: PropTypes.func,
};

export default TabFilter;
