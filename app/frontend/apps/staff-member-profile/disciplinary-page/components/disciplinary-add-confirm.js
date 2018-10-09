import React, { PureComponent } from 'react';
import AsyncButton from 'react-async-button';

class DisciplinaryAddConfirm extends PureComponent {
  state = {
    isSubmitting: false,
  };

  handleSubmit = () => {
    return this.props.onSubmit(this.props.values);
  };

  render() {
    return (
      <div>
        <div className="boss-modal-window__message-block">
          <span className="boss-modal-window__message-text">
            Continuing will notify the staff member of this disciplinary along with the all the details entered in this form
          </span>
        </div>

        <div className="boss-modal-window__actions">
          <button
            className="boss-button boss-button_role_inactive boss-modal-window__button"
            disabled={this.state.isSubmitting}
            onClick={this.props.onClose}
          >
            BACK TO FORM
          </button>
          <AsyncButton
            text="Continue"
            pendingText="Confirming ..."
            onClick={this.handleSubmit}
            className="boss-button boss-modal-window__button"
          />
        </div>
      </div>
    );
  }
}

export default DisciplinaryAddConfirm;
