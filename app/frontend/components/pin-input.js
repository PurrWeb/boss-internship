import React from "react"
import _ from "underscore"

class NumPadButton extends React.Component {
    render(){
        return <div
                className="boss-modal-window__numpad-button"
                data-test-marker-numpad-key={this.props.number}
                onTouchStart={(e) => e.preventDefault() /* prevent zooming in */}
                onClick={() => this.props.onNumberClick(this.props.number)}>
            {this.props.number}
        </div>
    }
}

class NumPad extends React.Component {
    render(){
        return <div className="boss-modal-window__numpad">
            <div className="boss-modal-window__numpad-row">
                <NumPadButton number={1} onNumberClick={this.props.onNumberClick }/>
                <NumPadButton number={2} onNumberClick={this.props.onNumberClick }/>
                <NumPadButton number={3} onNumberClick={this.props.onNumberClick }/>
            </div>
            <div className="boss-modal-window__numpad-row">
                <NumPadButton number={4} onNumberClick={this.props.onNumberClick }/>
                <NumPadButton number={5} onNumberClick={this.props.onNumberClick }/>
                <NumPadButton number={6} onNumberClick={this.props.onNumberClick }/>
            </div>
            <div className="boss-modal-window__numpad-row">
                <NumPadButton number={7} onNumberClick={this.props.onNumberClick }/>
                <NumPadButton number={8} onNumberClick={this.props.onNumberClick }/>
                <NumPadButton number={9} onNumberClick={this.props.onNumberClick }/>
            </div>
            <div className="boss-modal-window__numpad-row">
                <div className="boss-modal-window__numpad-button">&nbsp;</div>
                <NumPadButton number={0} onNumberClick={this.props.onNumberClick }/>
                <div className="boss-modal-window__numpad-button">&nbsp;</div>
            </div>
        </div>
    }
}

export default class PinInput extends React.Component {
    static propTypes = {
        pin: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
    }
    constructor(props){
        super(props)
        this.boundOnNumberClick = _.bind(this.onNumberClick, this);
        //this.throttledOnNumberClick = _.throttle(boundOnNumberClick, 100, {trailing: false})
    }
    render(){
        return <div className="boss-modal-window__controls-block" >
                <input
                    className="boss-input boss-input_big boss-input_role_in-modal-window boss-input_role_pin boss-modal-window_adjust_input-pin"
                    type="password"
                    value={this.props.pin}
                    onClick={e => e.preventDefault()}
                    />
                <NumPad onNumberClick={this.boundOnNumberClick} />
            </div>
    }
    onNumberClick(number){
      this.props.onChange(this.props.pin + number)
    }
}
