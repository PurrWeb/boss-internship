import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import oFetch from 'o-fetch';
import notify from '~/components/global-notification';
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
    this.actions = oFetch(this.props, 'actions');
  }

  renderHeaderRowWithoutError(params) {
    const key = oFetch(params, 'key');

    return (
      <div key={key} className="boss-table__cell">
        <div className="boss-table__info">
          <p className="boss-table__text">{ key }</p>
        </div>
      </div>
    );
  }

  renderHeaderRowWithError(params) {
    const key = oFetch(params, 'key');
    const errors = Array(oFetch(params, 'errors'));

    return (
      <div key={key} className="boss-table__cell boss-table__cell_state_alert js-popover-container">
        <div className="boss-table__info">
          <p className="boss-table__text boss-table__text_state_alert">{key}</p>
        </div>

        <div className="boss-popover boss-popover_context_csv-upload-error js-popover">
          <a href="#" className="boss-popover__close js-popover-close">Close</a>
          <div className="boss-popover__inner">
            <p className="boss-popover__text boss-popover__text_role_primary">
              <span className="boss-popover__text-marked">{ key }</span>
              <span>{ errors.join(", ") }</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  renderFailedParse() {
    const titleRowErrors = oFetch(this.props, 'titleRowErrors');
    const titleRowErrorKeys = Object.keys(titleRowErrors);
    const headerRowErrors = oFetch(this.props, 'headerRowErrors');
    const headerRowErrorKeys = Object.keys(headerRowErrors);
    const headerRowKeys = oFetch(this.props, 'headerRows');

    return <div>
      { (oFetch(titleRowErrorKeys, 'length') > 0) && <section className="boss-board boss-board_context_stack">
        <header className="boss-board__header">
          <h2 className="boss-board__title boss-board__title_role_errors boss-board__title_size_medium">Title row format is incorrect</h2>
        </header>
        <div className="boss-board__inner">
          <div className="boss-board__group">
            <div className="boss-report">
              { titleRowErrorKeys.map((key, index) => {
                  const errors = oFetch(titleRowErrors, key);
                  return  <div key={key} className="boss-report__record">
                    <p className="boss-report__text boss-report__text_size_m">                          <b>{ _.capitalize(key) }</b>
                      <span>{ errors.join(", ") }</span>
                    </p>
                  </div>;
                })
              }
            </div>
          </div>
        </div>
      </section> }

      { (oFetch(headerRowErrorKeys, 'length') > 0) && <section className="boss-board boss-board_context_stack">
        <header className="boss-board__header">
          <h2 className="boss-board__title boss-board__title_role_errors boss-board__title_size_medium">Header row format is incorrect</h2>
        </header>
        <div className="boss-board__inner">
          <div className="boss-board__group">
            <div className="boss-report__record">
              <div className="boss-report__table">
                <div className="boss-table boss-table_page_csv-upload">
                  <div className="boss-table__row boss-table__row_state_alert">
                    { headerRowKeys.map((key) => {
                        if (_.includes(headerRowErrorKeys, key)) {
                          return this.renderHeaderRowWithError({
                            key: key,
                            errors: oFetch(headerRowErrors, key)
                          });
                        } else {
                          return this.renderHeaderRowWithoutError({key: key});
                        }
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> }
    </div>;
  }

  renderErrorSection(params) {
    const key = oFetch(params, 'key');
    const title = oFetch(params, 'title')
    const records = oFetch(params, 'records');
    const recordCount = oFetch(records, 'length');

    return <section key={key} className="boss-board boss-board_context_stack">
      <header className="boss-board__header">
        <div className="boss-indicator boss-indicator_status_error boss-board__indicator">
          <span className="boss-indicator__marker">{recordCount}</span>
        </div>
        <h2 className="boss-board__title boss-board__title_size_medium">{title}</h2>
        <div className="boss-board__button-group">
          <button type="button" className="boss-board__switch boss-board__switch_state_opened"></button>
        </div>
      </header>

      <div className="boss-board__content boss-board__content_state_opened" style={ {style: 'block'} }>
        <div className="boss-board__content-inner">
          <div className="boss-board__group">
            { (recordCount === 0) && <p className="boss-board__text-placeholder">Nothing to display</p> }
            { (recordCount !== 0) && this.renderErrorReport({records: records}) }
          </div>
        </div>
      </div>
    </section>;
  }

  renderErrorReport(params) {
    const records = oFetch(params, 'records');

    return <div className="boss-report">
      <p className="boss-report__text boss-report__text_size_m boss-report__text_adjust_wrap">Couldn't read<span className="boss-report__text-marked">CurrentPay.RndNetPay</span></p>
      <div className="boss-report__table">
        <div className="boss-table boss-table_page_csv-upload">
          <div className="boss-table__row boss-table__row_role_header">
            <div className="boss-table__cell boss-table__cell_role_header">DateParameters.ProcessDate</div>
            <div className="boss-table__cell boss-table__cell_role_header">CompanyDetails.Name</div>

          </div>

          <div className="boss-table__row boss-table__row_state_alert">
            <div className="boss-table__cell">
              <div className="boss-table__info">
                <p className="boss-table__label">DateParameters.ProcessDate</p>
                <p className="boss-table__text">28/01/2018</p>
              </div>
            </div>

            <div className="boss-table__cell boss-table__cell_state_alert js-popover-container" data-popover="2">
              <div className="boss-table__info">
                <p className="boss-table__label boss-table__label_state_alert">CompanyDetails.Name</p>
                <p className="boss-table__text boss-table__text_state_alert">Test</p>
              </div>

              <div className="boss-popover boss-popover_context_csv-upload-error js-popover" data-popover="2">
                <a href="#" className="boss-popover__close js-popover-close">Close</a>
                <div className="boss-popover__inner">
                  <p className="boss-popover__text boss-popover__text_role_primary boss-popover__text_adjust_wrap"><span className="boss-popover__text-marked">CompanyDetails.Name</span> did not match any venues in the system</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }

  renderProcessed() {
    const createdPayments = oFetch(this.props, 'createdPayments');
    const updatedPayments = oFetch(this.props, 'updatedPayments');
    const skippedInvalidPayments = oFetch(this.props, 'skippedInvalidPayments');
    const skippedExistingPayments = oFetch(this.props, 'skippedExistingPayments');
    const createdPaymentCount = oFetch(createdPayments, 'length');
    const updatedPaymentCount = oFetch(updatedPayments, 'length');
    const skippedInvalidPaymentCount = oFetch(skippedInvalidPayments, 'length');
    const skippedExistingPaymentCount = oFetch(skippedExistingPayments, 'length');

    return <div>
      <section key={0} className="boss-board boss-board_context_stack">
        <header className="boss-board__header">
          <div className="boss-indicator boss-indicator_status_success boss-board__indicator">
            <span className="boss-indicator__marker">{createdPaymentCount}</span>
          </div>
            <h2 className="boss-board__title boss-board__title_size_medium">Created Successfully</h2>
          <div className="boss-board__button-group">
            <button type="button" className="boss-board__switch boss-board__switch_state_opened"></button>
          </div>
        </header>

        <div className="boss-board__content boss-board__content_state_opened" style={ {display: 'block'} }>
          <div className="boss-board__content-inner">
            { (createdPaymentCount == 0) && <div className="boss-board__group">
                <p className="boss-board__text-placeholder">Nothing to display</p>
              </div> }
          </div>
        </div>
      </section>

      <section key={1} className="boss-board boss-board_context_stack">
        <header className="boss-board__header">
          <div className="boss-indicator boss-indicator_status_success boss-board__indicator">
            <span className="boss-indicator__marker">{updatedPaymentCount}</span>
          </div>
          <h2 className="boss-board__title boss-board__title_size_medium">Updated</h2>
          <div className="boss-board__button-group">
            <button type="button" className="boss-board__switch boss-board__switch_state_opened"></button>
          </div>
        </header>

        <div className="boss-board__content boss-board__content_state_opened" style={ {display: 'block'} }>
          <div className="boss-board__content-inner">
            { (updatedPaymentCount == 0) && <div className="boss-board__group">
                <p className="boss-board__text-placeholder">Nothing to display</p>
              </div> }
          </div>
        </div>
      </section>

     { this.renderErrorSection({
        key: 2,
        title: 'Skipped because data invalid',
        records: skippedInvalidPayments
       }) }

      { this.renderErrorSection({
          key: 3,
          title: 'Skipped because already exists',
          records: skippedExistingPayments
        }) }
    </div>;
  }

  render() {
    const mode = oFetch(this.props, 'mode');
    const resetApplication = oFetch(this.actions, 'resetApplication');

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
          { (mode === REPORT_PAGE_PARSE_ERROR_MODE) && this.renderFailedParse() }
          { (mode === REPORT_PAGE_PROCCESSED_MODE) && this.renderProcessed() }
        </div>
      </div>
    </div>;
  }
}

export default PaymentUploadReportPage;
