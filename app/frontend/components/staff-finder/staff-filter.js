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
        filterSettings: React.PropTypes.object.isRequired,
        staffTypes: React.PropTypes.object,
        isNewDesign: React.PropTypes.bool,
        venues: React.PropTypes.object
    };

    static getDefaultSettings() {
        return {
            search: "",
            staffTypes: [],
            venues: [],
            rotaedOrActive: false
        }
    }
    render() {
        if (this.props.isNewDesign) {
            return (
                <div className="main-content__filters-block-container">
                    <div className="main-content__filters-block-label">
                        Filter
                    </div>

                    {this.getSearchField()}
                    {this.renderFiltersBlock()}
                </div>
            );
        } else {
            return (
                <div className="mb-lg">
                    {this.getSearchField()}
                    {this.renderFiltersBlock()}
                </div>
            );
        }
    }
    renderFiltersBlock() {
        var filters = this.getFilters();
        var titles = _(filters).pluck("title");
        var titleColumns = titles.map((title) => this.getFilterTitle(title));
        var componentColumns;

        if (this.props.isNewDesign) {
            componentColumns = filters.map(function(filter){
                const role = filter.title.toLowerCase();
                const subClass = role === 'status' ? 'filters-block__cell_role_status' : ''

                return <div className={`filters-block__cell ${subClass}`} key={filter.title}>
                    {filter.component}
                </div>
            });

            return (
                <div className="filters-block">
                    <div className="filters-block__head">
                        {titleColumns}
                    </div>
                    <div className="filters-block__row">
                        {componentColumns}
                    </div>
                </div>
            );
        } else {
            componentColumns = filters.map(function(filter){
                return <div className="small-3 medium-2 column" key={filter.title}>
                    {filter.component}
                </div>
            });

            return (
                <div className="mb-lg">
                    <div className="row">
                        {titleColumns}
                    </div>
                    <div className="row">
                        {componentColumns}
                    </div>
                </div>
            );
        }
    }
    getFilters(){
        var selectedFilters = this.props.filters;
        var filterItems = [];

        if (selectedFilters.staffType){
            filterItems.push(this.getStaffTypeFilter());
        }
        if (selectedFilters.venue){
            filterItems.push(this.getVenueFilter());
        }
        if (selectedFilters.rotaedOrActive){
            filterItems.push(this.getRotaedOrActiveFilter())
        }

        return filterItems;
    }
    getSearchField(){
        if (!this.props.filters) {
            return null;
        }

        if (this.props.isNewDesign) {
            return (
                <div className="boss-input-group__input-container main-content__filters-block-container_adjust_input-container">
                    <input
                        type="text"
                        value={this.props.filterSettings.search}
                        name="search"
                        placeholder="Search"
                        data-test-marker-staff-text-search
                        onChange={(event) =>
                            this.handleChange("search", event.target.value)
                        }
                        className="boss-input boss-input_type_search boss-input-group_adjust_search-input"/>
                </div>
            );
        } else {
            return (
                <div className="boss-input-group__input-container main-content__filters-block-container_adjust_input-container">
                    <input
                        type="text"
                        value={this.props.filterSettings.search}
                        name="search"
                        placeholder="Search"
                        data-test-marker-staff-text-search
                        style={{maxWidth: "100%"}}
                        onChange={(event) =>
                            this.handleChange("search", event.target.value)
                        }
                    />
                </div>
            );
        }
    }
    getStaffTypeFilter(){
        var component = <StaffTypeDropdown
            selectedStaffTypes={this.props.filterSettings.staffTypes}
            staffTypes={this.props.staffTypes}
            isNewDesign={this.props.isNewDesign}
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
    getRotaedOrActiveFilter(){
        var rotaedOrActiveOption = "Rotaed / Active Only"
        var allOption = "All"
        var component = (
            <select
                className="boss-input boss-input_type_select boss-input_variant_filters-block"
                value={this.props.filterSettings.rotaedOrActive ? rotaedOrActiveOption : allOption}
                onChange={(e) => this.handleChange("rotaedOrActive", e.target.value !== allOption)}
            >
                <option className="boss-input boss-input_variant_filters-block" value={allOption}>
                    {allOption}
                </option>
                <option className="boss-input boss-input_variant_filters-block" value={rotaedOrActiveOption}>
                    {rotaedOrActiveOption}
                </option>
            </select>
        );

        return {
            title: "Status",
            component
        }
    }
    getFilterTitle(titleString){
        const role = titleString.toLowerCase();
        const subClass = role === 'status' ? 'filters-block__head-cell_role_status' : '';

        return this.props.isNewDesign ? (
            <div className={`filters-block__head-cell filters-block__head-cell_type_label ${subClass}`} key={titleString}>
                {titleString}
            </div>
        ) : (
            <div className="small-3 medium-2 column" key={titleString}>
                {titleString}
            </div>
        );
    }
    handleChange(filterName, filterValue) {
        var newFilter = _.clone(this.props.filterSettings)
        newFilter[filterName] = filterValue;
        this.props.onChange(newFilter);
    }
}
