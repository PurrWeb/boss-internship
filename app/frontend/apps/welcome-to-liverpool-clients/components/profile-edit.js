import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import { withRouter } from 'react-router-dom';
import safeMoment from '~/lib/safe-moment';
import { SimpleDashboard, DashboardActions } from '~/components/boss-dashboards';
import ProfileEditForm from './profile-edit-form';
import NotFound from './not-found';

class ProfileEdit extends React.Component {
  handleEditSubmit = values => {
    return oFetch(this.props, 'updateClientProfileRequested')(values).then(() => {
      const clientId = oFetch(this.props, 'client.id');
      oFetch(this.props, 'history.replace')(`/profile/${clientId}`);
    });
  };

  render() {
    const client = oFetch(this.props, 'client');
    if (!client) {
      return <NotFound />;
    }
    const [id, firstName, surname, gender, dateOfBirth, email, university, cardNumber] = oFetch(
      client,
      'id',
      'firstName',
      'surname',
      'gender',
      'dateOfBirth',
      'email',
      'university',
      'cardNumber',
    );
    const initialValues = {
      id,
      firstName,
      surname,
      gender,
      dateOfBirth: safeMoment.uiDateParse(dateOfBirth),
      email,
      university,
      cardNumber,
    };
    return (
      <main className="boss-page-main">
        <SimpleDashboard title="Edit Welcome to Liverpool Client Profile">
          <DashboardActions>
            <button
              onClick={() => this.props.history.goBack()}
              className="boss-button boss-button_role_cancel boss-page-dashboard__button"
            >
              Cancel Editing
            </button>
          </DashboardActions>
        </SimpleDashboard>
        <div className="boss-page-main__content">
          <div className="boss-page-main__inner">
            <ProfileEditForm initialValues={initialValues} onFormSubmit={this.handleEditSubmit} />
          </div>
        </div>
      </main>
    );
  }
}

ProfileEdit.propTypes = {
  client: PropTypes.object,
  updateClientProfileRequested: PropTypes.func.isRequired,
};

export default withRouter(ProfileEdit);
