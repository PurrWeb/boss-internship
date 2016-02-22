import React from "react"

export default class ErrorMessage extends React.Component {
    render(){
        return <div className="alert alert-danger">
            {this.props.children}
        </div>
    }
}