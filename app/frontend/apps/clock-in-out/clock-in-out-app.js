import React, { Component } from "react"
import { Provider} from "react-redux"
import ClockInOutView from "./containers/clock-in-out-view"
import actionCreators from "~redux/actions"
import AppComponent from "../app-component"
import utils from "~lib/utils"

export default class RotaApp extends AppComponent {
    componentWillMount(){
        this.ensureOnCorrectDay();

        var store = this.store;
        store.subscribe(function(){
    		  localStorage.setItem("clockInOutApiKey", store.getState().apiKey)
    	  })

        var localStorageApiKey = localStorage.getItem("clockInOutApiKey")
        if (localStorageApiKey != null && localStorageApiKey != ""){
            store.dispatch(actionCreators.setApiKeyAndFetchClockInOutAppData(localStorageApiKey))
        }
    }
    ensureOnCorrectDay(){
      let time = new Date();
      let beginningOfRotaDay = utils.beginningOfRotaDay(time);
      let lastUpdateTime = new Date(
        Date.parse(localStorage.getItem("clockInOutLastUpdateTime"))
      );
      if(lastUpdateTime.toString() == "Invalid Date"){
        lastUpdateTime = beginningOfRotaDay;
        localStorage.setItem("clockInOutLastUpdateTime", beginningOfRotaDay);
      }

      let nextRequiredUpdate = utils.addDaysToDate(lastUpdateTime, 1);
      if(time > nextRequiredUpdate){
        localStorage.setItem("clockInOutLastUpdateTime", beginningOfRotaDay);
        location.reload();
      }
    }
    render() {
        return <Provider store={this.store}>
            <ClockInOutView />
        </Provider>
    }
}
