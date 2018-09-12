import React, { Component } from 'react';
import oFetch from 'o-fetch';
import ImmutablePropTypes from 'react-immutable-proptypes';

class InviteList extends Component {
  renderRows(invites) {
    const rowRenderer = oFetch(this.props, 'rowRenderer');

    return invites.map(invite => {
      return React.cloneElement(rowRenderer(invite), { key: invite.get('id') });
    });
  }

  renderBlocks(invites) {
    const blockRenderer = oFetch(this.props, 'blockRenderer');
    return invites.map(invite => React.cloneElement(blockRenderer(invite), { key: invite.get('id') }));
  }

  render() {
    const invites = oFetch(this.props, 'invites');
    if (invites.size === 0) {
      return (
        <div className="boss-page-main__group boss-page-main__group_adjust_ssr-requests">
          <div className="boss-page-main__text-placeholder">There are no invites to show.</div>
        </div>
      );
    }
    return (
      <div className="boss-page-main__group boss-page-main__group_adjust_invites-table">
        <div className="boss-table boss-table_page_invites-index">
          <div className="boss-table__row">
            <div className="boss-table__cell boss-table__cell_role_header">Email</div>
            <div className="boss-table__cell boss-table__cell_role_header">Role</div>
            <div className="boss-table__cell boss-table__cell_role_header">Venues</div>
            <div className="boss-table__cell boss-table__cell_role_header">Status</div>
            <div className="boss-table__cell boss-table__cell_role_header">Inviter</div>
            <div className="boss-table__cell boss-table__cell_role_header">Invited At</div>
            <div className="boss-table__cell boss-table__cell_role_header" />
          </div>
          {this.renderRows(invites)}
        </div>
        {this.renderBlocks(invites)}
      </div>
    );
  }
}

InviteList.propTypes = {
  invites: ImmutablePropTypes.list.isRequired,
};

export default InviteList;
