import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import { withRouter } from 'react-router-dom';
import safeMoment from '~/lib/safe-moment';
import { SimpleDashboard, DashboardActions } from '~/components/boss-dashboards';
import ProfileEditForm from './profile-edit-form';
import NotFound from './not-found';
import Spinner from '~/components/spinner';

class ProfileEdit extends React.Component {
  state = {
    clientFetching: true,
  };

  componentDidMount = async () => {
    let client = oFetch(this.props, 'client');
    if (!client) {
      this.setState({ clientFetching: true });
      const clientData = await this.props.getWtlClient({ id: this.props.clientId });
      client = oFetch(clientData, 'client');
    } else {
      this.props.loadWtlClient({ client });
    }
    const fullName = oFetch(client, 'fullName');
    document.title = `${fullName} Edit Profile`;
    this.setState({ clientFetching: false });
  };

  handleEditSubmit = values => {
    return oFetch(this.props, 'updateClientProfileRequested')(values).then(() => {
      const clientId = oFetch(this.props, 'client.id');
      oFetch(this.props, 'history.replace')(`/profile/${clientId}`);
    });
  };

  render() {
    if (this.state.clientFetching) {
      return <Spinner />;
    }
    const client = oFetch(this.props, 'clientsProfile');
    const universities = oFetch(this.props, 'universities');
    if (!client) {
      return <NotFound />;
    }
    const [id, firstName, surname, gender, dateOfBirth, email, university, cardNumber, phoneNumber] = oFetch(
      client,
      'id',
      'firstName',
      'surname',
      'gender',
      'dateOfBirth',
      'email',
      'university',
      'cardNumber',
      'phoneNumber',
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
      phoneNumber,
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
            <ProfileEditForm
              universities={universities}
              initialValues={initialValues}
              onFormSubmit={this.handleEditSubmit}
            />
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
