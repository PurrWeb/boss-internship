import React from 'react';
import PropTypes from 'prop-types';

export default class RotaCurrentDay extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div className="boss-rotas__days-item">
        <section className="boss-board">
          <header className="boss-board__header boss-board__header_adjust_rotas-weekly">
            <h2 className="boss-board__title boss-board__title_size_small">
              <p className="boss-board__title-link boss-board__title-link_role_date"> Monday, 14 November 2016 </p>
              <p className="boss-button boss-button_type_small boss-button_role_edit-light boss-board__title-action"> Edit </p>
            </h2>
            <div className="boss-board__button-group">
              <p className="boss-button boss-button_role_published boss-button_type_small boss-button_type_no-behavior boss-board__button">
                Published
              </p>
            </div>
          </header>
          <div className="boss-board__main">
            <div className="boss-board__rota">
              <div className="boss-board__graph">
                <div className="boss-board__graph-inner">
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

