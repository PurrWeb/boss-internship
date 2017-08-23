import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class RotaHeader extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    const startDate = moment(this.props.startDate).format('Do MMMM YYYY');
    const endDate = moment(this.props.endDate).format('Do MMMM YYYY');

    const date = `${startDate} - ${endDate}`;

    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated boss-page-dashboard_page_rotas-weekly">
            <h1 className="boss-page-dashboard__title">
              <span className="boss-page-dashboard__title-text boss-page-dashboard__title-text_marked"> </span>
              <span className="boss-page-dashboard__title-text"> Rotas </span>
            </h1>
            <div className="boss-page-dashboard__group">
              <div className="boss-page-dashboard__meta">
                <p className="boss-page-dashboard__meta-item boss-page-dashboard__meta-item_type_faded boss-page-dashboard__meta-item_role_date">
                  <span className="boss-page-dashboard__meta-text">{date}</span>
                </p>
              </div>
              <div className="boss-page-dashboard__buttons-group">
                <button type="button" className="boss-button boss-button_role_publish boss-page-dashboard__button">Publish</button>
                <a href={this.props.pdfHref} className="boss-button boss-button_role_pdf-download boss-page-dashboard__button">Download PDF</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

