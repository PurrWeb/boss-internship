import React from 'react';
import RichTextEditor from 'react-rte';

class TextareaField extends React.Component {
  onChangeHandler(e) {
    this.props.input.onChange(e);

    if (this.props.input.name == 'message') {
      $('#message-preview').html(this.props.input.value.toString('html'));
    }
  }

  componentDidMount() {
    $('#message-preview').html(this.props.input.value.toString('html'));
  }

  render() {
    const { input, label, note, required, meta: { touched, error, warning }} = this.props;

    return (
      <div className="boss-form__row">
        <div className="boss-form__field boss-form__field_role_label-small boss-form__field_position_last">
          <p className="boss-form__label">
            <span className="boss-form__label-text boss-form__label-text_type_inline-fluid">{`${label} ${required ? '*' : ''}`}</span>
          </p>
        </div>

        <div className="boss-form__field boss-form__field_layout_max">
          <div className="wysiwyg-editor">
            <RichTextEditor
              id="message"
              value={input.value}
              onChange={this.onChangeHandler.bind(this)}
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

export default TextareaField;
