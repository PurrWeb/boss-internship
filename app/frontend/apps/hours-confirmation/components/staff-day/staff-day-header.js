import React from "react"
import moment from "moment"

export default class StaffDayHeader extends React.Component {
    venueNameSection() {
      if(this.props.displayVenue){
        return <span>{this.props.venueName} </span>;
      }
    }

    dateSection() {
      if(this.props.displayDate){
        return moment(this.props.rotaDate.startTime).format("DD MMM YYYY");
      }
    }

    render(){
        var {
          staffMember,
          rotaDate,
          rotaedHours,
          clockedHours,
          acceptedHours,
          rotaedAcceptedHoursDifference
        } = this.props;

        var getDifferenceMessage = function(rotaedAcceptedHoursDifference){
          let resultFragments = ["("];

          if (rotaedAcceptedHoursDifference == 0) {
            resultFragments.push(rotaedAcceptedHoursDifference + "h");
          } else if(rotaedAcceptedHoursDifference > 0) {
            resultFragments.push("+" + rotaedAcceptedHoursDifference + "h");
          } else {
            resultFragments.push("" + rotaedAcceptedHoursDifference + "h");
          }
          resultFragments.push(")");

          return resultFragments.join('');
        };

        var getDifferenceClass = function(rotaedAcceptedHoursDifference){
          let result = "";
          if( rotaedAcceptedHoursDifference > 0) {
            result = 'text-success';
          } else if( rotaedAcceptedHoursDifference < 0 ){
            result = "text-danger";
          }
          return result;
        };

        let differenceMessage = getDifferenceMessage(rotaedAcceptedHoursDifference);
        let differenceClass = getDifferenceClass(rotaedAcceptedHoursDifference);

        return <h2 style={{
                fontSize: 20,
                margin: 0,
                marginBottom: 10,
                borderBottom: "1px solid #eee",
                paddingBottom: 5
            }}>
            <div style={{display: "inline-block"}}>
                {staffMember.first_name} {staffMember.surname}
            </div>
            <div style={{
                display: "inline-block",
                fontWeight: "normal",
                marginLeft: 4,
                color: "#999",
                fontSize: 16
            }}>
                {rotaedHours}h rotaed, {clockedHours}h clocked, {acceptedHours}h accepted <span className={ differenceClass }>{differenceMessage}</span>
            </div>
            <div style={{float: "right"}}>
                { this.venueNameSection() }{ this.dateSection() }
            </div>
        </h2>
    }
}
