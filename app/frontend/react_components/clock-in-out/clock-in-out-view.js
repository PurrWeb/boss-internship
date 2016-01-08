import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import _ from "underscore"
import store from "../../redux/store"

class ClockInOutView extends Component {
    render() {
        console.log(this.props)
        return <div className="container">
            clock in out view
        </div>
    }
}

function mapStateToProps(state) {
    var props = _.clone(state);

    return props;
}

export default connect(
    mapStateToProps
)(ClockInOutView);
