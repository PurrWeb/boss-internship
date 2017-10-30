import React from 'react';
import AddMultipleShiftForm from './add-multiple-shift-form';
import { SubmissionError } from 'redux-form/immutable';

import {
  addShift,
} from '../actions';

class AddMultipleShift extends React.Component {
  render() {
    const {
      rotaDate,
    } = this.props;

    const initialValues = {
      starts_at: null,
      ends_at: null,
      shift_type: "normal",
    }
        
    return (
      <AddMultipleShiftForm
        initialValues={initialValues}
        rotaDate={rotaDate}
        rotaStatus={this.props.rotaStatus}
      />
    )
  }
}

export default AddMultipleShift;
