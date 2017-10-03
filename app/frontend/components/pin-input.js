import React from "react"
import _ from "underscore"

class NumPadButton extends React.Component {
    render(){
        return <button
                type="button"
                className="boss-modal-window__numpad-button no-zoom"
                onClick={() => this.props.onNumberClick(this.props.number)}>
            {this.props.number}
        </button>
    }
}

class NumPad extends React.Component {
    componentDidMount() {
      // Hack to prevent double click zooming
      $('.no-zoom').bind('touchend', function(e) {
        e.preventDefault();
        $(this).click();
      })
    }
  
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
                <NumPadButton number={0} onNumberClick={this.props.onNumberClick }/>
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
    }

    generatePasswordLabel = (length) => {
      let asterix = "*";
      let label = "";
      for (let i = 0; i < length; i++) {
        label = label + asterix;
      }

      return label;
    }

    render(){
        return <div className="boss-modal-window__controls-block">
              <div className="boss-modal-window__numpad-label">{this.generatePasswordLabel(this.props.pin.length)}</div>
              <NumPad onNumberClick={this.boundOnNumberClick} />
            </div>
    }
    onNumberClick(number){
      this.props.onChange(this.props.pin + number)
    }
}
