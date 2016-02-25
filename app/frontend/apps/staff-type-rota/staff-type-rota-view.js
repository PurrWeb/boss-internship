import React from "react"
import AddShiftView from "./containers/add-shift-view"
import ChartAndFilter from "./containers/chart-and-filter"

export default class StaffTypeRotaView extends React.Component {
    render(){
        return <div>
            <ChartAndFilter />
            <AddShiftView />
        </div>
    }
}