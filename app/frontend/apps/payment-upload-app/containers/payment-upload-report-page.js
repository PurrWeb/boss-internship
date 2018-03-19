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
      createdCount: oFetch(reportPageProps, 'createdCount'),
      skippedCount: oFetch(reportPageProps, 'skippedCount'),
      invalidPayments: oFetch(reportPageProps, 'invalidPayments'),
      validPayments: oFetch(reportPageProps, 'validPayments')
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

  render() {
    const resetApplication = oFetch(this.actions, 'resetApplication');
    const titleRowErrors = oFetch(this.props, 'titleRowErrors');
    const titleRowErrorKeys = Object.keys(titleRowErrors);
    const headerRowErrors = oFetch(this.props, 'headerRowErrors');
    const headerRowErrorKeys = Object.keys(headerRowErrors);
    const headerRowKeys = oFetch(this.props, 'headerRows');

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

        </div>
      </div>
    </div>;
  }
}

export default PaymentUploadReportPage;
