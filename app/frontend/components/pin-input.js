import React from "react"

class NumPadButton extends React.Component {
    render(){
        return <div
                data-test-marker-numpad-key={this.props.number}
                onTouchStart={(e) => e.preventDefault() /* prevent zooming in */}
                onClick={() => this.props.onNumberClick(this.props.number)}>
            {this.props.number}
        </div>
    }
}

class NumPad extends React.Component {
    render(){
        return <div className="numpad">
            <div>
                <NumPadButton number={1} onNumberClick={this.props.onNumberClick }/>
                <NumPadButton number={2} onNumberClick={this.props.onNumberClick }/>
                <NumPadButton number={3} onNumberClick={this.props.onNumberClick }/>
            </div>
            <div>
                <NumPadButton number={4} onNumberClick={this.props.onNumberClick }/>
                <NumPadButton number={5} onNumberClick={this.props.onNumberClick }/>
                <NumPadButton number={6} onNumberClick={this.props.onNumberClick }/>
            </div>
            <div>
                <NumPadButton number={7} onNumberClick={this.props.onNumberClick }/>
                <NumPadButton number={8} onNumberClick={this.props.onNumberClick }/>
                <NumPadButton number={9} onNumberClick={this.props.onNumberClick }/>
            </div>
            <div>
                <div>&nbsp;</div>
                <NumPadButton number={0} onNumberClick={this.props.onNumberClick }/>
                <div>&nbsp;</div>
            </div>
        </div>
    }
}

export default class PinInput extends React.Component {
    static propTypes = {
        pin: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
    }
    render(){
        var inputStyle = {
            pointerEvents: "none",
            width: "100%",
            fontSize: 20,
            marginTop: 10
        }

        return <div style={{position: "relative"}}>
                <input
                    type="password"
                    style={inputStyle}
                    value={this.props.pin}
                    />
                <br/><br/>
                <NumPad onNumberClick={(number) => this.props.onChange(this.props.pin + number)} />
            </div>
    }
}
