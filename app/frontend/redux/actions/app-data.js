import * as backendData from "~lib/backend-data/process-backend-objects"
import getRotaFromDateAndVenue from "~lib/get-rota-from-date-and-venue"
import utils from "~lib/utils"
import {
    replaceWeeklyRotaForecast
} from "./rota-forecasts"
import {
    setPageOptions,
    genericReplaceAllItems
} from "./misc"

export function loadInitialRotaAppState(viewData) {
    var dayRota = getRotaFromDateAndVenue({
        rotas: [],
        dateOfRota: new Date(viewData.rotaDate),
        venueId: viewData.rotaVenueId,
        generateIfNotFound: true
    });
    var hasRotaInBackendData = dayRota.id !== null;
    if (!hasRotaInBackendData) {
        viewData.rota.rotas.push(dayRota);
    }

    var pageOptions = {
        venue: {id: viewData.rotaVenueId },
        dateOfRota: new Date(viewData.rotaDate),
        staffTypeSlug: viewData.staffTypeSlug,
        disableEditingShiftsByStaffTypeName: {
            "Security": true
        }
    };
    return genericLoadInitialRotaAppState(viewData, pageOptions);
}

export function loadInitalStaffTypeRotaAppState(viewData){
    viewData = {...viewData};
    viewData.rota = {...viewData.rota};
    var rotaOverview = viewData.rota;
    rotaOverview.rotas = viewData.rota.rotas.slice();

    // make sure we have a rota for each venue
    _.each(rotaOverview.venues, function(venue){
        var rota = getRotaFromDateAndVenue({
            rotas: viewData.rota.rotas,
            dateOfRota: new Date(rotaOverview.date),
            venueId: venue.id, // this simulates backendData, so use id instead of clientid/serverid
            generateIfNotFound: true
        });

        if (rota.id === null){
            // This rota didn't wasn't found and had to be generated
            rotaOverview.rotas.push(rota);
        }
    });

    var pageOptions = {
        staffTypeSlug: viewData.staffTypeSlug,
        dateOfRota: new Date(viewData.rota.date),
        pdfDownloadUrl: viewData.pdfDownloadUrl
    }
    return genericLoadInitialRotaAppState(viewData, pageOptions);
}

function genericLoadInitialRotaAppState(viewData, pageOptions){
    return function(dispatch){
        dispatch(getInititalLoadActions({
            pageOptions,
            rotas: viewData.rota.rotas,
            staffTypes: viewData.rota.staff_types,
            shifts: viewData.rota.rota_shifts,
            staffMembers: viewData.rota.staff_members,
            venues: viewData.rota.venues,
            holidays: viewData.rota.holidays
        }))
    }
}

export function loadInitialClockInOutAppState(viewData) {
    var pageOptions = {
        dateOfRota: viewData.page_data.rota_date,
        venue: {id: viewData.page_data.rota_venue_id}
    };

    return function(dispatch){
        dispatch(getInititalLoadActions({
            staffMembers: viewData.staff_members,
            staffTypes: viewData.staff_types,
            staffStatuses: viewData.clock_in_statuses,
            shifts: viewData.rota_shifts,
            rotas: viewData.rotas,
            venues: viewData.venues,
            pageOptions
        }));
    }
}

export function loadInitialRotaOverviewAppState(viewData){
    return function(dispatch) {
        dispatch(getInititalLoadActions({
            rotas: _.pluck(viewData.rotas, "rota"),
            venues: viewData.venues,
            rotaForecasts: viewData.rotaForecasts,
            weeklyRotaForecast: viewData.weeklyRotaForecast,
            pageOptions: {
                startDate: new Date(viewData.startDate),
                endDate: new Date(viewData.endDate)
            }
        }));
    }
}

export function loadInitialHoursConfirmationAppState(viewData){
    return function(dispatch){
        dispatch(getInititalLoadActions({
            venues: viewData.venues,
            pageOptions: {
                venue: {id: viewData.page_data.venue_id}
            },
            clockInDays: viewData.clock_in_days,
            staffMembers: viewData.staff_members,
            staffTypes: viewData.staff_types
        }))
    }
}

function getInititalLoadActions(initialLoadData){
    var possibleObjects = {
        "rotas": {
            replaceAction: genericReplaceAllItems,
            processFunction: backendData.processRotaObject
        },
        "rotaForecasts": {
            replaceAction: genericReplaceAllItems,
            processFunction: backendData.processRotaForecastObject
        },
        "weeklyRotaForecast": {
            replaceAction: replaceWeeklyRotaForecast,
            processFunction: backendData.processRotaForecastObject
        },
        "pageOptions": {
            replaceAction: setPageOptions,
            processFunction: backendData.processPageOptionsObject
        },
        "venues": {
            replaceAction: genericReplaceAllItems,
            processFunction: backendData.processVenueObject
        },
        "clockInDays": {
            replaceAction: genericReplaceAllItems,
            processFunction: backendData.processClockInDayObject
        },
        "staffMembers": {
            replaceAction: genericReplaceAllItems,
            processFunction: backendData.processStaffMemberObject
        },
        "staffTypes": {
            replaceAction: genericReplaceAllItems,
            processFunction: backendData.processStaffTypeObject
        },
        "shifts": {
            replaceAction: genericReplaceAllItems,
            processFunction: backendData.processShiftObject
        },
        "staffStatuses": {
            replaceAction: genericReplaceAllItems,
            processFunction: backendData.processStaffStatusObject,
            indexBy: function(status){
                return status.staff_member.clientId;
            }
        },
        "holidays": {
            replaceAction: genericReplaceAllItems,
            processFunction: backendData.processHolidayObject
        }
    }

    var actions = [];
    for (var objectName in possibleObjects) {
        var objectDetails = possibleObjects[objectName]
        let value = initialLoadData[objectName];
        if (value !== undefined) {
            let processedValue;
            if (_.isArray(value)){
                processedValue = value.map(objectDetails.processFunction);
            } else {
                processedValue = objectDetails.processFunction(value)
            }

            if (_.isArray(processedValue)) {
                if (objectDetails.indexBy) {
                    processedValue = _.indexBy(processedValue, objectDetails.indexBy)
                } else {
                    processedValue = utils.indexByClientId(processedValue)
                }
            }

            actions.push(objectDetails.replaceAction({
                [objectName]: processedValue
            }))
        }
    }

    return actions;
}
