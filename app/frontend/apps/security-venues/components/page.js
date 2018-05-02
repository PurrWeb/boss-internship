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
  handleOpenAddVenueModal = () => {
    openContentModal({
      submit: this.handleAddVenue,
      config: { title: 'Add Venue' },
      props: {},
    })(AddVenue);
  };

  handleAddVenue = (hideModal, values) => {
    const addVenue = oFetch(this.props, 'addVenue');

    return addVenue(values.toJS()).then(hideModal);
  };

  handleOpenEditVenueModal = venue => {
    const { id, name, address } = venue;
    const initialValues = { id, name, address };
    openContentModal({
      submit: this.handleEditVenue,
      config: { title: `Edit ${name}` },
      props: { initialValues },
    })(EditVenue);
  };

  handleEditVenue = (hideModal, values) => {
    const editVenue = oFetch(this.props, 'editVenue');

    return editVenue(values.toJS()).then(hideModal);
  };

  render() {
    const venues = oFetch(this.props, 'venues');
    const total = 10;
    return (
      <div>
        <SimpleDashboard title="Security Venues">
          <DashboardActions>
            <button
              onClick={this.handleOpenAddVenueModal}
              className="boss-button boss-button_role_add boss-page-dashboard__button"
            >
              Add Venue
            </button>
          </DashboardActions>
        </SimpleDashboard>
        <VenueList
          venues={venues}
          total={total}
          itemRenderer={venue => <VenueItem venue={venue} onEditClick={() => this.handleOpenEditVenueModal(venue)} />}
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
