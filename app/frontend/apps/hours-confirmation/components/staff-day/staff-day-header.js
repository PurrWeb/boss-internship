import React from "react"
import moment from "moment"

export default class StaffDayHeader extends React.Component {

    dateSection() {
      if(this.props.displayDate){
        return moment(this.props.rotaDate.startTime).format("dddd, DD MMM YYYY");
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
        <p className="boss-hrc__date">
          <span className="boss-hrc__date-text">{this.dateSection()}</span>
        </p>
      </div>
    }
}