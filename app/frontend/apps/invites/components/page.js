import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import oFetch from 'o-fetch';
import InvitesFilter from './invites-filter';
import { SimpleDashboard, DashboardFilter, DashboardActions } from '~/components/boss-dashboards';
import InviteList from './invite-list';
import { PureJSInviteRow } from './invite-row';
import { PureJSInviteBlock } from './invite-block';
import InviteUser from './invite-user';
import bouncedEmailModal from '~/components/bounced-email-modal';
import LoadMore from '~/components/load-more/load-more-children';
import { openWarningModal, openContentModal } from '~/components/modals';
import { changeQueryString } from '../helpers';

class Page extends Component {
  handleFilter = values => {
    const { changeRoleFilter, changeStatusFilter } = this.props;
    const { status, role } = values;
    changeQueryString({ status, role });
    changeRoleFilter({ role });
    changeStatusFilter({ status });
  };

  handleInviteUserSubmit = (hideModal, values) => {
    return oFetch(this.props, 'inviteUserRequested')(values).then(hideModal);
  };

  handleOpenInviteUserModal = () => {
    const venues = oFetch(this.props, 'venues');

    openContentModal({
      submit: this.handleInviteUserSubmit,
      config: {
        title: 'Invite New User',
        modalRoleClassName: 'boss-modal-window_role_add-new',
        closeButtonOverflowed: true,
      },
      props: { venues },
    })(InviteUser);
  };

  handleBouncedEmailInfoClick = bouncedEmailData => {
    bouncedEmailModal(bouncedEmailData);
  };

  handleRevokeInviteSubmit = (hideModal, values) => {
    return oFetch(this.props, 'revokeInviteRequested')(values).then(hideModal);
  };

  handleOpenRevokeModal = inviteId => {
    openWarningModal({
      submit: this.handleRevokeInviteSubmit,
      config: {
        title: 'WARNING !!!',
        text: 'Are You Sure?',
        buttonText: 'Revoke',
      },
      props: { inviteId },
    });
  };

  rowRenderer = invite => (
    <PureJSInviteRow
      invite={invite}
      onRevoke={this.handleOpenRevokeModal}
      handleBouncedEmailInfoClick={this.handleBouncedEmailInfoClick}
    />
  );

  blockRenderer = invite => (
    <PureJSInviteBlock
      invite={invite}
      onRevoke={this.handleOpenRevokeModal}
      handleBouncedEmailInfoClick={this.handleBouncedEmailInfoClick}
    />
  );

  render() {
    const filters = oFetch(this.props, 'filters');
    const invites = oFetch(this.props, 'invites');

    return (
      <div>
        <SimpleDashboard title="Invites">
          <DashboardActions>
            <button
              onClick={this.handleOpenInviteUserModal}
              className="boss-button boss-button_role_add boss-page-dashboard__button"
            >
              Invite New User
            </button>
          </DashboardActions>
          <DashboardFilter onFilter={this.handleFilter} component={InvitesFilter} initialValues={filters} />
        </SimpleDashboard>
        <LoadMore items={invites}>
          {({ visibleItems, onLoadMore }) => (
            <div className="boss-page-main__content">
              <div className="boss-page-main__inner">
                <InviteList invites={visibleItems} rowRenderer={this.rowRenderer} blockRenderer={this.blockRenderer} />
                <div className="boss-page-main__count boss-page-main__count_space_large">
                  <span className="boss-page-main__count-text">Showing&nbsp;</span>
                  <span className="boss-page-main__count-text boss-page-main__count-text_marked">
                    {visibleItems.size}
                  </span>
                  <span className="boss-page-main__count-text">&nbsp;of&nbsp;</span>
                  <span className="boss-page-main__count-text boss-page-main__count-text_marked">{invites.size}</span>
                </div>
                {visibleItems.size !== invites.size && (
                  <div className="boss-page-main__actions boss-page-main__actions_position_last">
                    <button
                      onClick={onLoadMore}
                      className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </LoadMore>
      </div>
    );
  }
}

Page.propTypes = {
  filters: ImmutablePropTypes.map.isRequired,
  invites: ImmutablePropTypes.list.isRequired,
  changeRoleFilter: PropTypes.func.isRequired,
  changeStatusFilter: PropTypes.func.isRequired,
  inviteUserRequested: PropTypes.func.isRequired,
  revokeInviteRequested: PropTypes.func.isRequired,
};

export default Page;
