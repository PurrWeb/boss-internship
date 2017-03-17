import React, { Component } from "react"
import ShiftEditor from "../containers/shift-editor"

export default class ShiftItem extends Component {
    render(){
        var venueInfo = null;
        if (this.props.venueObject) {
            venueInfo = <div
                className="boss3-badge"
                style={{
                    backgroundColor: this.props.venueColor,
                    display: "inline-block",
                    marginLeft: -2,
                    marginBottom: 2
                }}>
                {this.props.venueObject.name}
            </div>
        }
        return <div>
            {venueInfo}
            <ShiftEditor
                shift={this.props.shift} />
        </div>
    }
}
