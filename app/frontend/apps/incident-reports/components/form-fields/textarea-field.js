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
            className={`${touched && error && 'wysiwyg-editor_state_error'}`}
            toolbarClassName="wysiwyg-editor__toolbar"
            editorClassName="wysiwyg-editor__editor"
            toolbarConfig={{
              display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS'],
              INLINE_STYLE_BUTTONS: [
                {label: 'Bold', style: 'BOLD', className: 'wysiwyg-editor__button'},
                {label: 'Italic', style: 'ITALIC', className: 'wysiwyg-editor__button'},
                {label: 'Underline', style: 'UNDERLINE', className: 'wysiwyg-editor__button'}
              ],
              BLOCK_TYPE_BUTTONS: [
                {label: 'UL', style: 'unordered-list-item', className: 'wysiwyg-editor__button'},
                {label: 'OL', style: 'ordered-list-item', className: 'wysiwyg-editor__button'}
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
