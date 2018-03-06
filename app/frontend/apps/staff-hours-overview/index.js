import React from "react"
import AppComponent from "../app-component"
import { Provider } from "react-redux"
import actionCreators from "~/redux/actions"
import StaffDayList from "../hours-confirmation2/containers/staff-day-list"

export default class StaffHoursOverviewApp extends AppComponent {
  componentWillMount() {
    var viewData = this.getViewData();
    this.store.dispatch(
      actionCreators().loadInitialStaffHoursOverviewAppState(viewData)
    )
  }

  render() {
    return <div>
      <Provider store={this.store}>
        <StaffDayList displayVenues={true} displayDates={false}/>
      </Provider>
    </div>
  }
}
