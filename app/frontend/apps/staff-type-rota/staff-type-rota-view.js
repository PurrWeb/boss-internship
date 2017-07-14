import React from "react"
import AddShiftView from "./containers/add-shift-view"
import ChartAndFilter from "./containers/chart-and-filter"
import RotaNavigation from "./containers/rota-navigation"
import { connect } from "react-redux"

class StaffTypeRotaView extends React.Component {
    render(){
        return <div>
            <RotaNavigation />
            <ChartAndFilter />
            <AddShiftView />
        </div>
    }
}

function mapStateToProps(state){
    return {
        pdfDownloadUrl: state.pageOptions.pdfDownloadUrl
    }
}

export default connect(mapStateToProps)(StaffTypeRotaView)
