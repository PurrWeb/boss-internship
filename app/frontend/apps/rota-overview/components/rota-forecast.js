import React from "react"

export default class RotaForecast extends React.Component {
    static propTypes = {
        rotaForecast: React.PropTypes.object.isRequired
    }
    render(){
        return <div>{JSON.stringify(this.props.rotaForecast, null, 4)}</div>
    }
}