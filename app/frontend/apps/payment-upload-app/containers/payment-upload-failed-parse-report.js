import React from 'react';
import oFetch from 'o-fetch';

class PaymentUploadFailedParseReport extends React.Component {
  constructor(props) {
    super(props);
  }

  renderHeaderRowWithoutError(params) {
    const reactKey = oFetch(params, 'reactKey');
    const header = oFetch(params, 'header');

    return (
      <div key={reactKey} className="boss-table__cell">
        <div className="boss-table__info">
          <p className="boss-table__text">{ header }</p>
        </div>
      </div>
    );
  }

  renderHeaderRowWithError(params) {
    const reactKey = oFetch(params, 'reactKey');
    const header = oFetch(params, 'header');
    const errors = Array(oFetch(params, 'errors'));

    return (
      <div key={reactKey} className="boss-table__cell boss-table__cell_state_alert js-popover-container">
        <div className="boss-table__info">
          <p className="boss-table__text boss-table__text_state_alert">{ header }</p>
        </div>

        <div className="boss-popover boss-popover_context_csv-upload-error js-popover">
          <a href="#" className="boss-popover__close js-popover-close">Close</a>
          <div className="boss-popover__inner">
            <p className="boss-popover__text boss-popover__text_role_primary">
              <span className="boss-popover__text-marked">{ header }</span>
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
                    <p className="boss-report__text boss-report__text_size_m">                          <b>{ _.capitalize(key) + ":\u00a0" }</b>
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
                            header: key,
                            reactKey: `headerRowWithError:${key}`,
                            errors: oFetch(headerRowErrors, key)
                          });
                        } else {
                          return this.renderHeaderRowWithoutError({
                            header: key,
                            reactKey: `headerRowNoError:${key}`
                          });
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
