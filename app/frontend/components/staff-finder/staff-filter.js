import PropTypes from 'prop-types';
import React, { Component } from "react"
import StaffTypeDropdown from "../staff-type-dropdown"
import StatusDropdown from "~/components/status-dropdown"
import _ from "underscore"

export default class StaffFilter extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        filters: PropTypes.shape({
            search: PropTypes.bool,
            staffType: PropTypes.bool,
            venue: PropTypes.bool
        }).isRequired,
        filterSettings: PropTypes.object.isRequired,
        staffTypes: PropTypes.object,
        isNewDesign: PropTypes.bool,
        venues: PropTypes.object
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
                <div className="boss-main-content__filters-block-container">
                    <div className="boss-main-content__filters-block-label">
                        Filter
                    </div>

                    {this.getSearchField()}
                    {this.renderFiltersBlock()}
                </div>
            );
        } else {
            return (
                <div className="mb-lg">
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
                const subClass = role === 'status' ? 'boss-filters-block__cell_role_status' : ''
                return <div style={{ display: 'table-cell' }} className={`${subClass} ${filters.length === 2 && 'boss-form__field_layout_half'}`} key={filter.title}>
                    {filter.component}
                </div>
            });

            return (
                <div className="boss-filters-block">
                    <div className="boss-filters-block__head">
                        {titleColumns}
                    </div>
                    <div className="boss-filters-block__row">
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

        if (!this.props.isNewDesign) {
            if (selectedFilters.search){
                filterItems.push(this.getSearchFilter());
            }
        }

        if (selectedFilters.staffType){
            filterItems.push(this.getStaffTypeFilter());
        }
        if (selectedFilters.rotaedOrActive){
            filterItems.push(this.getRotaedOrActiveFilter())
        }

        return filterItems;
    }
    getSearchFilter(){
        var component = (
            <input
                type="text"
                value={this.props.filterSettings.search}
                name="search"
                placeholder="Search"
                data-test-marker-staff-text-search
                className="boss-input boss-input_role_search boss-input-group_adjust_search-input"
                onChange={(event) =>
                    this.handleChange("search", event.target.value)
                }
            />
        );
        return {
            title: "Search",
            component
        }
    }
    getSearchField(){
        if (!this.props.filters) {
            return null;
        }

        return (
            <div className="boss-input-group__input-container boss-main-content__filters-block-container_adjust_input-container">
                <input
                    type="text"
                    value={this.props.filterSettings.search}
                    name="search"
                    placeholder="Search"
                    data-test-marker-staff-text-search
                    onChange={(event) =>
                        this.handleChange("search", event.target.value)
                    }
                    className="boss-input boss-input_role_search boss-input-group_adjust_search-input" />
            </div>
        );
    }
    getStaffTypeFilter(){
        var component = <StaffTypeDropdown
            selectedStaffTypes={this.props.filterSettings.staffTypes}
            staffTypes={this.props.staffTypes}
            isNewDesign={this.props.isNewDesign}
            onChange={(staffTypes) => this.handleChange("staffTypes", staffTypes)}
        />
        return {
            title: "Staff Type",
            component
        }
    }
    getRotaedOrActiveFilter(){
        const rotaedOrActiveOption = "Rotaed / Active Only";
        const allOption = "All"
        var component = (<StatusDropdown
                            value={this.props.filterSettings.rotaedOrActive ? rotaedOrActiveOption : allOption}
                            onChange={(status) => this.handleChange("rotaedOrActive", status === rotaedOrActiveOption)}
                        />);

        return {
            title: "Status",
            component
        }
    }
    getFilterTitle(titleString){
        const role = titleString.toLowerCase();
        const subClass = role === 'status' ? 'boss-filters-block__head-cell_role_status' : '';

        return this.props.isNewDesign ? (
            <div className={`boss-filters-block__head-cell boss-filters-block__head-cell_type_label ${subClass}`} key={titleString}>
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
