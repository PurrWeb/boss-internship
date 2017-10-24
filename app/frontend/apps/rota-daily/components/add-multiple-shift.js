import React from 'react';
import AddMultipleShiftForm from './add-multiple-shift-form';
import RotaDate from "~/lib/rota-date-new";
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
    
    const shiftRotaDate = new RotaDate({
      dateOfRota: rotaDate,
    });

    return (
      <AddMultipleShiftForm
        initialValues={initialValues}
        shiftRotaDate={shiftRotaDate}
        rotaStatus={this.props.rotaStatus}
      />
    )
  }
}

export default AddMultipleShift;
