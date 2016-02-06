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
        return <div>
            <div>
                &lt; {this.getRotaLink(dates.previousDate)}
            </div>
            <div>
                {this.getRotaLink(dates.nextDate)} &gt; 
            </div>
        </div>
    }
    getDates(){
        var { dateOfRota } = this.props;

        var previousDate = new Date(dateOfRota);
        previousDate.setDate(dateOfRota.getDate() - 1);

        var nextDate = new Date(this.props.dateOfRota);
        nextDate.setDate(dateOfRota.getDate() + 1);

        return {
            previousDate,
            nextDate
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
}