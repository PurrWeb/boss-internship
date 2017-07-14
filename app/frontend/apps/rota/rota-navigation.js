import React from "react"
import GenericRotaNavigation from "~/components/rota-navigation"
import {appRoutes} from "~/lib/routes"

export default class RotaNavigation extends React.Component {
    static PropTypes = {
        dateOfRota: React.PropTypes.instanceOf(Date).isRequired,
        venueServerId: React.PropTypes.number.isRequired
    }
    render(){
        return <GenericRotaNavigation
            dateOfRota={this.props.dateOfRota}
            getRotaLink={(date) => this.getRotaLink(date)}
            getRotaOverviewLink={({weekStartDate, weekEndDate}) => this.getRotaOverviewLink({weekStartDate, weekEndDate})} />
    }
    getRotaLink(date){
        return appRoutes.rota({
            venueId: this.props.venueServerId,
            date
        });
    }
    getRotaOverviewLink({weekStartDate, weekEndDate}) {
        return appRoutes.rotaOverview({
            venueId: this.props.venueServerId,
            startDate: weekStartDate,
            endDate: weekEndDate
        });
    }
}