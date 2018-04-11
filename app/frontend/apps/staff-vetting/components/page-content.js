import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import utils from '~/lib/utils';

class PageContent extends Component {
  state = {
    filteredStaffMembers: this.props.staffMembers,
    searchQuery: '',
  };

  onSearchChange = searchQuery => {
    this.setState(state => {
      const filteredStaffMembers = utils.staffMemberFilterFullName(
        searchQuery,
        this.props.staffMembers,
      );
      return {
        searchQuery,
        filteredStaffMembers,
      };
    });
  };

  renderFilter() {
    return React.cloneElement(
      this.props.staffMemberFilterRenderer({
        onChange: this.onSearchChange,
        total: this.props.total,
        showing: this.state.filteredStaffMembers.size,
      }),
    );
  }

  renderStaffMemberList() {
    return React.cloneElement(
      this.props.staffMemberListRenderer(this.state.filteredStaffMembers),
      { staffTypes: this.props.staffTypes },
    );
  }

  onChangeTab = staffMembers => {
    this.setState({
      filteredStaffMembers: utils.staffMemberFilterFullName(
        this.state.searchQuery,
        staffMembers,
      ),
    });
  };

  renderTabsFilter() {
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
        <div className="boss-page-main__group boss-page-main__group_adjust_staff-vetting">
          <div className="boss-users">
            {this.renderFilter()}
            {this.renderStaffMemberList()}
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
  staffMemberFilterRenderer: PropTypes.func.isRequired,
  staffMemberListRenderer: PropTypes.func.isRequired,
};

export default PageContent;
