import React from "react"
import ReactDOM from "react-dom"

var $ = require("jquery")
require("jquery-ui/datepicker");

export default class WeekPicker extends React.Component {
    render(){
        return <div/>
    }
    componentDidMount(){
        var node = ReactDOM.findDOMNode(this);
        ReactDOM.render(<div></div>, node);

        $(node).datepicker();
    }
}