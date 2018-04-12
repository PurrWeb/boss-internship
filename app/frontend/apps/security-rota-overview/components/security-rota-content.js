import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SecurityRotaContent extends Component {
  renderLoader() {
    return (
      <div className="boss-rotas__days-item">
        <section className="boss-board">
          <div className="boss-spinner" />
        </section>
      </div>
    );
  }

  render() {
    const {
      isLoading,
      rotaWeekDaysRenderer,
      leftSideRenderer,
      rightSideRenderer,
      rotaEditUrlDate,
      rotaDate,
      rotaShiftsLength,
    } = this.props;
    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">
          <div className="boss-rotas">
            <div className="boss-rotas__days">
              {rotaWeekDaysRenderer()}
              {isLoading ? (
                this.renderLoader()
              ) : (
                <div className="boss-rotas__days-item">
                  <section className="boss-board">
                    <header
                      key="header"
                      className="boss-board__header boss-board__header_adjust_rotas-weekly"
                    >
                      <h2 className="boss-board__title boss-board__title_size_small">
                        <a
                          href={`security_rotas/${rotaEditUrlDate}`}
                          className="boss-board__title-link boss-board__title-link_role_date"
                        >
                          &nbsp;{rotaDate}&nbsp;
                        </a>
                      </h2>
                    </header>
                    <div key="content" className="boss-board__main">
                      {rotaShiftsLength === 0 ? (
                        <div className="boss-board__main-inner">
                          <p className="boss-board__text-placeholder">
                            No Data Available.
                          </p>
                        </div>
                      ) : (
                        <div className="boss-board__rota">
                          <div className="boss-board__graph">
                            <div className="boss-board__graph-inner">
                              <div className="rota-overview-chart">
                                <div className="rota-overview-chart__inner">
                                  {leftSideRenderer()}
                                </div>
                              </div>
                            </div>
                          </div>
                          {rightSideRenderer()}
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SecurityRotaContent.propTypes = {
  rotaWeekDaysRenderer: PropTypes.func.isRequired,
  leftSideRenderer: PropTypes.func.isRequired,
  rightSideRenderer: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  rotaEditUrlDate: PropTypes.string.isRequired,
  rotaDate: PropTypes.string.isRequired,
  rotaShiftsLength: PropTypes.number.isRequired,
};

export default SecurityRotaContent;
