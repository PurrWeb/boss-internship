import React, { Component } from 'react';

export default class ReusableModalContent extends Component {
  render() {
    return (
      <div className="boss-modal-window__message-block">
        <div className="boss-modal-window__message-group">
          <div className="boss-modal-window__message-text">Are you sure you want to request a refund?</div>
        </div>
        <div className="boss-modal-window__message-group">
          <div className="boss-modal-window__form">
            <div className="boss-form">
              <div className="boss-form__row">
                <div className="boss-form__field boss-form__field_layout_half">
                  <button
                    onClick={() => this.props.onSubmit({ reusable: true })}
                    className="boss-button boss-button_type_panel boss-button_color_accent-red"
                  >
                    <span className="boss-button__number">+1</span>
                    <span className="boss-button__text">Item is Reusable</span>
                  </button>
                </div>
                <div className="boss-form__field boss-form__field_layout_half">
                  <button
                    onClick={() => this.props.onSubmit({ reusable: false })}
                    className="boss-button boss-button_type_panel boss-button_color_accent-red"
                  >
                    <span className="boss-button__number" />
                    <span className="boss-button__text">Item is Reusable</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
