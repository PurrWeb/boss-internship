import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import RichTextEditor from 'react-rte';
import notify from '~/components/global-notification';

import MessageBoardForm from './message-board-form';

import {
   createMessageBoard,
} from '../actions/validations';

const initialValues = {
  date: null,
  time: null,
  venueIds: null,
  description: '',
  toAllVenues: false,
  title: '',
  message: RichTextEditor.createEmptyValue(),
}

export default class CreateMessageBoard extends React.Component {
  submission(values, dispatch) {
    return dispatch(createMessageBoard(values.toJS())).catch(resp => {
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

  render() {
    return (
      <div className="boss-page-main__group boss-page-main__group_adjust_ir-form">
        <MessageBoardForm
          submission={this.submission}
          initialValues={initialValues}
          venueOptions={ this.venueOptions() }
        />
      </div>
    )
  }
}
