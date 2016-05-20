import createApiRequestAction, { registeredApiRequestActionCreators} from "./create-api-request-action"
import _ from "underscore"
import actionTypes from "./actions/action-types"
import moment from "moment"
import utils from "~lib/utils"
import * as backendData from "~lib/backend-data/process-backend-objects"
import makeApiRequestMaker from "./make-api-request"
import {apiRoutes} from "~lib/routes"
import oFetch from "o-fetch"
import RotaDate from "~lib/rota-date"
import getRotaFromDateAndVenue from "~lib/get-rota-from-date-and-venue"
import { showConfirmationModal, cancelConfirmationModal, completeConfirmationModal } from "./actions/confirmation-modal"
import { addRotaShift, updateRotaShift, deleteRotaShift } from "./actions/shifts"
import { selectClockInOutAppIsInManagerMode } from "~redux/selectors"
import { clockInOutAppEnterUserMode, updateStaffStatus, enterUserModeWithConfirmation, clockInOutAppSelectStaffType } from "./actions/clocking-actions"
import { showUserActionConfirmationMessage, hideUserActionConfirmationMessage} from "./actions/user-action-confirmation-messages"


export { showConfirmationModal, cancelConfirmationModal, completeConfirmationModal};
export { addRotaShift, updateRotaShift, deleteRotaShift }
export { clockInOutAppEnterUserMode, updateStaffStatus, clockInOutAppSelectStaffType, enterUserModeWithConfirmation }
export { showUserActionConfirmationMessage, hideUserActionConfirmationMessage}



export const updateRotaForecast = createApiRequestAction({
    requestType: "UPDATE_ROTA_FORECAST",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.updateRotaForecast.method,
        path: (options) => {
            var [dateOfRota, serverVenueId] = oFetch(options, "dateOfRota", "serverVenueId");
            return apiRoutes.updateRotaForecast.getPath({dateOfRota, venueId: serverVenueId})
        },
        data: ({forecastedTake}) => {return {forecasted_take: forecastedTake} },
        getSuccessActionData: function(responseData){
            return {
                rotaForecast: backendData.processRotaForecastObject(responseData)
            }
        }
    })
});

export const fetchWeeklyRotaForecast = createApiRequestAction({
    requestType: "FETCH_WEEKLY_ROTA_FORECAST",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.weeklyRotaForecast.method,
        path: (options) => {
            var [serverVenueId, startOfWeek] = oFetch(options, "serverVenueId", "startOfWeek")
            return apiRoutes.weeklyRotaForecast.getPath({venueId: serverVenueId, startOfWeek})
        },
        getSuccessActionData: function(responseData){
            return {
              weeklyRotaForecast: responseData
            };
        }
    })
});






export const clockInOutAppLoadAppData = createApiRequestAction({
    requestType: "CLOCK_IN_OUT_APP_LOAD_APP_DATA",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.getClockInOutAppData.method,
        path: apiRoutes.getClockInOutAppData.getPath(),
        doesntNeedAccessToken: true,
        data: function(requestOptions, getState){
            return {
                api_key: getState().apiKey
            }
        },
        getSuccessActionData(responseData){
            return responseData
        }
    }),
    getSuccessActionData(){
        return {};
    },
    additionalSuccessActionCreator: function(responseData){
        return loadInitialClockInOutAppState(responseData);
    }
})

export function updateStaffMemberPinWithEntryModal(requestOptions){
    var staffMemberObject = oFetch(requestOptions, "staffMemberObject");
    var staffMemberName = staffMemberObject.first_name + staffMemberObject.surname;
    return showConfirmationModal({
        modalOptions: {
            title: "Enter a new PIN for " + staffMemberName,
            confirmationType: "PIN"
        },
        confirmationAction: {
            apiRequestType: "UPDATE_STAFF_MEMBER_PIN",
            requestOptions: requestOptions
        }
    });
}

export const updateStaffMemberPin = createApiRequestAction({
    requestType: "UPDATE_STAFF_MEMBER_PIN",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.changeStaffMemberPin.method,
        path(requestOptions) {
            var staffMemberServerId = oFetch(requestOptions, "staffMemberObject.serverId");
            return apiRoutes.changeStaffMemberPin.getPath({
                staffMemberServerId
            });
        },
        accessToken: function(requestOptions, getState){
            return getState().clockInOutAppUserMode.token
        },
        data: function(requestOptions, getState) {
            return {
                pin_code: requestOptions.confirmationData.pin
            }
        },
        getSuccessActionData(){
            return {};
        }
    })
})

export function updateStaffStatusWithConfirmation(requestOptions){
    return function(dispatch, getState){``
        var state = getState();
        if (selectClockInOutAppIsInManagerMode(state)) {
            requestOptions = {
                ...requestOptions,
                accessToken: state.clockInOutAppUserMode.token
            }
            dispatch(updateStaffStatus(requestOptions))
        } else {
            var staffMemberObject = oFetch(requestOptions, "staffMemberObject");
            var {first_name, surname} = staffMemberObject;
            dispatch(showConfirmationModal({
                modalOptions: {
                    title: `Enter PIN for ${first_name} ${surname}`,
                    confirmationType: "PIN"
                },
                confirmationAction: {
                    apiRequestType: "UPDATE_STAFF_STATUS",
                    requestOptions
                }
            }));
        }
    }
}


export function setApiKey({apiKey}){
    return {
        type: "SET_API_KEY",
        apiKey
    }
}

export function replaceWeeklyRotaForecast({weeklyRotaForecast}) {
    return {
        type: "REPLACE_WEEKLY_ROTA_FORECAST",
        weeklyRotaForecast
    }
}

export const updateRotaStatus = createApiRequestAction({
    requestType: "UPDATE_ROTA_STATUS",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.updateRotaStatus.method,
        path: function(options){
            if (!options.venueClientId){
                throw new Error("need venueClientId");
            }
            return apiRoutes.updateRotaStatus.getPath(options);
        },
        getSuccessActionData: function(responseData, requestOptions, getState){
            var state = getState();
            var rota = getRotaFromDateAndVenue({
                rotas: state.rotas,
                dateOfRota: requestOptions.date,
                venueId: requestOptions.venueClientId
            });

            return {
                rotaClientId: rota.clientId,
                status: responseData.status
            }
        }
    })
});

export const publishRotas = createApiRequestAction({
    requestType: "PUBLISH_ROTAS",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.publishRotas.method,
        path: function(options){
            return apiRoutes.publishRotas.getPath({
                venueId: options.venueServerId,
                date: options.date
            })
        },
        getSuccessActionData: function(responseData, requestOptions){
            return requestOptions;
        }
    }),
    confirm: function(){
        return confirm("Publishing a rota will send out email confirmations and can't be undone.\nDo you want to continue?")
    }
})

// Since we have lots of data it's cumbersome to create a new actionCreators for each
// data type. So I removed the individual actionCreators and we're now
// only using a generic one.
export function genericReplaceAllItems(data){
    var keys = _.keys(data);
    if (keys.length !== 1) {
        throw Error("Invalid data for genericReplaceAllItems, only one set of values allowed")
    }

    var collectionName = keys[0];
    var items = data[collectionName]
    return {
        type: actionTypes.GENERIC_REPLACE_ALL_ITEMS,
        [collectionName]: items
    }
}

export function setPageOptions(options) {
    return {
        type: actionTypes.SET_PAGE_OPTIONS,
        pageOptions: options.pageOptions
    }
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

function indexByClientId(data){
    return _.indexBy(data, "clientId")
}
