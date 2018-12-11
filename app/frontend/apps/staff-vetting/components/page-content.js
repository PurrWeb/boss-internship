import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import utils from '~/lib/utils';

class PageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredStaffMembers: this.filterByVenues(props.staffMembers),
      searchQuery: '',
      staffMembers: props.staffMembers,
    };
  }

  componentWillReceiveProps = nextProps => {
    const { selectedVenueIds, staffMembers } = nextProps;
    this.setState(state => {
      const filteredStaffMembers = this.filterByVenues(staffMembers, selectedVenueIds);
      return {
        filteredStaffMembers,
        staffMembers,
      };
    });
  };

  filterByVenues = (staffMembers, selectedVenueIds = this.props.selectedVenueIds) => {
    if (!this.props.selectedVenueIds) {
      return staffMembers;
    }
    if (selectedVenueIds.length === 0) {
      return staffMembers;
    }
    return staffMembers.filter(staffMember => selectedVenueIds.includes(staffMember.get('venueId')));
  };

  onSearchChange = searchQuery => {
    this.setState(state => {
      const filteredStaffMembers = utils.staffMemberFilterFullName(
        searchQuery,
        this.filterByVenues(this.state.staffMembers),
      );
      return {
        searchQuery,
        filteredStaffMembers,
      };
    });
  };

  renderFilter() {
    if (!this.props.staffMemberFilterRenderer) {
      return null;
    }
    return React.cloneElement(
      this.props.staffMemberFilterRenderer({
        onChange: this.onSearchChange,
        total: this.state.staffMembers.size,
        showing: this.state.filteredStaffMembers.size,
      }),
    );
  }

  renderStaffMemberList() {
    if (!this.props.staffMemberListRenderer) {
      return null;
    }
    return React.cloneElement(this.props.staffMemberListRenderer(this.state.filteredStaffMembers), {
      staffTypes: this.props.staffTypes,
    });
  }

  renderContent() {
    if (!this.props.contentRenderer) {
      return null;
    }
    return React.cloneElement(this.props.contentRenderer());
  }

  onChangeTab = staffMembers => {
    this.setState({
      staffMembers,
      filteredStaffMembers: utils.staffMemberFilterFullName(this.state.searchQuery, this.filterByVenues(staffMembers)),
    });
  };

  renderTabsFilter() {
    if (!this.props.tabsFilterRenderer) {
      return null;
    }
    return React.cloneElement(this.props.tabsFilterRenderer(), {
      venues: this.props.venues,
      staffMembers: this.props.staffMembers,
      onChangeTab: this.onChangeTab,
    });
  }

  render() {
    return (
      <div>
        {this.renderTabsFilter()}
        <div
          className={this.props.simpleLayout ? '' : `boss-page-main__group boss-page-main__group_adjust_staff-vetting`}
        >
          <div className="boss-users">
            {this.renderFilter()}
            {this.renderStaffMemberList()}
            {this.renderContent()}
          </div>
        </div>
      </div>
    );
  }
}

PageContent.propTypes = {
  total: PropTypes.number.isRequired,
  staffMembers: ImmutablePropTypes.list,
  staffTypes: ImmutablePropTypes.list,
  staffMemberFilterRenderer: PropTypes.func,
  staffMemberListRenderer: PropTypes.func,
  contentRenderer: PropTypes.func,
  simpleLayout: PropTypes.bool,
};

export default PageContent;
