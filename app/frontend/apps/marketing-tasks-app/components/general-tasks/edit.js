import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import notify from '~/components/global-notification';

import GeneralTaskForm from './form';
import moment from 'moment';

import {
   editGeneralTask,
} from '../../actions/validations';

export default class EditGeneralTask extends React.Component {
  initialValues() {
    let venue = this.venueOptions().find((v) => { return v.value == this.props.selectedMarketingTask.venue.id })

    return {
      id: this.props.selectedMarketingTask.id,
      title: this.props.selectedMarketingTask.title,
      description: this.props.selectedMarketingTask.description,
      venue: venue,
      due_at: moment(this.props.selectedMarketingTask.dueAt)
    }
  }

  actionValue() {
    if (this.props.selectedMarketingTask) {
      return 'edit';
    } else {
      return 'create';
    }
  }

  submission = (values, dispatch) => {
    return dispatch(editGeneralTask(values.toJS())).catch(resp => {
      let errors = resp.response.data.errors;

      if (errors) {
        if (errors.base) {
          errors._error = errors.base
        }

        notify('Something went wrong while editing this task', {
          interval: 5000,
          status: 'error'
        });

        throw new SubmissionError({...errors});
      }
    })
  }

  venueOptions() {
    return this.props.venues.map((venue) => {
      return { label: venue.name, value: venue.id + '' }
    });
  }

  render() {
    return (
      <GeneralTaskForm
        submission={ this.submission }
        initialValues={ this.initialValues() }
        venueOptions={ this.venueOptions() }
        actionValue={ this.actionValue() }
      />
    )
  }
}
