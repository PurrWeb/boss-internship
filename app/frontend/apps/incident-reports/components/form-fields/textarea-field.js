import React from 'react';
import RichTextEditor from 'react-rte';

const TextareaField = ({
    input,
    label,
    note,
    required,
    meta: { touched, error, warning },
  }) => {
    return (
      <div className="boss-form__field">
        <label className="boss-form__label">
          <span className="boss-form__label-text">{`${label} ${required ? '*' : ''}`}</span>
        </label>
        <div className="wysiwyg-editor">
          <RichTextEditor
            value={input.value}
            onChange={input.onChange}
            className={`boss-form__textarea boss-form__textarea_size_large ${touched && error && 'boss-form__textarea_state_error'}`}
            toolbarConfig={{
              display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS'],
              INLINE_STYLE_BUTTONS: [
                {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
                {label: 'Italic', style: 'ITALIC'},
                {label: 'Underline', style: 'UNDERLINE'}
              ],
              BLOCK_TYPE_BUTTONS: [
                {label: 'UL', style: 'unordered-list-item'},
                {label: 'OL', style: 'ordered-list-item'}
              ]
            }}
          />
        </div>
        <p className="boss-form__field-note">{note}</p>
        {
          touched && error &&
            <div className="boss-form__error">
              <p className="boss-form__error-text">
                <span className="boss-form__error-line">{error}</span>
              </p>
            </div>
        }
      </div>
    )
  }

  export default TextareaField;
