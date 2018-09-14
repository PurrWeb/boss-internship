import PropTypes from 'prop-types';
import React, { Component } from "react"
import StaffFilter from "~/components/staff-finder/staff-filter"
import FilterableStaffList from "~/components/staff-finder/filterable-staff-list"
import getStaffTypesWithStaffMembers from "~/lib/get-staff-types-with-staff-members"
import _ from "underscore"

export default class StaffFinder extends Component {
    static propTypes = {
        staffItemComponent: PropTypes.func.isRequired,
        staff: PropTypes.object.isRequired,
        staffTypes: PropTypes.object,
        filterOverrides: PropTypes.object,
        resetVenue: PropTypes.func,
        defaultFilterSettings: PropTypes.object,
        isNewDesign: PropTypes.bool,
        justEnteredManagerOrSupervisor: PropTypes.bool
    };
    static contextTypes = {
        newShiftSettings: PropTypes.shape({
            venueServerId: PropTypes.any.isRequired,
            venueClientId: PropTypes.any.isRequired,
            startsAt: PropTypes.instanceOf(Date).isRequired,
            endsAt: PropTypes.instanceOf(Date).isRequired,
            shiftType: PropTypes.string.isRequired
        })
    };
    constructor(props) {
        super(props);
        var staffFilterSettings = StaffFilter.getDefaultSettings();
        if (props.defaultFilterSettings) {
            staffFilterSettings = _.extend({}, staffFilterSettings, props.defaultFilterSettings)
        }
        this.state = {
            staffFilterSettings
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.justEnteredManagerOrSupervisor) {
            const filterSettings = Object.assign({}, this.state.staffFilterSettings, {
                search: '',
                staffTypes: []
            });

            this.setState({
                staffFilterSettings: filterSettings
            });
        }
    }
    render() {
        const resetVenueButton = this.props.resetVenue ? (
            <div className="boss-clock-buttons-block boss-main-content__body_adjust_boss-buttons-block">
                <div
                    className="boss-clock-button boss-clock-button_role_reset-venue"
                    onClick={this.props.resetVenue}
                >
                    Reset Venue
                </div>
            </div>
        ) : null;

        return (
            <div className="boss-main-content__body">
                <StaffFilter
                    staffTypes={this.getStaffTypesWithStaffMembers()}
                    venues={this.props.venues}
                    filters={this.props.filters}
                    onChange={(arg) => this.onFilterChange(arg)}
                    isNewDesign={this.props.isNewDesign}
                    filterSettings={this.getFilterSettings()} />

                <FilterableStaffList
                    staff={this.props.staff}
                    staffItemComponent={this.props.staffItemComponent}
                    isNewDesign={this.props.isNewDesign}
                    filterSettings={this.getFilterSettings()}
                    newShiftSettings={this.context.newShiftSettings}
                />
                {resetVenueButton}
            </div>
        );
    }
    getFilterSettings(){
        return this.processFilterOverrides(this.props, this.state.staffFilterSettings)
    }
    getStaffTypesWithStaffMembers(){
        return getStaffTypesWithStaffMembers(this.props.staffTypes, this.props.staff);
    }
    onFilterChange(filterSettings) {
        this.setState({
            staffFilterSettings: filterSettings
        });
    }
    processFilterOverrides(props, filterSettings){
        var filterOverrides = props.filterOverrides;
        if (!filterOverrides) {
            return filterSettings;
        }

        filterSettings = {...filterSettings};

        if (filterOverrides.staffTypeClientIds !== undefined) {
            filterSettings.staffTypes = filterOverrides.staffTypeClientIds;
        }

        if (filterOverrides.venueClientIds !== undefined) {
            filterSettings.venues = filterOverrides.venueClientIds
        }

        return filterSettings;
    }
}
