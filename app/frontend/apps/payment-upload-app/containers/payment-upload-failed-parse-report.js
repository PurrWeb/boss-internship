import React from 'react';
import oFetch from 'o-fetch';

class PaymentUploadFailedParseReport extends React.Component {
  constructor(props) {
    super(props);
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
                  return  <div key={`titleRowErrorKeys:${key}`} className="boss-report__record">
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
                            key: `headerRowWithError:${key}`,
                            errors: oFetch(headerRowErrors, key)
                          });
                        } else {
                          return this.renderHeaderRowWithoutError({key: `headerRowNoError:${key}`});
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
}

export default PaymentUploadFailedParseReport;
