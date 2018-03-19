import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DropZone from 'react-dropzone';
import oFetch from 'o-fetch';
import notify from '~/components/global-notification';
import { uploadFile } from '../actions';

const VALID_FILE_TYPES = '.csv';
const MAX_FILE_SIZE = 10000000; // 1MB

const mapStateToProps = (state) => {
  const stateJS = state.toJS();
  const uploadPageProps = oFetch(stateJS, 'uploadPage');
  return {
    uploadInProgress: oFetch(uploadPageProps, 'uploadInProgress'),
    uploadErrors: oFetch(uploadPageProps, 'uploadInProgress')
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ uploadFile }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class CsvUploadPage extends React.Component {
  constructor(props) {
    super(props);
    this.actions = oFetch(this.props, 'actions');
  }

  dropRejected(files) {
    notify('File was not valid. Please ensure file have .csv extension and is under 1MB.', {
      interval: 5000,
      status: 'error'
    });
  }

  dropAccepted(files) {
    const file = oFetch(files, 0);
    oFetch(this.actions, 'uploadFile')({ file: file });
  }

  render() {
    const uploadInProgress = oFetch(this.props, 'uploadInProgress');

    return <div>
      <p>Drag file to upload</p>
      { !uploadInProgress && <DropZone
          accept={ VALID_FILE_TYPES }
          maxSize={ MAX_FILE_SIZE }
          onDropAccepted={ this.dropAccepted.bind(this) }
          onDropRejected={ this.dropRejected.bind(this) }
          ref={(node) => { this.dropZone = node; } }
        />}
    </div>;
  }
}

export default CsvUploadPage;
