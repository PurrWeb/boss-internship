import React from "react"

var style = {
    maxHeight: 200,
    overflow: "auto"
}

export default class ErrorMessage extends React.Component {
    render(){
        return <div className="callout alert" style={style}>
            {this.props.children}
        </div>
    }
}
