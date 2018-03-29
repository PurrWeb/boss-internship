import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import oFetch from 'o-fetch';
import safeMoment from "~/lib/safe-moment"
import notify from '~/components/global-notification';
import numeral from 'numeral';
import PaymentUploadFailedParseReport from "./payment-upload-failed-parse-report";
import PaymentUploadProcessReport from './payment-upload-process-report';
import {
  REPORT_PAGE_PROCCESSED_MODE,
  REPORT_PAGE_PARSE_ERROR_MODE
} from '../constants';
import {
  resetApplication
} from '../actions';

const mapStateToProps = (state) => {
  const reportPageProps = oFetch(state.toJS(), 'reportPage');
  const mode = oFetch(reportPageProps, 'mode');

  if (mode === REPORT_PAGE_PROCCESSED_MODE) {
    return {
      mode: mode,
      createdPayments: oFetch(reportPageProps, 'createdPayments'),
      updatedPayments: oFetch(reportPageProps, 'updatedPayments'),
      skippedInvalidPayments: oFetch(reportPageProps, 'skippedInvalidPayments'),
      skippedExistingPayments: oFetch(reportPageProps, 'skippedExistingPayments')
    }
  } else if (mode === REPORT_PAGE_PARSE_ERROR_MODE) {
    return {
      mode: mode,
      headerRows: oFetch(reportPageProps, 'headerRows'),
      titleRowErrors: oFetch(reportPageProps, 'titleRowErrors'),
      headerRowErrors: oFetch(reportPageProps, 'headerRowErrors')
    }
  } else {
    throw new Error(`Unsupported page mode ${mode} encountered`)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ resetApplication }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class PaymentUploadReportPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const mode = oFetch(this.props, 'mode');
    const actions = oFetch(this.props, 'actions');
    const resetApplication = oFetch(actions, 'resetApplication');

    return <div>
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <h1 className="boss-page-dashboard__title">CSV Upload</h1>
              <div className="boss-page-dashboard__buttons-group">
                <button type="button" onClick={resetApplication} className="boss-button boss-button_role_reload boss-page-dashboard__button">Try Again</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">
          { (mode === REPORT_PAGE_PARSE_ERROR_MODE) && <PaymentUploadFailedParseReport headerRows={this.props.headerRows} titleRowErrors={this.props.titleRowErrors} headerRowErrors={this.props.headerRowErrors} /> }
          { (mode === REPORT_PAGE_PROCCESSED_MODE) && <PaymentUploadProcessReport createdPayments={this.props.createdPayments} updatedPayments={this.props.updatedPayments} skippedInvalidPayments={this.props.skippedInvalidPayments} skippedExistingPayments={this.props.skippedExistingPayments} /> }
        </div>
      </div>
    </div>;
  }
}

export default PaymentUploadReportPage;
