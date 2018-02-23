import React from 'react';
import classnames from 'classnames';

import { Form, Control, Errors } from 'react-redux-form';

export default class NoteForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      noteButtonActionText: 'Add Note',
      noteValue: ''
    }
  }

  handleSubmit() {
    this.setState({ noteButtonActionText: 'Adding Note' });

    this.props.addNote(this.props.selectedMarketingTask, this.state.noteValue).then((argument) => {
      this.setState({ noteButtonActionText: 'Added' });
      this.setState({ noteValue: '' });
    })
  }

  getClassName(props) {
    if (props.fieldValue.pristine) {
      return 'boss-form__textarea';
    }

    if (props.fieldValue.valid) {
      return 'boss-form__textarea';
    } else {
      return 'boss-form__textarea boss-form__textarea_state_error';
    }
  }

  renderError(prop) {
    return (
      <p className="boss-form__error-text">
        <span className="boss-form__error-line">{ prop.children }</span>
      </p>
    );
  }

  getValue(e, props) {
    this.setState({ noteButtonActionText: 'Add Note' });

    if (e.target) {
      this.setState({ noteValue: e.target.value });

      return e.target.value;
    }
  }

  render() {
    return (
      <Form model="marketingTaskNote" className="boss-form" onSubmit={ this.handleSubmit.bind(this) }>
        <div className="boss-form__field">
          <p className="boss-form__label">
            <span className="boss-form__label-text">Add notes</span>
          </p>

          <Control.textarea
            id="note-value"
            value={ this.state.noteValue }
            getValue={ this.getValue.bind(this) }
            mapProps={{
              className: this.getClassName.bind(this)
            }}
            model=".note"
            placeholder="note"
            required
            validateOn={ ['focus', 'blur', 'change'] }
          />

          <Errors
            component={this.renderError.bind(this)}
            className="boss-form__error"
            model=".note"
            show="touched"
            messages={{
              valueMissing: 'note is required',
            }}
          />
        </div>

        <div className="boss-form__row boss-form__row_position_last">
          <div className="boss-form__field boss-form__field_justify_end">
            <button
              className="boss-button boss-button_role_add boss-form__submit boss-form__submit_adjust_single"
              type="submit"
            >
              { this.state.noteButtonActionText }
            </button>
          </div>
        </div>
      </Form>
    );
  }
}
