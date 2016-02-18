import React, { Component } from "react"
import Select from "react-select"
import rotaStatusTitles from "~lib/rota-status-titles"


export default class RotaStatusDropdown extends Component {
    static propTypes = {
        selectedStatus: React.PropTypes.string.isRequired,
        statuses: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired
    }
    render(){
        var options = this.props.statuses.map(function(status){
            return {
                value: status,
                label: rotaStatusTitles[status]
            }
        })
    
        return <Select
            value={this.props.selectedStatus}
            options={options}
            clearable={false}
            onChange={(value) => this.props.onChange(value)} />
    }
}
