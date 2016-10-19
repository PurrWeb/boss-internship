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
                <div className="shrink column">
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
            <div className="row">
                <div className="column"><h2 style={{fontSize: 20}}>Find Staff</h2></div>
                <div className="shrink column">{ csvDownloadButton(this.props) }</div>
            </div>
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
    return <a
        className="button"
        href={appRoutes.holidaysCsv({
          date: props.pageOptions.weekStartDate,
          venueId: props.pageOptions.venueServerId
        })}>
        Download as CSV
    </a>;
  }
}

export default connect(mapStateToProps)(HolidayReportView)
