import React from "react"
import ReactDOM from "react-dom"

var $ = require("jquery")
require("jquery-ui/datepicker");

// Week picker based on http://stackoverflow.com/questions/1289633/how-to-use-jquery-ui-calendar-date-picker-for-week-rather-than-day
export default class WeekPicker extends React.Component {
    render(){
        return <div/>
    }
    componentDidMount(){
        var self = this;
        var node = ReactDOM.findDOMNode(this);
        ReactDOM.render(<div></div>, node);

        var startDate;
        var endDate;
    
        var selectCurrentWeek = function() {
            window.setTimeout(function () {
                $(node).find('.ui-datepicker-current-day a').addClass('ui-state-active')
            }, 1);
        }

        function getAllDaysBetween(startDate, endDate){
            function getNextDay(date) {
                var dateClone = new Date(date);
                dateClone.setDate(date.getDate() + 1);
                return dateClone;
            }
            var allDays = [];
            var currentDate = startDate;
            while (currentDate <= endDate) {
                allDays.push(currentDate);
                currentDate = getNextDay(currentDate);
            }
            return allDays
        }
        
        $(node).datepicker( {
            showOtherMonths: true,
            selectOtherMonths: true,
            firstDay: 1,
            onSelect: function(dateText, inst) { 
                var date = $(this).datepicker('getDate');
                startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1);
                endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7);
                var dateFormat = inst.settings.dateFormat || $.datepicker._defaults.dateFormat;
                $('#startDate').text($.datepicker.formatDate( dateFormat, startDate, inst.settings ));
                $('#endDate').text($.datepicker.formatDate( dateFormat, endDate, inst.settings ));
                
                selectCurrentWeek();

                self.props.onChange({
                    startDate,
                    endDate,
                    allDays: getAllDaysBetween(startDate, endDate)
                })
            },
            beforeShowDay: function(date) {
                var cssClass = '';
                if(date >= startDate && date <= endDate)
                    cssClass = 'ui-datepicker-current-day';
                return [true, cssClass];
            },
            onChangeMonthYear: function(year, month, inst) {
                selectCurrentWeek();
            }
        });
        

        $(node).on('mousemove', "tr", function() {
            $(this).find('td a').addClass('ui-state-hover');
        });
        $(node).on('mouseleave', '.ui-datepicker-calendar tr', function() {
            $(this).find('td a').removeClass('ui-state-hover');
        });

    }
}