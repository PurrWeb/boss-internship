import React from "react"
import { connect } from "react-redux"
import _ from "underscore"
import { appRoutes } from "~lib/routes"
import GenericRotaNavigation from "~components/rota-navigation"

class RotaNavigation extends React.Component {
    render(){
        return <GenericRotaNavigation
            className="mb-md"
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
    return {
        dateOfRota: state.pageOptions.dateOfRota,
        staffTypeSlug: state.pageOptions.staffTypeSlug
    }
}

export default connect(mapStateToProps)(RotaNavigation)