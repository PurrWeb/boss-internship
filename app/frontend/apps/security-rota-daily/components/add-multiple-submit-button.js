import React from 'react'
import { connect } from 'react-redux'
import {
  isSubmitting,
  getFormValues,
} from 'redux-form/immutable';

import {submitMultipleStaffShift} from '../actions';

function AddMultipleSubmitButton({ dispatch, staffMemberId, submitting }) {
  return (
    <button
      type="button"
      disabled={submitting}
      className="boss-button boss-button_type_small boss-button_role_add-secondary"
      onClick={() => dispatch(submitMultipleStaffShift(staffMemberId))}
    >Add Shift</button>
  )
}

export default connect(state => ({
  submitting: isSubmitting('add-multiple-shift-form')(state),
}))(AddMultipleSubmitButton)
