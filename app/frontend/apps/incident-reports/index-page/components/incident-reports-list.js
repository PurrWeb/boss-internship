import React from 'react';
import utils from "~/lib/utils";
import safeMoment from "~/lib/safe-moment";

export default function IncidentReportsList({incidentReports}) {

  const ReportRow = ({children}) => {
    return (
      <div className="boss-check__row">
        <div className="boss-check__cell">
          {children}
        </div>
      </div>
    )
  }

  const renderReport = (report, index) => {

    const incidentTime = safeMoment.iso8601Parse(report.incidentTime).format(utils.humanDateFormatWithTime());

    return (
      <div key={index} className="boss-check boss-check_role_board">
        <ReportRow>
          <p className="boss-check__title">{report.description}</p>
        </ReportRow>
        <ReportRow>
          <p className="boss-check__text boss-check__text_role_location">{report.location}</p>
        </ReportRow>
        <ReportRow>
          <p className="boss-check__text boss-check__text_role_time">{incidentTime}</p>
        </ReportRow>
        <ReportRow>
          <p className="boss-check__text boss-check__text_role_user">{report.creator.name}</p>
        </ReportRow>
        <ReportRow>
          <a
            href={`/incident_reports/${report.id}`}
            className="boss-button boss-button_role_view-report boss-table__action"
          >View Report</a>
        </ReportRow>
      </div>
    )
  }

  const renderReports = (reports) => {
    return reports.map((report, index) => {
      return renderReport(report, index);
    })
  }

  return (
    <div>
      { renderReports(incidentReports) }
    </div>
  )
}
