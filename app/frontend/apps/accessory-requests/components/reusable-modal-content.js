import React, { Component } from 'react';

export default class ReusableModalContent extends Component {
  render() {
    console.log(this.props);
    return (
      <div className="boss-modal-window__form">
        <div className="boss-form">
          <div className="boss-form__row">
            <div className="boss-form__field boss-form__field_layout_half">
              <button
                onClick={() => this.props.onSubmit({ reusable: true })}
                className="boss-button boss-button_type_panel"
              >
                <span className="boss-button__number">+1</span>
                <span className="boss-button__text">Item is Reusable</span>
              </button>
            </div>
            <div className="boss-form__field boss-form__field_layout_half">
              <button
                onClick={() => this.props.onSubmit({ reusable: false })}
                className="boss-button boss-button_type_panel"
              >
                <span className="boss-button__number" />
                <span className="boss-button__text">Item is Reusable</span>
              </button>
            </div>
          </div>
          <div className="boss-form__field boss-form__field_justify_center">
            <button
              onClick={this.props.onClose}
              className="boss-button boss-button_type_extra-small boss-button_role_cancel-light boss-form__submit"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}
