import React, { Component } from 'react'
import { Provider } from "react-redux"
import {createStore, compose } from "redux"
import HolidayReportView from './holiday-report-view'
import reducers from './reducers';
import configureStore from '~/apps/store';
import oFetch from 'o-fetch';

import {
  initialLoad,
} from './actions'

export default class HolidayReportApp extends Component {
    componentWillMount(){
      this.store = {};
      this.store = configureStore(reducers);
      this.store.dispatch(initialLoad(this.getViewData()));
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
