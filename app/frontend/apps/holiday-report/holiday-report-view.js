import React from "react"
import { connect } from "react-redux"
import utils from "~lib/utils"
import { appRoutes } from "~lib/routes"
import HolidayReportStaffFinder from "./holiday-report-staff-finder"
import WeekAndVenueSelector from "~components/week-and-venue-selector"

export default class HolidayReportView extends React.Component {
    render(){
        return <div>

            <div className="row">
                <div className="col-md-6">
                    <WeekAndVenueSelector
                        weekStartDate={new Date(this.props.pageOptions.weekStartDate)}
                        onChange={({startDate, endDate, venueClientId}) => {
                                var venue = this.props.venues[venueClientId];
                                var venueId;
                                if (venue !== undefined){
                                    venueId = venue.serverId;
                                }
                                location.href = appRoutes.holidays({
                                    date: startDate,
                                    venueId: venueId
                                })
                            }
                        }
                        venues={this.props.venues}
                        canSelectAllVenues={true}
                        venueClientId={this.props.pageOptions.venueClientId} />
                </div>
            </div>
            <hr/>
            { csvDownloadButton(this.props) }
            <h2 style={{fontSize: 20}}>Find Staff</h2>
            <HolidayReportStaffFinder />
        </div>
    }
}

function mapStateToProps(state){
    return {
        venues: state.venues,
        pageOptions: state.pageOptions,
        holidays: state.holidays
    }
}

function csvDownloadButton(props){
  let holidayCount = Object.keys(props.holidays).length;

  if (
      props.pageOptions.displayCsvLink &&
      props.pageOptions.weekStartDate  &&
      (holidayCount > 0)
    ) {
    return <a className="btn btn-default"
        style={{float: "right"}}
        href={appRoutes.holidaysCsv({
          date: props.pageOptions.weekStartDate,
          venueId: props.pageOptions.venueServerId
        })}>
        Download as CSV
    </a>;
  }
}

export default connect(mapStateToProps)(HolidayReportView)
