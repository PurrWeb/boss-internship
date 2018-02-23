import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import notify from '~/components/global-notification';

import SportsTaskForm from './form';

import {
   createSportsTask,
} from '../../actions/validations';

const initialValues = {
  title: '',
  due_at: null,
  date: null,
  time: null,
  days: [],
  venue: null,
  facebook_announcement: false,
}

export default class CreateSportsTask extends React.Component {
  submission = (values, dispatch) => {
    return dispatch(createSportsTask(values.toJS())).then(resp => {
      this.props.queryFilteredMarketingTasks(this.props.filter);
    }).catch(resp => {
      let errors = resp.response.data.errors;

      if (errors) {
        if (errors.base) {
          errors._error = errors.base
        }

        if (errors.start_time) {
          errors.date = ["Start Date and time should be present"];
          errors.time = ["Start Date and time should be present"];
        }

        notify('Something went wrong while creating this task', {
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
      <SportsTaskForm
        submission={this.submission}
        initialValues={initialValues}
        venueOptions={ this.venueOptions() }
        actionValue="create"
      />
    )
  }
}
