import React from "react"

export default class PinInput extends React.Component {
    static propTypes = {
        pin: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
    }
    render(){
        var interactionInputStyle = {
            width: "100%",
            fontFamily: "monospace"
        }
        var visibleInputStyle = {
            ...interactionInputStyle,
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            left: 0
        }

        return <div style={{position: "relative"}}>
                <input
                    type="password"
                    style={visibleInputStyle}
                    value={this.props.pin}
                    />
                <input
                    type="number"
                    pattern="\d*"
                    style={interactionInputStyle}
                    value={this.props.pin}
                    onChange={() => this.props.onChange(this.refs.input.value)}
                    ref={"input"} />
            </div>
    }
    focus(){
        this.refs.input.focus()
    }
}
