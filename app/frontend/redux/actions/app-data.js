import * as backendData from "~lib/backend-data/process-backend-objects"
import getRotaFromDateAndVenue from "~lib/get-rota-from-date-and-venue"
import utils from "~lib/utils"
import _ from "underscore"
import {
    replaceWeeklyRotaForecast
} from "./rota-forecasts"
import {
    setPageOptions
} from "./misc"
import actionCreators from "./index"

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
            clockInStatuses: viewData.clock_in_statuses,
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
        dispatch(getInititalLoadActions(viewData));
    }
}

function getInititalLoadActions(initialLoadData){
    initialLoadData = {...initialLoadData}
    var possibleObjects = {
        "rotas": {
            processFunction: backendData.processRotaObject
        },
        "rotaForecasts": {
            processFunction: backendData.processRotaForecastObject
        },
        "weeklyRotaForecast": {
            replaceAction: replaceWeeklyRotaForecast,
            processFunction: backendData.processRotaForecastObject
        },
        "pageOptions": {
            replaceAction: actionCreators.setPageOptions,
            processFunction: backendData.processPageOptionsObject
        },
        "venues": {
            processFunction: backendData.processVenueObject
        },
        "clockInDays": {
            processFunction: backendData.processClockInDayObject
        },
        "staffMembers": {
            processFunction: backendData.processStaffMemberObject
        },
        "staffTypes": {
            processFunction: backendData.processStaffTypeObject
        },
        "shifts": {
            processFunction: backendData.processShiftObject
        },
        "clockInStatuses": {
            processFunction: backendData.processClockInStatusObject,
            indexBy: function(status){
                return status.staff_member.clientId;
            }
        },
        "holidays": {
            processFunction: backendData.processHolidayObject
        },
        "clockInPeriods": {
            processFunction: backendData.processClockInPeriodObject
        },
        "clockInEvents": {
            processFunction: backendData.processClockInEvent
        },
        "clockInNotes": {
            processFunction: backendData.processClockInNote
        },
        "clockInReasons": {
            processFunction: backendData.processClockInReason
        },
        "hoursAcceptancePeriods": {
            processFunction: backendData.processHoursAcceptancePeriodObject
        },
        "clockInBreaks": {
            processFunction: backendData.processClockInBreakObject
        },
        "hoursAcceptanceBreaks": {
            processFunction: backendData.processHoursAcceptanceBreakObject
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

            var replaceAction = objectDetails.replaceAction;
            if (replaceAction === undefined) {
                replaceAction = actionCreators["replaceAll" + utils.capitalize(objectName)]
            }
            actions.push(replaceAction({
                [objectName]: processedValue
            }))
        }
        delete initialLoadData[objectName];
    }

    var unprocessedDataKeys = _.keys(initialLoadData);
    if (unprocessedDataKeys.length > 0){
        throw Error("Unprocessed data keys: " + unprocessedDataKeys);
    }

    return actions;
}
