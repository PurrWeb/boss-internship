import React from "react"
import moment from "moment"

export default class StaffDayHeader extends React.Component {

    dateSection() {
      if(this.props.displayDate){
        return moment(this.props.rotaDate.startTime).format("DD MMM YYYY");
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


// return <h2 style={{
//         fontSize: 20,
//         margin: 0,
//         marginBottom: 10,
//         borderBottom: "1px solid #eee",
//         paddingBottom: 5
//     }}>
//     <div style={{display: "inline-block"}}>
//         {staffMember.first_name} {staffMember.surname}
//     </div>
//     <div style={{
//         display: "inline-block",
//         fontWeight: "normal",
//         marginLeft: 4,
//         color: "#999",
//         fontSize: 16
//     }}>
//         {rotaedHours}h rotaed, {clockedHours}h clocked, {acceptedHours}h accepted <span className={ differenceClass }>{differenceMessage}</span>
//     </div>
//     <div style={{float: "right"}}>
//         { this.venueNameSection() }{ this.dateSection() }
//     </div>
// </h2>