import React from 'react';

class PrintField extends React.Component {
  renderQuantityBox() {
    const {
      print,
      quantity,
      required,
      label
    } = this.props;

    if (!this.props.print.input.value) return;

    return (
      <div className="boss-form__checkbox-extra">
        <label className="boss-form__label">
          <input
            {...quantity.input}
            type="number"
            placeholder="Quantity"
            disabled={ !print.input.value }
            className={`boss-form__input boss-form__input_adjust_checkbox ${quantity.meta.touched && quantity.meta.error && 'boss-form__input_state_error'}`}
          />
        </label>
      </div>
    );
  }
  render() {
    const {
      print,
      quantity,
      required,
      label
    } = this.props;

    return (
      <div className="boss-form__field">
        <div className="boss-form__row boss-form__row_layout_nowrap">
          <div className="boss-form__field boss-form__field_layout_min">
            <div className="boss-form__checkbox-control">
              <label className="boss-form__checkbox-label">
                <input
                  { ...print.input }
                  type="checkbox"
                  className="boss-form__checkbox-input"
                  checked={ print.input.value }
                />
                <span className="boss-form__checkbox-label-text">Print</span>
              </label>

              { this.renderQuantityBox() }
            </div>

            {
              quantity.meta.touched && quantity.meta.error &&
                <div className="boss-form__error">
                  <p className="boss-form__error-text">
                    <span className="boss-form__error-line">{ quantity.meta.error }</span>
                  </p>
                </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default PrintField;
