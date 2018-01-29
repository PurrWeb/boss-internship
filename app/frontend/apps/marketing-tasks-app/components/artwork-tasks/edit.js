import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import notify from '~/components/global-notification';

import ArtworkTaskForm from './form';
import safeMoment from '~/lib/safe-moment';

import {
   editArtworkTask,
} from '../../actions/validations';

export default class EditArtworkTask extends React.Component {
  initialValues() {
    let venue = this.venueOptions().find((v) => { return v.value == this.props.selectedMarketingTask.venue.id })

    return {
      id: this.props.selectedMarketingTask.id,
      title: this.props.selectedMarketingTask.title,
      description: this.props.selectedMarketingTask.description,
      size: this.props.selectedMarketingTask.size,
      height_cm: this.props.selectedMarketingTask.heightCm,
      width_cm: this.props.selectedMarketingTask.widthCm,
      due_at: safeMoment.parse(new Date(this.props.selectedMarketingTask.dueAt), 'DD-MM-YYYY'),
      venue: venue,
      facebook_cover_page: this.props.selectedMarketingTask.facebookCoverPage,
      facebook_booster: this.props.selectedMarketingTask.facebookBooster,
      facebook_announcement: this.props.selectedMarketingTask.facebookAnnouncement,
      print: this.props.selectedMarketingTask.print,
    }
  }

  submission = (values, dispatch) => {
    return dispatch(editArtworkTask(values.toJS())).catch(resp => {
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
      <ArtworkTaskForm
        submission={ this.submission }
        initialValues={ this.initialValues() }
        venueOptions={ this.venueOptions() }
        actionValue="edit"
      />
    )
  }
}
