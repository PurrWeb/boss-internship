import React from "react"
import AddShiftView from "./containers/add-shift-view"
import ChartAndFilter from "./containers/chart-and-filter"
import RotaNavigation from "./containers/rota-navigation"
import { connect } from "react-redux"

export default class StaffTypeRotaView extends React.Component {
    render(){
        return <div>
            <RotaNavigation />
            <a href={this.props.pdfDownloadUrl} className="btn btn-success">
                  <span className="glyphicon glyphicon-download"></span> Download PDF
                </a>
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
