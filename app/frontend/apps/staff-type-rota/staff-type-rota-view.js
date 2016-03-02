import React from "react"
import AddShiftView from "./containers/add-shift-view"
import ChartAndFilter from "./containers/chart-and-filter"
import RotaNavigation from "./containers/rota-navigation"

export default class StaffTypeRotaView extends React.Component {
    render(){
        return <div>
            <RotaNavigation />
            <ChartAndFilter />
            <AddShiftView />
        </div>
    }
}