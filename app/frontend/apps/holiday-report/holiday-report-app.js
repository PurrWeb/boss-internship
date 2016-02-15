import React, { Component } from 'react'
import { Provider } from "react-redux"
import {createStore } from "redux"
import utils from "~lib/utils"
import HolidayReportView from './holiday-report-view'
import * as actionCreators from "~redux/actions.js"

export default class HolidayReportApp extends Component {
    componentDidMount(){
        this.store = createStore(function(){
            var data = window.boss;
            return {
                staffTypes: utils.indexById(data.staffTypes),
                staffMembers: utils.indexById(data.staffMembers),
                holidays: utils.indexById(data.holidays)
            }
        });
    }
    render() {
        return <Provider store={this.store}>
            <HolidayReportView />
        </Provider>
    }
}