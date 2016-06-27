import React from "react"

export default class PinInput extends React.Component {
    static propTypes = {
        pin: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
    }
    render(){
        return <input
            type="number"
            style={{width: "100%"}}
            value={this.props.pin}
            onChange={() => this.props.onChange(this.refs.input.value)}
            ref={"input"}></input>
    }
    focus(){
        this.refs.input.focus()
    }
}
