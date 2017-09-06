import React from 'react';
import { Field, Fields, reduxForm, SubmissionError } from 'redux-form/immutable';
import DatePicker from 'react-datepicker';
import { fromJS, Map, List } from 'immutable';
import moment from 'moment';

import {
  InputInlineField,
  TextareaField,
  InputField,
  DateTimeField,
} from './form-fields';

function IncidentReportForm({
  handleSubmit,
  submitting,
  submission,
}) {

  const check24Time = ({hour, minute}) => {
    return moment().hour(hour).minute(minute).format('HH:mm');
  }

  const timeDefaultFormat = (value) => {
    if (!value) return;
    if (Map.isMap(value)) {
      return check24Time({hour: value.get('hour24'), minute: value.get('minute')});
    }
    return check24Time({hour: value.hour24, minute: value.minute});
  }

  return (
    <form onSubmit={handleSubmit(submission)} className="boss-form">
      <div className="boss-form__group boss-form__group_role_board">
        <Fields
          names={['date', 'time']}
          label="Date and Time of Incident"
          format={(value, name) => name === 'time' ? timeDefaultFormat(value) : value }
          component={DateTimeField}
        />
        <Field
          name="location"
          label="Exact Location of Incident"
          component={InputInlineField}
        />
        <Field
          name="description"
          label="Short Description"
          component={InputInlineField}
        />
      </div>
      <Field
        name="uninvolvedWitnessDetails"
        label="Details of Staff Involved"
        note="(Please include Name, Phone number, and Badge number if applicable)"
        component={TextareaField}
      />
      <Field
        name="involvedWitnessDetails"
        label="Details of Witnesses Involved"
        note="(Please include Name, Phone number, and Badge number if applicable)"
        component={TextareaField}
      />
      <Field
        name="policeOfficerDetails"
        label="Details of Police Officers in attendance"
        note="(Please include Name, Rank, and Collar number if applicable)"
        component={TextareaField}
      />
      <Field
        name="recordedByName"
        label="CCTV Recorded By"
        component={InputField}
      />
      <Field
        name="cameraName"
        label="Cameras Recorded Incident"
        component={InputField}
      />
      <Field
        name="report"
        label="Report"
        component={TextareaField}
      />
      <div className="boss-form__field boss-form__field_justify_end-center">
        <button
          type="submit"
          disabled={submitting}
          className="boss-button boss-form__submit"
        >Save</button>
      </div>
    </form>
  )
};

export default reduxForm({
  form: 'incident-report-form',
  fields: ['id', 'venueId', 'incidentTime']
})(IncidentReportForm);
