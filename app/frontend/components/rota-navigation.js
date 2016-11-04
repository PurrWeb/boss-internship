import React from "react"
import moment from "moment"
import utils from "~lib/utils"

export default class RotaNavigation extends React.Component {
    static PropTypes = {
        dateOfRota: React.PropTypes.instanceOf(Date).isRequired,
        getRotaLink: React.PropTypes.func.isRequired,
        getRotaOverviewLink: React.PropTypes.func.isRequired
    }
    render(){
        var dates = this.getDates();
        return <div style={{textAlign: "center", overflow: "hidden"}}>
            <div style={{float: "left"}}>
                &lt; <a href={this.props.getRotaLink(dates.previousDate)}>
                    {moment(dates.previousDate).format("DD MMM YYYY")}
                </a>
            </div>
            <div style={{float: "right"}}>
                <a href={this.props.getRotaLink(dates.nextDate)}>
                    {moment(dates.nextDate).format("DD MMM YYYY")}
                </a> &gt; 
            </div>
            <div>
                <a href={this.props.getRotaOverviewLink({
                    weekStartDate: dates.weekStartDate,
                    weekEndDate: dates.weekEndDate
                })}>
                    Weekly Rota Overview
                </a>
            </div>
        </div>
    }
    getDates(){
        var { dateOfRota } = this.props;

        var previousDate = new Date(dateOfRota);
        previousDate.setDate(dateOfRota.getDate() - 1);

        var nextDate = new Date(this.props.dateOfRota);
        nextDate.setDate(dateOfRota.getDate() + 1);

        var weekStartDate = utils.getWeekStartDate(dateOfRota);
        var weekEndDate = utils.getWeekEndDate(dateOfRota);

        return {
            previousDate,
            nextDate,
            weekStartDate,
            weekEndDate
        }
    }
}