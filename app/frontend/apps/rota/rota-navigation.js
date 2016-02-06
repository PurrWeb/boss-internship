import React from "react"
import moment from "moment"
import {appRoutes} from "~lib/routes"

export default class RotaNavigation extends React.Component {
    static PropTypes = {
        dateOfRota: React.PropTypes.instanceOf(Date).isRequired,
        venueId: React.PropTypes.number.isRequired
    }
    render(){
        var dates = this.getDates();
        return <div style={{textAlign: "center", overflow: "hidden"}}>
            <div style={{float: "left"}}>
                &lt; {this.getRotaLink(dates.previousDate)}
            </div>
            <div style={{float: "right"}}>
                {this.getRotaLink(dates.nextDate)} &gt; 
            </div>
            <div>
                {this.getRotaOverviewLink(dates.weekStartDate, dates.weekEndDate)}
            </div>
        </div>
    }
    getDates(){
        var { dateOfRota } = this.props;

        var previousDate = new Date(dateOfRota);
        previousDate.setDate(dateOfRota.getDate() - 1);

        var nextDate = new Date(this.props.dateOfRota);
        nextDate.setDate(dateOfRota.getDate() + 1);

        var weekStartDate = moment(dateOfRota).startOf("isoweek").toDate();
        var weekEndDate = moment(dateOfRota).endOf("isoweek").toDate();

        return {
            previousDate,
            nextDate,
            weekStartDate,
            weekEndDate
        }
    }
    getRotaLink(date){
        var href = appRoutes.rota({
            venueId: this.props.venueId,
            date
        });
        return <a href={href}>
            {moment(date).format("DD MMM YYYY")}
        </a>
    }
    getRotaOverviewLink(weekStartDate, weekEndDate) {
        var href = appRoutes.rotaOverview({
            venueId: this.props.venueId,
            startDate: weekStartDate,
            endDate: weekEndDate
        });
        return <a href={href}>
            Weekly Rota Overview
        </a>
    }
}