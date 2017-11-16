import React from 'react';

export default class ToggleButton extends React.Component {
  state = {
    toggle: false,
  }

  onClick = () => {
    this.setState(state => ({toggle: !state.toggle}), () => {
      this.props.onClick(this.state.toggle);
    });
  }

  render() {
    return (
      <button
        className={this.state.toggle ? this.props.toggleClassName : this.props.className}
        onClick={this.onClick}
      >{this.state.toggle ? this.props.toggleText : this.props.text}</button>
    )
  }
}
