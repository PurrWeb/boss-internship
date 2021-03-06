import * as backendData from "~/lib/backend-data/process-backend-objects"
import getRotaFromDateAndVenue from "~/lib/get-rota-from-date-and-venue"
import utils from "~/lib/utils"
import _ from "underscore"
import {
    replaceWeeklyRotaForecast,
    replaceRotaWeeklyDay,
} from "./rota-forecasts"
import {
    setPageOptions
} from "./page-options"

var getActionCreators = function(){
    throw Error("getActionCreators called before setGetActionCreators was called")
}

export function setGetActionCreators(fn){
    getActionCreators = fn;
}

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
            rotaShifts: viewData.rota.rota_shifts,
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
            clockInDays: viewData.clock_in_days,
            rotaShifts: viewData.rota_shifts,
            rotas: viewData.rotas,
            venues: viewData.venues,
            pageOptions
        }));
    }
}

export function loadInitialRotaOverviewAppState(viewData){
    return function(dispatch) {
        dispatch(getInititalLoadActions({
            rotaWeeklyDay: viewData.rotaWeeklyDay,
            // rotas: viewData.rotaWeeklyDay.rota,
            venues: viewData.venues,
            // rotaForecasts: viewData.rotaForecast,
            weeklyRotaForecast: viewData.weeklyRotaForecast,
            venue: viewData.venue,
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

export function loadInitialStaffHoursOverviewAppState(viewData){
    return function(dispatch){
        dispatch(getInititalLoadActions(viewData));
    }
}

function getInititalLoadActions(initialLoadData){
    initialLoadData = {...initialLoadData}
    var actionCreators = getActionCreators();
    var speciallyHandledObjects = {
        "weeklyRotaForecast": {
            replaceAction: replaceWeeklyRotaForecast,
            processFunction: backendData.processRotaForecastObject
        },
        "rotaWeeklyDay": {
          replaceAction: replaceRotaWeeklyDay,
          processFunction: backendData.processVenueRotaOverviewObject
        },
        "pageOptions": {
            replaceAction: actionCreators.setPageOptions,
            processFunction: backendData.processPageOptionsObject
        }
    }

    var actions = [];

    for (var objectName in initialLoadData) {
        if (objectName === "access_token" || objectName === "venue") {
            // Is used a global rather than being put in the store
            continue;
        }
        let value = initialLoadData[objectName];

        var objectDetails = speciallyHandledObjects[objectName]
        if (!objectDetails) {
            objectDetails = {};
        }

        var processFunction = objectDetails.processFunction;
        if (!processFunction) {
            var defaultProcessFunctionName = "process" +
                utils.getStringExceptLastCharacter(utils.capitalize(objectName)) + "Object"
            processFunction = backendData[defaultProcessFunctionName]
            if (!processFunction) {
                throw Error(`No processing function found for object
                    ${objectName} (looked for function named ${defaultProcessFunctionName})`);
            }
        }

        let processedValue;
        if (_.isArray(value)){
            processedValue = value.map(processFunction);
        } else {
            processedValue = processFunction(value)
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

    return actions;
}
