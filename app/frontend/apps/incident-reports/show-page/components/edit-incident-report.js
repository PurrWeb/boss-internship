import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import { fromJS } from 'immutable';
import RichTextEditor from 'react-rte';
import RotaDate from "~/lib/rota-date.js";
import moment from 'moment';
import safeMoment from "~/lib/safe-moment";

import IncidentReportForm from '../../components/incident-report-form';

import {
  saveIncidentReport,
} from '../actions';

function EditIncidentReport({incidentReport}) {

  const initialValues = {
    id: incidentReport.id,
    venueId: incidentReport.venueId,
    date: moment(
      new RotaDate({ shiftStartsAt: incidentReport.incidentTime }).getDateOfRota()
    ),
    time: safeMoment.iso8601Parse(incidentReport.incidentTime),
    location: incidentReport.location,
    description: incidentReport.description,
    involvedWitnessDetails: RichTextEditor.createValueFromString(incidentReport.involvedWitnessDetails, 'html'),
    recordedByName: incidentReport.recordedByName,
    cameraName: incidentReport.cameraName,
    report: RichTextEditor.createValueFromString(incidentReport.report, 'html'),
    uninvolvedWitnessDetails: RichTextEditor.createValueFromString(incidentReport.uninvolvedWitnessDetails, 'html'),
    policeOfficerDetails: RichTextEditor.createValueFromString(incidentReport.policeOfficerDetails, 'html'),
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
