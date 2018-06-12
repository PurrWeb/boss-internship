import React from 'react';
import utils from '~/lib/utils';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import VenueSelect from '~/components/security-rota/venue-select';
import StaffMemberList from './staff-member-list';
import AddMultipleShift from './add-multiple-shift';
class AddShifts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      filteredAddShiftsVenues: [],
      filteredAddShiftsStaffs: [],
    };
  }

  getStaffMembers = () => {
    const filteredVenues = this.state.filteredAddShiftsVenues;
    const searchQuery = this.state.searchQuery;

    let filteredStaffMembers = [];

    if (filteredVenues.length === 0) {
      filteredStaffMembers = this.props.staffMembers;
    } else {
      filteredStaffMembers = this.props.staffMembers.filter(staffMember => {
        return filteredVenues.some(filteredVenueId =>
          staffMember.get('weekVenueIds').has(filteredVenueId),
        );
      });
    }
    return utils.staffMemberFilterCamelCase(searchQuery, filteredStaffMembers);
  };

  onSearchChange = event => {
    this.setState({ searchQuery: event.target.value });
  };

  onVenueChange = staffTypeIds => {
    this.setState({ filteredAddShiftsVenues: staffTypeIds });
  };

  render() {
    return (
      <div className={`boss-rotas__manager ${this.props.className}`}>
        <div className="boss-rotas__filter boss-rotas__filter_type_inner">
          <div className="boss-form">
            <div className="boss-form__row">
              <div className="boss-form__field boss-form__field_layout_max">
                <div className="boss-form__search boss-form__search_type_light">
                  <label className="boss-form__label">
                    <input
                      onChange={this.onSearchChange}
                      value={this.state.searchQuery}
                      type="text"
                      className="boss-form__input"
                      placeholder="Search ..."
                    />
                  </label>
                </div>
              </div>
              <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min">
                <p className="boss-form__label boss-form__label_type_light">
                  <span className="boss-form__label-text">Venue</span>
                </p>
                <VenueSelect
                  selectedTypes={this.state.filteredAddShiftsVenues}
                  venueTypes={this.props.venueTypes.toJS()}
                  onChange={this.onVenueChange}
                />
              </div>
              <div className="boss-form__field boss-form__field_layout_fluid">
                {this.props.isMultipleShift ? (
                  <button
                    onClick={this.props.onCloseMultipleShift}
                    className="boss-button boss-button_role_cancel boss-button_adjust_full-mobile"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={this.props.onOpenMultipleShift}
                    className="boss-button boss-button_role_add boss-button_adjust_full-mobile"
                  >
                    Add Multiple Shift
                  </button>
                )}
              </div>
            </div>
            {this.props.isMultipleShift && (
              <AddMultipleShift
                venues={this.props.venues}
                rotas={this.props.rotas}
                rotaDate={this.props.rotaDate}
              />
            )}
          </div>
        </div>
        <StaffMemberList
          staffMembers={this.getStaffMembers()}
          staffTypes={this.props.staffTypes}
          rotaDate={this.props.rotaDate}
          rotas={this.props.rotas}
          isMultipleShift={this.props.isMultipleShift}
          venues={this.props.venues}
        />
      </div>
    );
  }
}

AddShifts.PropTypes = {
  staffTypes: ImmutablePropTypes.list.isRequired,
  rotaDate: PropTypes.string.isRequired,
  staffMembers: ImmutablePropTypes.list.isRequired,
  isMultipleShift: PropTypes.bool.isRequired,
  venueTypes: PropTypes.array.isRequired,
  venues: ImmutablePropTypes.list.isRequired,
  rotas: ImmutablePropTypes.list.isRequired,
  className: PropTypes.string,
  onOpenMultipleShift: PropTypes.func.isRequired,
  onCloseMultipleShift: PropTypes.func.isRequired,
};

export default AddShifts;
