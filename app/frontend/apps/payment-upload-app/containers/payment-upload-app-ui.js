import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uploadFile } from '../actions';
import DropZone from 'react-dropzone';
import oFetch from 'o-fetch';
import notify from '~/components/global-notification';
import CsvUploadPage from "./csv-upload-page";
import PaymentUploadReportPage from './payment-upload-report-page';
import {
  UPLOAD_PAGE,
  REPORT_PAGE
} from '../constants';

const VALID_FILE_TYPES = '.csv';
const MAX_FILE_SIZE = 10000000; // 1MB

const mapStateToProps = (state) => {
  const stateJS = state.toJS();
  const globalProps = oFetch(stateJS, 'global');
  return {
    currentPage: oFetch(globalProps, 'currentPage')
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: []
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class PaymentUploadAppUI extends React.Component {
  constructor(props) {
    super(props);
    this.actions = oFetch(this.props, 'actions');
  }

  render() {
    const currentPage = oFetch(this.props, 'currentPage');
    return <div>
      { (currentPage === UPLOAD_PAGE) && <CsvUploadPage /> }
      { (currentPage === REPORT_PAGE) && <PaymentUploadReportPage /> }
    </div>;
  }
}

export default PaymentUploadAppUI;
