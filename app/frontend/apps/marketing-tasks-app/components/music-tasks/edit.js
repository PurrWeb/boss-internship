import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import notify from '~/components/global-notification';

import MusicTaskForm from './form';
import safeMoment from '~/lib/safe-moment';

import {
   editMusicTask,
} from '../../actions/validations';

export default class EditMusicTask extends React.Component {
  initialValues() {
    let venue = this.venueOptions().find((v) => { return v.value == this.props.selectedMarketingTask.venue.id })

    return {
      id: this.props.selectedMarketingTask.id,
      title: this.props.selectedMarketingTask.title,
      venue: venue,
      due_at: safeMoment.parse(new Date(this.props.selectedMarketingTask.dueAt), 'DD-MM-YYYY'),
      days: this.props.selectedMarketingTask.days,
      facebook_announcement: this.props.selectedMarketingTask.facebookAnnouncement,
      date: safeMoment.parse(new Date(this.props.selectedMarketingTask.startTime), 'DD-MM-YYYY'),
      time: safeMoment.parse(new Date(this.props.selectedMarketingTask.startTime), 'HH:mm'),
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
    return dispatch(editMusicTask(values.toJS())).catch(resp => {
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
      <MusicTaskForm
        submission={ this.submission }
        initialValues={ this.initialValues() }
        venueOptions={ this.venueOptions() }
        actionValue={ this.actionValue() }
      />
    )
  }
}
