import React from 'react';

export class ColoredValue extends React.Component {
  handleMouseDown = (event) => {
		if (event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		if (this.props.onClick) {
			event.stopPropagation();
			this.props.onClick(this.props.value, event);
			return;
		}
		if (this.props.value.href) {
			event.stopPropagation();
		}
	}

  onRemove = (event) => {
		event.preventDefault();
		event.stopPropagation();
		this.props.onRemove(this.props.value);
	}

	handleTouchEndRemove = (event) => {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if(this.dragging) return;

		// Fire the mouse events
		this.onRemove(event);
	}

	handleTouchMove = (event) => {
		// Set a flag that the view is being dragged
		this.dragging = true;
	}

	handleTouchStart = (event) => {
		// Set a flag that the view is not being dragged
		this.dragging = false;
  }
  
  render() {
    return (
      <div className="Select-value" style={{backgroundColor: this.props.value.color}}>
        <span
          className="Select-value-icon"
          onMouseDown={this.onRemove}
          onTouchEnd={this.handleTouchEndRemove}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
        >×</span>
        <span className="Select-value-label">
          {this.props.children}
        </span>
      </div>
    )
  }
}

export class ColoredOption extends React.Component {
  handleMouseDown = (event) => {
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.option, event);
  }
  
	handleMouseEnter = (event) => {
		this.props.onFocus(this.props.option, event);
  }
  
	handleMouseMove = (event) => {
		if (this.props.isFocused) return;
		this.props.onFocus(this.props.option, event);
	}
  
  render() {
    return (
      <div
        className={this.props.className}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={this.props.option.title}
        style={{backgroundColor: this.props.option.color, color: '#FFFFFF'}}
      >{this.props.children}</div>
    )
  }
}
