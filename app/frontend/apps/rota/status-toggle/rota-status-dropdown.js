import PropTypes from 'prop-types';
import React, { Component } from "react"
import Select from "react-select"
import rotaStatusTitles from "~/lib/rota-status-titles"


export default class RotaStatusDropdown extends Component {
    static propTypes = {
        selectedStatus: PropTypes.string.isRequired,
        statuses: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired
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
