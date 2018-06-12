import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { SimpleDashboard, DashboardActions } from '~/components/boss-dashboards';
import VenueList from './venue-list';
import VenueItem from './venue-item';
import oFetch from 'o-fetch';
import { openContentModal } from '~/components/modals';
import AddVenue from './add-venue';
import EditVenue from './edit-venue';

class Page extends Component {
  handleOpenAddSecurityVenueModal = () => {
    openContentModal({
      submit: this.handleSecurityAddVenue,
      config: { title: 'Add Venue' },
      props: {},
    })(AddVenue);
  };

  handleSecurityAddVenue = (hideModal, values) => {
    const addSecurityVenue = oFetch(this.props, 'addSecurityVenue');

    return addSecurityVenue(values.toJS()).then(hideModal);
  };

  handleOpenEditSecurityVenueModal = securityVenue => {
    const securityVenueName = oFetch(securityVenue, 'name');
    openContentModal({
      submit: this.handleEditSecurityVenue,
      config: { title: `Edit ${securityVenueName}` },
      props: { securityVenue },
    })(EditVenue);
  };

  handleEditSecurityVenue = (hideModal, values) => {
    const editSecurityVenue = oFetch(this.props, 'editSecurityVenue');

    return editSecurityVenue(values.toJS()).then(hideModal);
  };

  render() {
    const securityVenues = oFetch(this.props, 'securityVenues');
    const total = 10;
    return (
      <div>
        <SimpleDashboard title="Security Venues">
          <DashboardActions>
            <button
              onClick={this.handleOpenAddSecurityVenueModal}
              className="boss-button boss-button_role_add boss-page-dashboard__button"
            >
              Add Venue
            </button>
          </DashboardActions>
        </SimpleDashboard>
        <VenueList
          venues={securityVenues}
          listObjectName="venues"
          perPage={3}
          itemRenderer={venue => <VenueItem venue={venue} onEditClick={() => this.handleOpenEditSecurityVenueModal(venue)} />}
        />
      </div>
    );
  }
}

Page.propTypes = {
  venues: ImmutablePropTypes.list.isRequired,
  addVenue: PropTypes.func.isRequired,
};

export default Page;
