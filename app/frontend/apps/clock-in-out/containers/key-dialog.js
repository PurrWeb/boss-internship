import React from "react"
import { connect } from "react-redux"

class KeyDialog extends React.Component {
    render(){
        return <button>btn</button>
    }
}

function mapStateToProps(){
    return {}
}

function mapDispatchToProps(dispatch){
    return {}
}

export default connect(mapDispatchToProps, mapStateToProps)(KeyDialog)
