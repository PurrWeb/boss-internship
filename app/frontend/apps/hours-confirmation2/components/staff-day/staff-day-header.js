import React from "react"
import safeMoment from "~/lib/safe-moment";
import oFetch from "o-fetch";

export default class StaffDayHeader extends React.Component {
    dateSection() {
      if(this.props.displayDate){
        let dateString = safeMoment.iso8601Parse(this.props.rotaDate.startTime).format("dddd, DD MMM YYYY");
        return <p className="boss-hrc__date">
          <span className="boss-hrc__date-text">{dateString}</span>
        </p>
      }
    }

    venueSection(){
      if(this.props.displayVenue){
       let venueName = oFetch(this.props, 'venueName');
       return <p className="boss-hrc__venue">
          <span className="boss-hrc__venue-text">{venueName}</span>
        </p>;
      }
    }

    render(){
        let {
          status,
        } = this.props;

        return <div className="boss-hrc__header">
        <h3 className="boss-hrc__status">
          <span className="boss-hrc__status-text"> Status </span>
          <span className="boss-button boss-button_type_small boss-button_role_alert boss-hrc__status-label">
            {status}
          </span>
        </h3>
        { this.dateSection() }
        { this.venueSection() }
      </div>
    }
}
