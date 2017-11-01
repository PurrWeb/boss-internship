import React from 'react';
import ReactDOM from 'react-dom';
import Transition from 'react-transition-group/Transition';

const STATUSES = {
  success: 'boss-alert_status_success',
  error: 'boss-alert_status_danger',
}

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered:  { opacity: 1 },
};

class Notification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };

    setTimeout(() => {
      this.setState(state => ({show: true}))
    }, 50);

    setTimeout(() => {
      this.setState(state => ({show: false}))
    }, props.interval - duration);
  }
  
  handleHide = (status) => {
    this.setState(state => ({show: !state.show}));
  }
  
  render() {
    return(
      <Transition in={this.state.show} timeout={duration} unmountOnExit={true}>
        {(state) => {
            return (
              <div style={{
                ...defaultStyle,
                ...transitionStyles[state]
              }} className={`boss-alert boss-alert_role_page-note boss-alert_position_fixed ${this.props.status}`}>
                <p className="boss-alert__text">{this.props.confirmation}</p>
                <button onClick={this.handleHide} className="boss-alert__button-close"></button>
              </div>
            )
          }
        }
      </Transition>
    )
  }
}

export default (confirmation, options = {}) => {
  const bodyFirst = document.body.firstChild;
  const wrapper = document.createElement('div');
  bodyFirst.parentNode.insertBefore(wrapper, bodyFirst);
  const status = options.status ? STATUSES[options.status] : 'boss-alert_status_success';

  let clear;

  const close = () => {
    clearInterval(clear);
    removeComponent();
  }

  const removeComponent = () => {
    ReactDOM.unmountComponentAtNode(wrapper);
    wrapper.remove();
  }

  const interval = options.interval || 5000;

  ReactDOM.render(
    <Notification
      onClose={() => close()}
      confirmation={confirmation}
      status={status}
      interval={interval}
    />,
    wrapper
  );

  clear = setTimeout(() => {
    removeComponent();
  }, interval)
}
