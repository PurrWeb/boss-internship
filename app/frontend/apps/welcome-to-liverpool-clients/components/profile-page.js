import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import { withRouter } from 'react-router-dom';
import { SimpleDashboard, DashboardActions } from '~/components/boss-dashboards';
import ProfileCard from './profile-card';
import NotFound from './not-found';

class ProfilePage extends React.Component {
  render() {
    const [client, enadleClientRequested, disableClientRequested] = oFetch(
      this.props,
      'client',
      'enadleClientRequested',
      'disableClientRequested',
    );
    if (!client) {
      return <NotFound />;
    }
    const disabled = oFetch(client, 'disabled');
    return (
      <main className="boss-page-main">
        <SimpleDashboard
          title={
            <span>
              Welcome to Liverpool Client Profile&nbsp;{disabled && (
                <span className="boss-page-dashboard__title-text boss-page-dashboard__title-text_faded">
                  ( Disabled )
                </span>
              )}
            </span>
          }
        >
          <DashboardActions>
            <button
              onClick={() => this.props.history.goBack()}
              className="boss-button boss-button_role_primary boss-page-dashboard__button"
            >
              Return to Index
            </button>
          </DashboardActions>
        </SimpleDashboard>
        <div className="boss-page-main__content">
          <div className="boss-page-main__inner">
            <ProfileCard
              client={client}
              enadleClientRequested={enadleClientRequested}
              disableClientRequested={disableClientRequested}
            />
          </div>
        </div>
      </main>
    );
  }
}

ProfilePage.propTypes = {
  client: PropTypes.object,
  enadleClientRequested: PropTypes.func.isRequired,
  disableClientRequested: PropTypes.func.isRequired,
};

export default withRouter(ProfilePage);
