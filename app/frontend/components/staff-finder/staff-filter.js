import React, { Component } from "react"
import StaffTypeDropdown from "../staff-type-dropdown"
import VenueDropdown from "~components/venue-dropdown"
import _ from "underscore"

export default class StaffFilter extends Component {
    static propTypes = {
        onChange: React.PropTypes.func.isRequired,
        filters: React.PropTypes.shape({
            search: React.PropTypes.bool,
            staffType: React.PropTypes.bool,
            venue: React.PropTypes.bool
        }).isRequired,
        filterSettings: React.PropTypes.isRequired,
        staffTypes: React.PropTypes.object,
        venues: React.PropTypes.object
    }
    static getDefaultSettings() {
        return {
            search: "",
            staffTypes: [],
            venues: []
        }
    }
    render() {
        var filters = this.getFilters();
        var titles = _(filters).pluck("title");
        var components = _(filters).pluck("component");

        var titleColumns = titles.map((title) => this.getFilterTitle(title));
        var componentColumns = components.map(function(component){
            return <div className="col-md-2">
                {component}
            </div>
        });

        return (
            <div>
                <div className="row">
                    {titleColumns}
                </div>
                <div className="row">
                    {componentColumns}
                </div>
            </div>
        )
    }
    getFilters(){
        var selectedFilters = this.props.filters;
        var filterItems = [];
        
        if (selectedFilters.search){
            filterItems.push(this.getSearchFilter());
        }
        if (selectedFilters.staffType){
            filterItems.push(this.getStaffTypeFilter());
        }
        if (selectedFilters.venue){
            filterItems.push(this.getVenueFilter());
        }

        return filterItems;
    }
    getSearchFilter(){
        var component = <input
            value={this.props.filterSettings.search}
            onChange={(event) =>
                this.handleChange("search", event.target.value)
            }/>
        return {
            title: "Search",
            component
        }
    }
    getStaffTypeFilter(){
        var component = <StaffTypeDropdown
            selectedStaffTypes={this.props.filterSettings.staffTypes}
            staffTypes={this.props.staffTypes}
            onChange={(staffTypes) => 
                this.handleChange("staffTypes", staffTypes)
            } />
        return {
            title: "Staff Type",
            component
        }
    }
    getVenueFilter(){
        var component = <VenueDropdown
            selectedVenues={this.props.filterSettings.venues}
            venues={this.props.venues}
            multi={true}
            onChange={(venues) => 
                this.handleChange("venues", venues)
            } />
        return {
            title: "Venue",
            component
        }
    }
    getFilterTitle(titleString){
        return <div className="col-md-2">
            {titleString}
        </div>
    }
    handleChange(filterName, filterValue) {
        var newFilter = _.clone(this.props.filterSettings)
        newFilter[filterName] = filterValue;
        this.props.onChange(newFilter);
    }
}
