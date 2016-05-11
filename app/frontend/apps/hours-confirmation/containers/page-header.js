import React from "react"
import { connect } from "react-redux"

class PageHeader extends React.Component {
    render(){
        console.log("rendering page header with", this.props)
        return <div> todo: put venue picker here</div>
    }
}

function mapStateToProps(state){
    return {
        venues: state.venues
    }
}

export default connect(mapStateToProps)(PageHeader)
