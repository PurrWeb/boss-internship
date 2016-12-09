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
        defaultFilterSettings: React.PropTypes.object
    };
    constructor(props) {
        super(props);
        const staffDefaultFilterSettings = StaffFilter.getDefaultSettings();
        let staffFilterSettings;

        if (props.defaultFilterSettings) {
            staffFilterSettings = _.extend({}, staffDefaultFilterSettings, props.defaultFilterSettings)
        }
        this.state = {
            staffFilterSettings
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.defaultFilterSettings.rotaedOrActive !== nextProps.defaultFilterSettings.rotaedOrActive) {
            const staffFilterSettings = this.state.staffFilterSettings;

            staffFilterSettings.rotaedOrActive = nextProps.defaultFilterSettings.rotaedOrActive;

            this.setState({
                staffFilterSettings
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
