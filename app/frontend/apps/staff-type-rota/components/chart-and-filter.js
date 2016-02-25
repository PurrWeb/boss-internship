import React from "react"
import RotaChart from "~components/rota-chart"
import _ from "underscore"

export default class ChartAndFilter extends React.Component {
    static propTypes = {
        staffMembers: React.PropTypes.object.isRequired,
        rotaShifts: React.PropTypes.object.isRequired,
        staffTypes: React.PropTypes.object.isRequired,
        updateStaffToPreview: React.PropTypes.func.isRequired,
        updateStaffToShow: React.PropTypes.func.isRequired,
        staffToPreview: React.PropTypes.object,
        staffToShow: React.PropTypes.object
    }
    static childContextTypes = {
        staffTypes: React.PropTypes.object
    }
    getChildContext(){
        return {
            staffTypes: this.props.staffTypes
        }
    }

    render(){
        return <div>
            <RotaChart
                rotaShifts={_.values(this.props.rotaShifts)}
                startTime={8}
                endTime={8}
                staff={this.props.staffMembers}
                updateStaffToPreview={this.props.updateStaffToPreview}
                updateStaffToShow={this.props.updateStaffToShow}
                staffToPreview={this.props.staffToPreview}
                staffToShow={this.props.staffToShow} />
        </div>
    }
}