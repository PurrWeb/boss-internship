import React, { Component } from 'react'
import { Provider } from "react-redux"
import {createStore } from "redux"
import utils from "~lib/utils"
import HolidayReportView from './holiday-report-view'
import * as actionCreators from "~redux/actions.js"
import oFetch from "o-fetch"
import { processHolidayAppViewState } from "~redux/process-backend-data"

export default class HolidayReportApp extends Component {
    componentWillMount(){
        var data = this.getViewData();
        data = processHolidayAppViewState(data);

        var staffTypes = oFetch(data, "staffTypes");
        var staffMembers = oFetch(data, "staffMembers");
        var holidays = oFetch(data, "holidays");
        var venues = oFetch(data, "venues");
        var pageData = oFetch(data, "pageData");

        this.store = createStore(function(){
            return {
                staffTypes: utils.indexByClientId(staffTypes),
                staff: utils.indexByClientId(staffMembers),
                holidays: utils.indexByClientId(holidays),
                venues: utils.indexByClientId(venues),
                pageOptions: pageData
            }
        });
    }
    getViewData(){
        if (this.props.viewData) {
            return this.props.viewData;
        }
        return window.boss;
    }
    render() {
        return <Provider store={this.store}>
            <HolidayReportView />
        </Provider>
    }
}