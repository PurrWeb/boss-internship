import _ from 'underscore'
import React, { Component } from 'react'
import utils from "~lib/utils"
import { appRoutes } from "~lib/routes"
import { processBackendObject } from '~lib/backend-data/process-backend-object.js'
import WeekAndVenueSelector from "~components/week-and-venue-selector"

export default class ChangeOrderIndexApp extends Component {
  render(){
    let date = window.boss.pageData.date;
    let venues = _.map(window.boss.venues, function(venue){
      return processBackendObject(venue);
    });
    let venueId = _.find(
      venues, {serverId: window.boss.pageData.venueId}
    ).clientId;
    let venuesLookup = utils.indexByClientId(venues);

    return <WeekAndVenueSelector
      weekStartDate={ new Date(date) }
      onChange={({ startDate, endDate, venueClientId }) => {
              var venue = venuesLookup[venueClientId];
              var venueId;
              if (venue !== undefined){
                  venueId = venue.serverId;
              } else {
                throw new Error('Venue not found');
              }
              location.href = appRoutes.changeOrdersIndex({
                  date: startDate,
                  venueId: venueId
              })
          }
      }
      venues={ venuesLookup }
      canSelectAllVenues={ false }
      venueClientId={ venueId } />
  }
}
