import React from 'react';

export default class InputInlineField extends React.Component {
  onChangeHandler(e) {
    this.props.input.onChange(e);

    if (this.props.input.name == 'title') {
      let title = $('#message-title').val();

      $('#message-title-preview').html(title);
    }
  }

  componentDidMount() {
    $('#message-title-preview').html(this.props.input.value);
  }

  render() {
    const { input, label, required, type, meta: { touched, error, warning }} = this.props;

    return (
      <div className="boss-form__row">
        <div className="boss-form__field boss-form__field_role_label-small boss-form__field_position_last">
          <p className="boss-form__label">
            <span className="boss-form__label-text boss-form__label-text_type_inline-fluid">
              {label}
            </span>
          </p>
        </div>
        <div className="boss-form__field boss-form__field_layout_max">
          <input
            id="message-title"
            value={input.value}
            type={ type }
            onChange={ this.onChangeHandler.bind(this) }
            placeholder={ label }
            className={`boss-form__input ${touched && error && 'boss-form__input_state_error'}`}
          />
          {
            touched && error &&
              <div className="boss-form__error">
                <p className="boss-form__error-text">
                  <span className="boss-form__error-line">{error}</span>
                </p>
              </div>
          }
        </div>
      </div>
    )
  }
}
