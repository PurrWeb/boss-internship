import React from "react"
import { connect } from "react-redux"
import ChartAndFilterUi from "../components/chart-and-filter"

class ChartAndFilter extends React.Component {
    render(){
        return <ChartAndFilterUi />       
    }
}

function mapStateToProps(state){
    return {
        
    }
}

export default connect(mapStateToProps)(ChartAndFilter)