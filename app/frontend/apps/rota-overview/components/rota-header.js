import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import confirm from '~/lib/confirm-utils';
import actionCreators from "~/redux/actions";
import { connect } from "react-redux";

class RotaHeader extends React.Component {
  constructor (props) {
    super(props);
  }

  onPublish = () => {
    confirm("Publishing a rota will send out email confirmations and can't be undone. Do you want to continue?", {
      title: 'WARNING !!!',
      actionButtonText: 'Publish',
    }).then(() => {
      this.props.publishRotaWeek();
    });
  }

  render() {
    const startDate = moment(this.props.startDate).format('Do MMMM YYYY');
    const endDate = moment(this.props.endDate).format('Do MMMM YYYY');
    const venueName = this.props.venue.name;

    const date = `${startDate} - ${endDate}`;

    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated boss-page-dashboard_page_rotas-weekly">
            <h1 className="boss-page-dashboard__title">
              <span className="boss-page-dashboard__title-text boss-page-dashboard__title-text_marked">{venueName} &nbsp; </span>
              <span className="boss-page-dashboard__title-text"> Rotas </span>
            </h1>
            <div className="boss-page-dashboard__group">
              <div className="boss-page-dashboard__meta">
                <p className="boss-page-dashboard__meta-item boss-page-dashboard__meta-item_type_faded boss-page-dashboard__meta-item_role_date">
                  <span className="boss-page-dashboard__meta-text">{date}</span>
                </p>
              </div>
              <div className="boss-page-dashboard__buttons-group">
                <button type="button" onClick={this.onPublish} className="boss-button boss-button_role_publish boss-page-dashboard__button">Publish</button>
                <a href={this.props.pdfHref} className="boss-button boss-button_role_pdf-download boss-page-dashboard__button">Download PDF</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state){
  return {
    publishingInProgress: _.some(state.apiRequestsInProgress.PUBLISH_ROTAS)
  }
}

function mapDispatchToProps(dispatch, ownProps){
  return {
    publishRotaWeek: function(){
      dispatch(actionCreators.publishRotas({
        venueServerId: ownProps.venue.venueServerId,
        date: ownProps.startDate
      }))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RotaHeader)
