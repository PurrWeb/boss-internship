import React from 'react';
import ReactDOM from 'react-dom';

const STATUSES = {
  success: 'boss-alert_status_success',
  error: 'boss-alert_status_error',
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

  ReactDOM.render(
    <div className={`boss-alert boss-alert_role_page-note ${status}`}>
      <p className="boss-alert__text">{confirmation}</p>
      <button onClick={() => close()} className="boss-alert__button-close"></button>
    </div>,
    wrapper
  );

  clear = setTimeout(() => {
    removeComponent();
  }, options.interval || 5000)
}
