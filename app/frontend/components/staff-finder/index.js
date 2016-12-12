import React, { Component } from "react"
import StaffFilter from "~components/staff-finder/staff-filter"
import FilterableStaffList from "~components/staff-finder/filterable-staff-list"
import getStaffTypesWithStaffMembers from "~lib/get-staff-types-with-staff-members"
import _ from "underscore"

export default class StaffFinder extends Component {
    static propTypes = {
        staffItemComponent: React.PropTypes.func.isRequired,
        staff: React.PropTypes.object.isRequired,
        staffTypes: React.PropTypes.object,
        filterOverrides: React.PropTypes.object,
        resetVenue: React.PropTypes.func,
        defaultFilterSettings: React.PropTypes.object,
        justEnteredManagerOrSupervisor: React.PropTypes.bool
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
            <div className="boss-buttons-block main-content__body_adjust_boss-buttons-block">
                <div
                    className="boss-button boss-button_role_reset-venue"
                    onClick={this.props.resetVenue}
                >
                    Reset Venue
                </div>
            </div>
        ) : null;

        return (
            <div className="main-content__body">
                <StaffFilter
                    staffTypes={this.getStaffTypesWithStaffMembers()}
                    venues={this.props.venues}
                    filters={this.props.filters}
                    onChange={(arg) => this.onFilterChange(arg)}
                    filterSettings={this.getFilterSettings()} />

                <FilterableStaffList
                    staff={this.props.staff}
                    staffItemComponent={this.props.staffItemComponent}
                    filterSettings={this.getFilterSettings()} />
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
