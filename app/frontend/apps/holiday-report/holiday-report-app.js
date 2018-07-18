import React, { Component } from 'react'
import { Provider } from "react-redux"
import {createStore, compose } from "redux"
import utils from "~/lib/utils"
import HolidayReportView from './holiday-report-view'
import actionCreators from "~/redux/actions"
import oFetch from "o-fetch"
import { processHolidayAppViewData } from "~/lib/backend-data/process-backend-objects"

export default class HolidayReportApp extends Component {
    componentWillMount(){
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

        var data = this.getViewData();
        data = processHolidayAppViewData(data);

        var staffTypes = oFetch(data, "staffTypes");
        var staffMembers = oFetch(data, "staffMembers");
        var holidays = oFetch(data, "holidays");
        var venues = oFetch(data, "venues");
        var pageData = oFetch(data, "pageData");
        var holidaysCount = oFetch(data, "holidaysCount");
        var staffMembersCount = oFetch(data, "staffMembersCount");
        this.store = createStore(function(){
            return {
                staffTypes: utils.indexByClientId(staffTypes),
                staffMembers: utils.indexByClientId(staffMembers),
                holidays: utils.indexByClientId(holidays),
                venues: utils.indexByClientId(venues),
                pageOptions: pageData,
                holidaysCount,
                staffMembersCount
            }
        },
        composeEnhancers()
      );
    }
    getViewData(){
        if (this.props.viewData) {
            return this.props.viewData;
        }
        return oFetch(window, "boss.store");
    }
    render() {
        return <Provider store={this.store}>
            <HolidayReportView />
        </Provider>
    }
}
