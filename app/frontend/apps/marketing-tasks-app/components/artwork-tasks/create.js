import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import notify from '~/components/global-notification';

import ArtworkTaskForm from './form';

import {
   createArtworkTask,
} from '../../actions/validations';

const initialValues = {
  title: '',
  description: '',
  size: null,
  height_cm: null,
  width_cm: null,
  due_at: null,
  venue: null,
  facebook_cover_page: false,
  facebook_booster: false,
  facebook_announcement: false,
  print: false,
  quantity: 0
}

export default class CreateArtworkTask extends React.Component {
  submission = (values, dispatch) => {
    return dispatch(createArtworkTask(values.toJS())).then(resp => {
      this.props.queryFilteredMarketingTasks(this.props.filter);
    }).catch(resp => {
      let errors = resp.response.data.errors;

      if (errors) {
        if (errors.base) {
          errors._error = errors.base
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
      <ArtworkTaskForm
        submission={this.submission}
        initialValues={initialValues}
        venueOptions={ this.venueOptions() }
        actionValue="create"
      />
    )
  }
}
