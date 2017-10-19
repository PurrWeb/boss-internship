import React from 'react';

export default class AddVoucherModal extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      description: ''
    }
  }

  changeVoucherDescription(value) {
    this.setState({
      description: value,
    });
  }

  createVoucher = () => {
    this.props.createVoucher(this.state.description);
  }

  render () {
    return <div>
      <div className="boss-modal-window__header">New Voucher</div>
      <div className="boss-modal-window__content">
        <div className="boss-form">
          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text boss-form__label-text_type_required">Description</span>
              <input name="voucher-description" type="text" onChange={(e) => this.changeVoucherDescription(e.target.value)} className="boss-form__input" />
            </label>
          </div>
          <div className="boss-form__row boss-form__row_position_last">
            <div className="boss-form__field boss-form__field_justify_center">
              <button onClick={this.createVoucher} className="boss-button boss-button_role_add boss-form__submit" type="submit">Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}