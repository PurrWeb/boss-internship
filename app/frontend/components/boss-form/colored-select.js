import React from 'react';

export class ColoredMultipleValue extends React.Component {
  handleMouseDown = event => {
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
  };

  onRemove = event => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onRemove(this.props.value);
  };

  handleTouchEndRemove = event => {
    // Check if the view is being dragged, In this case
    // we don't want to fire the click event (because the user only wants to scroll)
    if (this.dragging) return;

    // Fire the mouse events
    this.onRemove(event);
  };

  handleTouchMove = event => {
    // Set a flag that the view is being dragged
    this.dragging = true;
  };

  handleTouchStart = event => {
    // Set a flag that the view is not being dragged
    this.dragging = false;
  };

  render() {
    return (
      <div
        className="Select-value"
        style={{ backgroundColor: this.props.value.color }}
      >
        <span
          className="Select-value-icon"
          onMouseDown={this.onRemove}
          onTouchEnd={this.handleTouchEndRemove}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
        >
          ×
        </span>
        <span className="Select-value-label">{this.props.children}</span>
      </div>
    );
  }
}

export class ColoredSingleValue extends React.Component {
  handleMouseDown = event => {
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
  };

  handleTouchEndRemove = event => {
    // Check if the view is being dragged, In this case
    // we don't want to fire the click event (because the user only wants to scroll)
    if (this.dragging) return;

    // Fire the mouse events
    this.onRemove(event);
  };

  handleTouchMove = event => {
    // Set a flag that the view is being dragged
    this.dragging = true;
  };

  handleTouchStart = event => {
    // Set a flag that the view is not being dragged
    this.dragging = false;
  };

  render() {
    return (
      <div className="Select-value" style={{ color: '#4c4c4c' }}>
        <span
          className="Select-color-indicator"
          style={{ backgroundColor: this.props.value.color }}
        />
        {this.props.children}
      </div>
    );
  }
}

export class ColoredOption extends React.Component {
  handleMouseDown = event => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  };

  handleMouseEnter = event => {
    this.props.onFocus(this.props.option, event);
  };

  handleMouseMove = event => {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  };

  render() {
    return (
      <div
        className={this.props.className}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={this.props.option.title}
        style={{ backgroundColor: this.props.option.color, color: '#FFFFFF' }}
      >
        {this.props.children}
      </div>
    );
  }
}

@option
export class ColoredSingleOption extends React.Component {
  render() {
    return (
      <div>
        <span className="Select-color-indicator" style={{backgroundColor: this.props.option.color}}></span>
        <span>{this.props.option.label}</span>
      </div>
    )
  }
}

function option(Component) {
  return class Option extends React.Component {
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
        >
          <Component {...this.props}/>
        </div>
      )
    }
  }
}

function value(Component) {
  return class Value extends React.Component {
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

    handleTouchEndRemove = (event) => {
      if(this.dragging) return;
      this.onRemove(event);
    }

    handleTouchMove = (event) => {
      this.dragging = true;
    }

    handleTouchStart = (event) => {
      this.dragging = false;
    }

    render() {
      return (
        <div className="Select-value">
          <Component {...this.props} />
        </div>
      )
    }
  }
}

@option
export class ImageOption extends React.Component {
  render() {
    return (
      <span className="Select-staff-member">
        <span className="Select-staff-member-avatar">
          <img src={this.props.option.image} alt=""/>
        </span>
        <span className="Select-staff-member-name">{this.props.option.label}</span>
      </span>
    )
  }
}
@value
export class ImageValue extends React.Component {
  render() {
    return (
      <span className="Select-staff-member">
        <span className="Select-staff-member-avatar">
          <img src={this.props.value.image} alt=""/>
        </span>
        <span className="Select-staff-member-name">{this.props.value.label}</span>
      </span>
    )
  }
}
