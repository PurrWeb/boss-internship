import PropTypes from 'prop-types';
import React from "react"
import ReactDOM from "react-dom"

var $ = require("jquery")
require("jquery-ui/datepicker");

export default class DatePicker extends React.Component {
    static propTypes = {
        date: PropTypes.instanceOf(Date),
        onChange: PropTypes.func.isRequired
    }
    render(){
        // The page automatically interprets a date-picker class
        // as another date picker that needs to be initialized,
        // resulting in a double datepicker ui
        // Use different class name to avoid
        return <div className="react-date-picker"/>
    }
    componentWillReceiveProps(newProps) {
        this.reactToProps(newProps);
    }
    componentDidMount(){
        var self = this;
        var node = ReactDOM.findDOMNode(this);

        $(node).datepicker( {
            showOtherMonths: true,
            selectOtherMonths: true,
            firstDay: 1,
            onSelect: function(dateText, inst) {
                var date = $(this).datepicker('getDate');
                self.props.onChange(date)
            }
        });

        this.reactToProps(this.props);
    }
    reactToProps(props){
        var {date} = props;
        var node = ReactDOM.findDOMNode(this);
        $(node).datepicker("setDate", date);
    }
    componentWillUnmount(){
        React.unmountComponentAtNode(ReactDOM.findDOMNode(this));
    }
}
