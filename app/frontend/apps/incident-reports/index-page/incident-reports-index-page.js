import React from 'react';
import { connect } from 'react-redux';

import IncidentReportsIndexDashboard from './components/incident-reports-index-dashboard';
import ContentWrapper from '../components/content-wrapper';
import AddIncidentReport from './components/add-incident-report';
import IncidentReportsList from './components/incident-reports-list';

const mapStateToProps = (state) => {
  return {
    addingNewReport: state.getIn(['page', 'addingNewReport']),
    incidentReports: state.getIn(['page', 'incidentReports']),
  };
}

@connect(mapStateToProps)
class IncidentReportsIndexPage extends React.PureComponent {

  render() {
    const {
      addingNewReport,
      incidentReports,
    } = this.props;
    return (
      <div>
        <IncidentReportsIndexDashboard
          title="Incident Reports"
        />
        <ContentWrapper>
          { addingNewReport 
              ? <AddIncidentReport />
              : <IncidentReportsList incidentReports={incidentReports.toJS()} />
          }
        </ContentWrapper>
      </div>
    )
  }
}

export default IncidentReportsIndexPage;
