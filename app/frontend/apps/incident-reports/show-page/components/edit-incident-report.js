import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import { fromJS } from 'immutable';
import RotaDate from "~/lib/rota-date.js";
import moment from 'moment';
import safeMoment from "~/lib/safe-moment";

import IncidentReportForm from '../../components/incident-report-form';

import {
  saveIncidentReport,
} from '../actions';


function parseHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

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
    involvedWitnessDetails: parseHTML(incidentReport.involvedWitnessDetails),
    recordedByName: incidentReport.recordedByName,
    cameraName: incidentReport.cameraName,
    report: parseHTML(incidentReport.report),
    uninvolvedWitnessDetails: parseHTML(incidentReport.uninvolvedWitnessDetails),
    policeOfficerDetails: parseHTML(incidentReport.policeOfficerDetails),
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
