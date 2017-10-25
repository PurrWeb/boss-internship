import PropTypes from 'prop-types';
import React from "react"
import RotaChart from "~/components/rota-chart"
import _ from "underscore"
import ChartSelectionView from "~/components/chart-selection-view"
import StaffDetailsAndShifts from "~/components/staff-details-and-shifts"
import VenueDropdown from "~/components/venue-dropdown"
import getRotaFromDateAndVenue from "~/lib/get-rota-from-date-and-venue"
import getVenueColor from "~/lib/get-venue-color"
import getVenueFromShift from "~/lib/get-venue-from-shift"

export default class ChartAndFilterUi extends React.Component {
    static propTypes = {
        staffMembers: PropTypes.object.isRequired,
        rotaShifts: PropTypes.array.isRequired,
        staffTypes: PropTypes.object.isRequired,
        updateStaffToPreview: PropTypes.func.isRequired,
        updateStaffToShow: PropTypes.func.isRequired,
        onVenueFilterChange: PropTypes.func.isRequired,
        venues: PropTypes.object.isRequired,
        selectedVenueIds: PropTypes.array.isRequired,
        staffToPreview: PropTypes.string,
        staffToShow: PropTypes.string,
        rotas: PropTypes.object
    }
    render(){
        var staffDetails = this.getStaffDetailsComponent(this.props.staffToShow);
        var previewStaffDetails = this.getStaffDetailsComponent(this.props.staffToPreview);

        return <div className="row">
            <div className="column">
                <RotaChart
                    rotaShifts={this.getRotaShiftsToDisplay()}
                    staff={this.props.staffMembers}
                    updateStaffToPreview={this.props.updateStaffToPreview}
                    updateStaffToShow={this.props.updateStaffToShow}
                    staffToPreview={this.props.staffToPreview}
                    staffToShow={this.props.staffToShow}
                    staffTypes={this.props.staffTypes}
                    getShiftColor={(shift) => this.getShiftColor(shift)} />
            </div>
            <div className="shrink column">
                <VenueDropdown 
                    venues={this.props.venues}
                    multi={true}
                    selectedVenues={this.props.selectedVenueIds}
                    onChange={this.props.onVenueFilterChange} />
                <ChartSelectionView
                    selectionComponent={staffDetails}
                    previewComponent={previewStaffDetails} />
            </div>
        </div>
    }
    getVenueFromShift(shift){
        return getVenueFromShift({
            shift,
            venuesById: this.props.venues,
            rotasById: this.props.rotas
        })
    }
    getRotaShiftsToDisplay(){
        var self = this;
        return _(this.props.rotaShifts).filter(function(shift){
            if (self.props.selectedVenueIds.length > 0){
                var venueClientId = self.getVenueFromShift(shift).clientId;
                var venueIsSelected = _(self.props.selectedVenueIds).contains(venueClientId);
                if (!venueIsSelected) {
                    return false;
                }
            }

            return true;
        });
    }
    getShiftColor(shift){
        var venue = getVenueFromShift({
            shift,
            rotasById: this.props.rotas,
            venuesById: this.props.venues
        });
        var venueIds = _.pluck(_.values(this.props.venues), "clientId");
        var index = venueIds.indexOf(venue.clientId);
        return getVenueColor(index);
    }
    getStaffDetailsComponent(staffId){
        if (!staffId) {
            return null;
        }
        return <StaffDetailsAndShifts
            staffMemberClientId={staffId}
            staffTypes={this.props.staffTypes}
            rotaShifts={this.props.rotaShifts}
            venuesById={this.props.venues}
            rotasById={this.props.rotas}
            showShiftVenue={true}
            // We specify a key so the component is re-initialized when
            // the shift changes - so we don't keep the previous state.
            key={staffId}
            staff={this.props.staffMembers} />
    }
}
