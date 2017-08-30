import React from 'react';
import { Field, reduxForm, FieldArray, SubmissionError, reset } from 'redux-form/immutable';
import {Collapse} from 'react-collapse';
import { connect } from 'react-redux';
import humanize from 'string-humanize';

import ChecklistNameField from './form-fields/checklist-name-field';
import AddNewItemField from './form-fields/add-new-item-field';
import AddedNewItemField from './form-fields/added-new-item-field';

import {submitEdited} from '../../actions/check-lists-actions';

function submission(values, dispatch) {
  return dispatch(submitEdited(values.toJS())).catch(resp => {
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

function ChecklistEditSingleForm(props) {
  const {
    handleSubmit,
    submitting,
    dispatch
  } = props;
  
  function cancelAddNew() {
    isOpen && onToggleChecklist();
    dispatch(reset('checklist-add-new'));
  }

  function renderChecklistItems({ fields, meta: { error } }) {
    return (
      <div className="boss-checklist__items">
        { fields.map((item, index) => 
            <Field
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
        <AddNewItemField onAddNew={(value) => fields.push(value)} />
      </div>
    )
  }

  return (
    <section className="boss-board boss-board_context_stack">
      <form onSubmit={handleSubmit(submission)} className="boss-board__form">
        <header className="boss-board__header">
          <Field
            name="name"
            component={ChecklistNameField}
            required
          />
          <div className="boss-board__button-group boss-board__button-group_role_edit">
          <button
            className="boss-button boss-button_type_small boss-button_role_cancel boss-board__action"
          >Cancel Editing</button>
        </div>
        </header>
        <Collapse isOpened={true}>
          <div className="boss-board__content boss-board__content_state_opened">
            <div className="boss-board__content-inner">
              <div className="boss-board__checklist">
                <div className="boss-checklist">
                  <div className="boss-checklist__content">
                    <FieldArray name="check_list_items" component={renderChecklistItems} />
                    <div className="boss-checklist__actions">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="boss-button boss-button_role_primary"
                      >Done</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>          
        </Collapse>
      </form>
    </section>
  )
}

export default reduxForm({
  form: 'checklist-edit-single',
  fields: ['id', 'venue_id'],
})(ChecklistEditSingleForm);
