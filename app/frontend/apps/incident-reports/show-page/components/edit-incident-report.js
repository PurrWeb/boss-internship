import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import { fromJS } from 'immutable';

import moment from 'moment';

import IncidentReportForm from '../../components/incident-report-form';

import {
  saveIncidentReport,
} from '../actions';

function EditIncidentReport({incidentReport}) {

  function setTime(time) {
    return {
      hour: moment(incidentReport.incidentTime).format('hh'),
      hour24: moment(incidentReport.incidentTime).hour(),
      minute: moment(incidentReport.incidentTime).minute(),
      formatted: moment(incidentReport.incidentTime).format('hh:mma'),
      formatted24: moment(incidentReport.incidentTime).format('HH:mm')
    };
  }

  const initialValues = {
    id: incidentReport.id,
    venueId: incidentReport.venueId,
    date: moment(incidentReport.incidentTime),
    time: setTime(incidentReport.incidentTime),
    location: incidentReport.location,
    description: incidentReport.description,
    involvedWitnessDetails: incidentReport.involvedWitnessDetails,
    recordedByName: incidentReport.recordedByName,
    cameraName: incidentReport.cameraName,
    report: incidentReport.report,
    uninvolvedWitnessDetails: incidentReport.uninvolvedWitnessDetails,
    policeOfficerDetails: incidentReport.policeOfficerDetails
  }

  function submission(values, dispatch) {
    return dispatch(saveIncidentReport(values.toJS()))
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

export default EditIncidentReport;
