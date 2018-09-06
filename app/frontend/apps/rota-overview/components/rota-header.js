import React from 'react';
import utils from '~/lib/utils';
import safeMoment from "~/lib/safe-moment";

import {confirmation} from '~/lib/confirm-utils';
import actionCreators from "~/redux/actions";
import { connect } from "react-redux";

const ROTA_PUBLISHED_STATUS = "published"

class RotaHeader extends React.Component {
  constructor (props) {
    super(props);
  }

  onPublish = () => {
    confirmation(["Publishing a rota will send out email confirmations and can't be undone.", "Do you want to continue?"], {
      title: 'WARNING !!!',
    }).then(() => {
      this.props.publishRotaWeek();
    });
  }

  render() {
    const startDate = safeMoment.uiDateParse(utils.formatJSDateToUIDate(this.props.startDate)).format('Do MMMM YYYY');
    const endDate = safeMoment.uiDateParse(utils.formatJSDateToUIDate(this.props.endDate)).format('Do MMMM YYYY');
    const venueName = this.props.venue.name;
    var hasBeenPublished = this.props.rota.status === ROTA_PUBLISHED_STATUS;

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
                {this.props.publishingInProgress
                  ? <div className="boss-spinner"></div>
                  : hasBeenPublished ? null : <button type="button" onClick={this.onPublish} className="boss-button boss-button_role_publish boss-page-dashboard__button">Publish</button>
                }
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
    publishingInProgress: _.some(state.apiRequestsInProgress.PUBLISH_ROTAS),
  }
}

function mapDispatchToProps(dispatch, ownProps){
  return {
    publishRotaWeek: function(){
      dispatch(actionCreators().publishRotas({
        venueServerId: ownProps.rota.venue.serverId,
        date: ownProps.startDate
      }))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RotaHeader)
