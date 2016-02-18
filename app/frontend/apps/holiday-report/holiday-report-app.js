import React, { Component } from 'react'
import { Provider } from "react-redux"
import {createStore } from "redux"
import utils from "~lib/utils"
import HolidayReportView from './holiday-report-view'
import * as actionCreators from "~redux/actions.js"

export default class HolidayReportApp extends Component {
    componentWillMount(){
        this.store = createStore(function(){
            var data = window.boss;
            return {
                staffTypes: utils.indexById(data.staffTypes),
                staff: utils.indexById(data.staffMembers),
                holidays: utils.indexById(data.holidays),
                venues: utils.indexById(data.venues),
                pageOptions: window.boss.pageOptions
            }
        });
    }
    render() {
        return <Provider store={this.store}>
            <HolidayReportView />
        </Provider>
    }
}