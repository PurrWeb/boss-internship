import React from "react"
import { connect } from "react-redux"
import _ from "underscore"
import { appRoutes } from "~lib/routes"
import GenericRotaNavigation from "~components/rota-navigation"

class RotaNavigation extends React.Component {
    render(){
        return <GenericRotaNavigation
            dateOfRota={this.props.dateOfRota}
            getRotaLink={(date) => appRoutes.staffTypeRota({
                staffTypeSlug: this.props.staffTypeSlug,
                dateOfRota: date
            })}
            getRotaOverviewLink={({weekStartDate, weekEndDate}) => appRoutes.staffTypeRotaOverview({
                staffTypeSlug: this.props.staffTypeSlug,
                weekStartDate
            })} />
    }
}

function mapStateToProps(state){
    var dateOfRota = _.values(state.rotas)[0].date;
    return {
        dateOfRota,
        staffTypeSlug: state.pageOptions.staffTypeRotaOptions.staffTypeSlug
    }
}

export default connect(mapStateToProps)(RotaNavigation)