import React from 'react';
import { combineReducers } from 'redux';
import { reducer as formReducer, SubmissionError } from 'redux-form';
import {modalRedux} from './boss-modal'
import HolidayForm from './holiday-form';

class AddHoliday extends React.PureComponent {
  handleSubmit = (values, dispatch) => {
    return this.props.onSubmit(values, dispatch).catch((resp) => {
      if (resp.response && resp.response.data && resp.response.data.errors) {
        const errors = resp.response.data.errors;
        let base = {};

        if (errors.base) {
          base = {
            _error: errors.base
          }
        }
        throw new SubmissionError({...errors, ...base});
      }
      return resp;
    })
  }

  render() {
    const initialValues = {
      staffMember: null,
      startDate: null,
      endDate: null,
      holidayType: null,
      note: '',
    }
    return (
      <div className="boss-modal-window__form">
        <HolidayForm
          initialValues={initialValues}
          onSubmit={this.handleSubmit}
          venueId={this.props.venueId}
        />
      </div>
    )
  }
}

export default modalRedux(combineReducers({form: formReducer}))(AddHoliday);
