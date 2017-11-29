import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import RichTextEditor from 'react-rte';
import notify from '~/components/global-notification';
import safeMoment from '~/lib/safe-moment';

import MessageBoardForm from './message-board-form';
import { updateMessageBoard } from '../actions/validations';

export default class UpdateMessageBoard extends React.Component {
  submission(values, dispatch) {
    return dispatch(updateMessageBoard(values.toJS())).catch(resp => {
      let errors = resp.response.data.errors;

      if (errors) {
        if (errors.base) {
          errors._error = errors.base
        }

        if (errors.publishedTime) {
          errors.date = ["Date and time should be present"];
          errors.time = ["Date and time should be present"];
        }

        notify('Something went wrong creating this message', {
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

  selectedVenueOptions() {
    let venue;

    return this.props.selectedMessage.venueIds.map((venueId) => {
      venue = this.props.venues.find((venue) => {
        return venue.id == venueId;
      })

      return { label: venue.name, value: venue.id + '' }
    });
  }

  initialValues() {
    let message = this.props.selectedMessage;

    return {
      id: message.id,
      date: safeMoment.parse(new Date(message.publishedTime), 'DD-MM-YYYY'),
      time: safeMoment.parse(new Date(message.publishedTime), 'HH:mm'),
      venueIds: this.selectedVenueOptions(),
      description: message.description,
      toAllVenues: message.toAllVenues,
      title: message.title,
      message: RichTextEditor.createValueFromString(message.message, 'html'),
    }
  }

  render() {
    return (
      <div className="boss-page-main__group boss-page-main__group_adjust_ir-form">
        <MessageBoardForm
          submission={this.submission}
          initialValues={ this.initialValues() }
          venueOptions={ this.venueOptions() }
          selectedValues={ this.selectedVenueOptions() }
        />
      </div>
    )
  }
}
