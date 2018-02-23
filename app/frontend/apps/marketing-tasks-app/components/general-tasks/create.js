import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import notify from '~/components/global-notification';

import GeneralTaskForm from './form';

import {
   createGeneralTask,
} from '../../actions/validations';

const initialValues = {
  title: '',
  description: '',
}

export default class CreateGeneralTask extends React.Component {
  submission = (values, dispatch) => {
    return dispatch(createGeneralTask(values.toJS())).then(resp => {
      this.props.queryFilteredMarketingTasks(this.props.filter);
    }).catch(resp => {
      let errors = resp.response.data.errors;

      if (errors) {
        if (errors.base) {
          errors._error = errors.base
        }

        notify('Something went wrong creating this task', {
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
        submission={this.submission}
        initialValues={initialValues}
        venueOptions={ this.venueOptions() }
        actionValue="create"
      />
    )
  }
}
