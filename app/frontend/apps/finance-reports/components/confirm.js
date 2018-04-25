import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AsyncButton from 'react-async-button';
import oFetch from 'o-fetch';
import moment from 'moment';

class Confirm extends PureComponent {
  state = {
    isSubmitting: false,
  };

  handleSubmit = () => {
    this.setState({ isSubmitting: true });
    return this.props.onSubmit(this.props.params).catch(err => this.setState({ isSubmitting: false }));
  };

  render() {
    return (
      <div>
        <div className="boss-modal-window__message-block">
          <span className="boss-modal-window__message-text">Marking report as "Completed" can't be undone.</span>
          <span className="boss-modal-window__message-text">Do you want to continue</span>
        </div>

        <div className="boss-modal-window__actions">
          <button
            className="boss-button boss-button_role_inactive boss-modal-window__button"
            disabled={this.state.isSubmitting}
            onClick={this.props.onClose}
          >
            CANCEL
          </button>
          <AsyncButton
            text="Confirm"
            pendingText="Confirming ..."
            onClick={this.handleSubmit}
            className="boss-button boss-modal-window__button"
          />
        </div>
      </div>
    );
  }
}

Confirm.propTypes = {};

export default Confirm;
