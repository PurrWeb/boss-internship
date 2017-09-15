import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import RichTextEditor from 'react-rte';
import moment from 'moment';

import IncidentReportForm from '../../components/incident-report-form';

import {
   createIncidentReport,
} from '../actions';

function AddIncidentReport() {
  const initialValues = {
    date: null,
    time: null,
    location: '',
    description: '',
    involvedWitnessDetails: RichTextEditor.createEmptyValue(),
    recordedByName: '',
    cameraName: '',
    report: RichTextEditor.createEmptyValue(),
    uninvolvedWitnessDetails: RichTextEditor.createEmptyValue(),
    policeOfficerDetails: RichTextEditor.createEmptyValue()
  }

  function submission(values, dispatch) {
    return dispatch(createIncidentReport(values.toJS()))
      .catch(resp => {
        let errors = resp.response.data.errors;
        if (errors) {
          if (errors.base) {
            errors._error = errors.base
          }

          if (errors.incidentTime) {
            errors.date = ["Date and time should be present"];
            errors.time = ["Date and time should be present"];
          }

          throw new SubmissionError({...errors});
        }
      })
  }
  
  return (
    <div className="boss-page-main__group boss-page-main__group_adjust_ir-form">
      <IncidentReportForm
        submission={submission}
        initialValues={initialValues}
      />
    </div>
  )
}

export default AddIncidentReport;