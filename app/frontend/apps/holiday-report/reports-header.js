import React from "react"
import WeekAndVenueSelector from "~components/week-and-venue-selector"
import WeekPicker from "~components/week-picker"
import { appRoutes } from "~lib/routes"
import moment from "moment"

export default class ReportsHeader extends React.Component {
  componentDidMount() {
    let meta = $('.boss-page-dashboard__meta'),
        metaPopover = meta.find('.boss-popover'),
        metaPopoverLink = meta.find('.boss-page-dashboard__meta-item_role_popover');

    $('html').add($('.boss-popover__close')).on('click', function() {
      $('.boss-page-dashboard__meta-item_role_popover').removeClass('boss-page-dashboard__meta-item_state_opened');
      $('.boss-popover').fadeOut().removeClass('boss-popover_state_opened');
    });

    function togglePopover(e) {
      e.preventDefault();
      e.stopPropagation();
      let targetLinkId = $(this).data('popover');

      let targetPopover = metaPopover.filter(function() {
          return $(this).data('popover') === targetLinkId;
      });

      if (targetPopover.hasClass('boss-popover_state_opened')) {
        $('body').removeClass('boss-body_state_inactive');
        metaPopover.fadeOut().removeClass('boss-popover_state_opened');
        metaPopoverLink.removeClass('boss-page-dashboard__meta-item_state_opened');
      } else {
        metaPopoverLink.removeClass('boss-page-dashboard__meta-item_state_opened');
        metaPopover.fadeOut().removeClass('boss-popover_state_opened');
        targetPopover.fadeIn().addClass('boss-popover_state_opened');
        $(this).addClass('boss-page-dashboard__meta-item_state_opened');
      }
    }

    metaPopover.on('click', function(e) {e.stopPropagation();});
    metaPopoverLink.on('click', togglePopover);
  }

  csvDownloadButton(props) {
    let holidayCount = Object.keys(props.holidays).length;

    if (
        props.pageOptions.displayCsvLink &&
        props.pageOptions.weekStartDate  &&
        (holidayCount > 0)
      ) {
      return <a
          className="boss-button boss-button_role_csv-download boss-page-dashboard__button"
          href={appRoutes.holidaysCsv({
            date: props.pageOptions.weekStartDate,
            venueId: props.pageOptions.venueServerId
          })}>
          Download as CSV
      </a>;
    }
  }

  render() {
    let accessibleVenues = _.pick(this.props.venues, (venue, clientId) => {
      return this.props.pageOptions.accessibleVenueIds.includes(venue.serverId)
    });

    let today = moment(new Date(this.props.pageOptions.weekStartDate)).format("ddd D MMMM YYYY");
    let nextWeek = moment(new Date(this.props.pageOptions.weekStartDate)).add(6, 'days').format("ddd D MMMM YYYY");

    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated boss-page-dashboard_page_holidays-report">
            <h1 className="boss-page-dashboard__title">Holiday Reports</h1>

            <div className="boss-page-dashboard__group">
              <div className="boss-page-dashboard__meta">
                <p className="boss-page-dashboard__meta-item boss-page-dashboard__meta-item_type_faded boss-page-dashboard__meta-item_role_date boss-page-dashboard__meta-item_role_popover" data-popover="1">
                  <span className="boss-page-dashboard__meta-text">{ today }</span> -
                  <span className="boss-page-dashboard__meta-text">{ nextWeek }</span>
                </p>

                <div className="boss-popover boss-popover_context_dashboard-calendar" data-popover="1" style={{ display: 'none' }}>
                  <div className="boss-popover__inner">
                    <WeekPicker
                      selectionStartDate={new Date(this.props.pageOptions.weekStartDate)}
                      onChange={(selection) => {
                        let startDate = selection.startDate;
                        let endDate = selection.endDate;
                        let venueClientId = this.props.venueClientId;
                        let venue = accessibleVenues[venueClientId];
                        let venueId;

                        if (venue !== undefined){
                          venueId = venue.serverId;
                        }

                        location.href = appRoutes.holidays({
                          date: startDate,
                          venueId: venueId
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="boss-page-dashboard__buttons-group">
                { this.csvDownloadButton(this.props) }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
