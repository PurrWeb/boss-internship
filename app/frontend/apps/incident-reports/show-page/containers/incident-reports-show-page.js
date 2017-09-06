import React from 'react';
import { connect } from 'react-redux';

import IncidentReportsShowDashboard from '../components/incident-reports-show-dashboard';
import ContentWrapper from '../../components/content-wrapper';
import EditIncidentReport from '../components/edit-incident-report';
import IncidentReportShow from '../components/incident-report-show';


const mapStateToProps = (state) => {
  return {
    editingReport: state.getIn(['page', 'editingReport']),
    incidentReport: state.getIn(['page', 'incidentReport']),
  };
}

@connect(mapStateToProps)
class IncidentReportsShowPage extends React.PureComponent {

  render() {
    const {
      editingReport,
      incidentReport,
    } = this.props;

    return (
      <div>
        <IncidentReportsShowDashboard
          title="Incident Reports"
          incidentReport={incidentReport.toJS()}
        />
        <ContentWrapper>
          { editingReport 
              ? <EditIncidentReport
                  incidentReport={incidentReport.toJS()}
                />
              : <IncidentReportShow
                  incidentReport={incidentReport.toJS()}
                />
          }
        </ContentWrapper>
      </div>
    )
  }
}

export default IncidentReportsShowPage;
