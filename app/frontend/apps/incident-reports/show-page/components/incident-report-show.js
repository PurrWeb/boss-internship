import React from 'react';
import moment from 'moment';
import RotaDate from "~/lib/rota-date"
import oFetch from 'o-fetch';
import utils from "~/lib/utils";
import safeMoment from "~/lib/safe-moment";

export default function IncidentReportShow({incidentReport}) {
  function BoardItem({label, children}) {
    return (
      <li className="boss-report__summary-item">
        <div className="boss-report__summary-label boss-report__summary-label_size_medium">
          <p className="boss-report__summary-text">{label}</p>
        </div>
        <div className="boss-report__summary-value">
          {children}
        </div>
      </li>
    )
  }

  function renderBoard(report) {
    const sIncidentTime = oFetch(report, 'incidentTime');
    return (
      <div className="boss-report__group boss-report__group_role_board">
        <ul className="boss-report__summary">
          <BoardItem label="Date and Time of Incident">
            <p className="boss-report__summary-text boss-report__summary-text_role_time boss-report__summary-text_marked">
              { safeMoment.iso8601Parse(sIncidentTime).format(utils.commonDateFormatTimeOnly()) } {moment(new RotaDate({ shiftStartsAt: sIncidentTime }).getDateOfRota()).format(oFetch(utils, 'commonDateFormat'))}
            </p>
          </BoardItem>
          <BoardItem label="Exact Location of Incident">
            <p className="boss-report__summary-text boss-report__summary-text_role_location boss-report__summary-text_marked">
              {report.location}
            </p>
          </BoardItem>
          <BoardItem label="Short Description">
            <p className="boss-report__summary-text boss-report__summary-text_role_title boss-report__summary-text_marked">
              {report.description}
            </p>
          </BoardItem>
        </ul>
      </div>
    )
  }

  function RecordWrapper({title, text, html}) {
    return (
      <div className="boss-report__record">
        <h3 className="boss-report__subtitle">{title}</h3>
        { html
          ? <p className="boss-report__text" dangerouslySetInnerHTML={{__html: text}}></p>
          : <p className="boss-report__text">{text}</p>
        }
      </div>
    )
  }

  return (
    <div className="boss-page-main__group boss-page-main__group_adjust_ir-full">
      <div className="boss-report">
        {renderBoard(incidentReport)}
        <RecordWrapper title="Details of Witnesses not directly Involved in the Incident" html text={incidentReport.uninvolvedWitnessDetails} />
        <RecordWrapper title="Details of Witness Involved in the Incident" html text={incidentReport.involvedWitnessDetails} />
        <RecordWrapper title="Details of Police Officers in attendance" html text={incidentReport.policeOfficerDetails} />
        <RecordWrapper title="CCTV Recorded By" text={incidentReport.recordedByName} />
        <RecordWrapper title="Cameras Recorded Incident" text={incidentReport.cameraName} />
        <RecordWrapper title="Report" html text={incidentReport.report} />
      </div>
    </div>
  )
}
