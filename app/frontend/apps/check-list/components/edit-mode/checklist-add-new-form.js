import React from 'react';
import { Field, reduxForm, FieldArray, SubmissionError, reset, change } from 'redux-form/immutable';
import {Collapse} from 'react-collapse';
import { connect } from 'react-redux';
import humanize from 'string-humanize';
import { fromJS, Map, List } from 'immutable';

import ChecklistNameField from './form-fields/checklist-name-field';
import AddNewItemField from './form-fields/add-new-item-field';
import AddedNewItemField from './form-fields/added-new-item-field';

import {submitAddNew} from '../../actions/check-lists-actions';

function submission(values, dispatch) {
  if (values.get('lastValue')) {
    if (!values.get('check_list_items')) {
      values = values.set('check_list_items', List([]))
    }
    values = values
      .updateIn(['check_list_items'], (items) => items.push(values.get('lastValue')))
      .delete('lastValue');
  }

  return dispatch(submitAddNew(values.toJS())).catch(resp => {
    let errors = resp.response.data.errors;
    if (errors) {
      let base = {};

      if (errors.base) {
        base = {
          _error: errors.base
        }
      }

      if (errors.check_list_items) {
        errors.check_list_items = {
          _error: errors.check_list_items
        }
      }
      throw new SubmissionError({...errors, ...base});
    }
  })
}

class ChecklistAddNewForm extends React.Component {
  cancelAddNew = () => {
    this.props.isOpen && this.props.onToggleChecklist();
    this.props.dispatch(reset('checklist-add-new'));
  }

  onAddNewValueChange = (value) => {
    this.props.dispatch(change('checklist-add-new', 'lastValue', value));
  }

  renderChecklistItems = ({ fields, meta: { error } }) => {
    return (
      <div className="boss-checklist__items">
        { fields.map((item, index) => 
            <Field
              key={index}
              name={item}
              onRemove={() => fields.remove(index)}
              component={AddedNewItemField}
            />
        )}
        {
          error &&
            <div className="boss-form__error">
              <p className="boss-form__error-text">
                <span className="boss-form__error-line"><strong>Checklist items: </strong>{error.join(', ')}</span>
              </p>
            </div>
        }
        <AddNewItemField
          onValueChange={(value) => this.onAddNewValueChange(value)}
          onValueClear={() => this.onAddNewValueChange('')}
          onAddNew={(value) => fields.push(value)}
        />
      </div>
    )
  }
  
  render() {
    return (
      <section className="boss-board boss-board_context_stack">
        <form onSubmit={this.props.handleSubmit(submission)} className="boss-board__form">
          <header className="boss-board__header">
            <Field
              name="name"
              onFocus={() => !this.props.isOpen && this.props.onToggleChecklist()}
              component={ChecklistNameField}
              required
            />
            <div className="boss-board__button-group boss-board__button-group_role_add">
              {
                this.props.isOpen
                ? <button type="button" onClick={() => this.cancelAddNew()} className="boss-button boss-button_role_cancel boss-board__action boss-board__action_type_fluid boss-board__action_role_switch">
                  Cancel
                </button>
                : <button type="button" onClick={() => !this.props.isOpen && this.props.onToggleChecklist()} className="boss-button boss-button_role_add boss-board__action boss-board__action_type_fluid boss-board__action_role_switch">
                  Add new
                </button>
              }
            </div>
          </header>
            { this.props.isOpen && <div className="boss-board__content boss-board__content_state_opened">
              <div className="boss-board__content-inner">
                <div className="boss-board__checklist">
                  <div className="boss-checklist">
                    <div className="boss-checklist__content">
                      <FieldArray name="check_list_items" component={this.renderChecklistItems} />
                      <div className="boss-checklist__actions">
                        <button
                          type="submit"
                          disabled={this.props.submitting}
                          className="boss-button boss-button_role_primary"
                        >Done</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}   
        </form>
      </section>
    )
  }
}

export default reduxForm({
  fields: ['lastValue'],
  form: 'checklist-add-new',
})(ChecklistAddNewForm);
