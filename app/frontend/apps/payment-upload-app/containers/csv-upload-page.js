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
    uploadFilename: oFetch(uploadPageProps, 'uploadFilename'),
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
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <h1 className="boss-page-dashboard__title">CSV Upload</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">
          <div className="boss-page-main__group boss-page-main__group_adjust_csv-upload">
            <div className="boss-form">
              <div className="boss-form__field">
                <div className="boss-upload">
                  <div className="boss-upload__area">
                    { !uploadInProgress && <DropZone
                      className="boss-upload__area-inner"
                      accept={ VALID_FILE_TYPES }
                      maxSize={ MAX_FILE_SIZE }
                      onDropAccepted={ this.dropAccepted.bind(this) }
                      onDropRejected={ this.dropRejected.bind(this) }
                      ref={(node) => { this.dropZone = node; } } >
                        <p className="boss-upload__area-text">Click to select a csv file or drag it to upload</p>
                        <button type="button" className="boss-button boss-button_role_primary boss-upload__area-button">Choose File</button>
                    </DropZone> }
                    { uploadInProgress && <div className="boss-upload__area-inner">
                          <p className="boss-upload__area-text boss-upload__area-text_adjust_wrap">Uploading <span className="boss-upload__area-text-marked">{ oFetch(this.props, 'uploadFilename') }</span> ...</p>
                          <div className="boss-spinner boss-spinner_size_large boss-upload__area-spinner"></div>
                        </div> }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default CsvUploadPage;
