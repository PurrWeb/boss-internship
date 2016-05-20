import importedCreateApiRequestAction, { registeredApiRequestActionCreators} from "./create-api-request-action"
import _ from "underscore"
import moment from "moment"
import utils from "~lib/utils"
import * as backendData from "~lib/backend-data/process-backend-objects"
import makeApiRequestMaker from "./make-api-request"
import {apiRoutes} from "~lib/routes"
import oFetch from "o-fetch"
import RotaDate from "~lib/rota-date"
import getRotaFromDateAndVenue from "~lib/get-rota-from-date-and-venue"
import { showConfirmationModal, cancelConfirmationModal, completeConfirmationModal } from "./actions/confirmation-modal"
import { selectClockInOutAppIsInManagerMode } from "~redux/selectors"
import staffStatusOptionsByValue from "~lib/staff-status-options-by-value"

export const actionTypes = {};

window.registeredApiRequestActionCreators = registeredApiRequestActionCreators;

const createApiRequestAction = function(options){
    var options = _.clone(options);
    options.actionTypes = actionTypes;
    return importedCreateApiRequestAction(options);
}

function confirmIfRotaIsPublished(options){
    var rota = getRotaFromDateAndVenue({
        rotas: oFetch(options, "rotasByClientId"),
        dateOfRota: oFetch(options, "dateOfRota"),
        venueId: oFetch(options, "venueClientId")
    });
    if (rota.status !== "published") {
        return true;
    }
    return confirm(options.question);
}

function getRotaDateFromShiftStartsAt(startAt){
    var rotaDate = new RotaDate({shiftStartsAt: startAt});
    return rotaDate.getDateOfRota();
}

actionTypes[showConfirmationModal.actionType] = showConfirmationModal.actionType;
actionTypes[cancelConfirmationModal.actionType] = cancelConfirmationModal.actionType;
actionTypes[completeConfirmationModal.actionType] = completeConfirmationModal.actionType;

export { showConfirmationModal, cancelConfirmationModal, completeConfirmationModal};

export const addRotaShift = createApiRequestAction({
    requestType: "ADD_SHIFT",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.addShift.method,
        path: function({venueServerId, starts_at}, getState) {
            var date = getRotaDateFromShiftStartsAt(starts_at);
            return apiRoutes.addShift.getPath(venueServerId, date);
        },
        data: function(options){
            var [starts_at, ends_at, staff_member_id, shift_type] = oFetch(options,
                "starts_at", "ends_at", "staffMemberServerId", "shift_type");
            return {
                starts_at,
                ends_at,
                staff_member_id,
                shift_type
            }
        },
        getSuccessActionData: function(responseData, requestOptions, getState) {
            responseData = backendData.processShiftObject(responseData);

            // processShiftObject will set rota.clientId based on the rota's server id
            // However, if the rota object was created on the client before it had
            // a server id, we want to use the original clientId
            var rotaDate = new RotaDate({shiftStartsAt: responseData.starts_at});
            var rota = getRotaFromDateAndVenue({
                rotas: getState().rotas,
                dateOfRota: rotaDate.getDateOfRota(),
                venueId: requestOptions.venueClientId
            });
            responseData.rota.clientId = rota.clientId;

            return {shift: responseData};
        }
    }),
    confirm: function(requestOptions, getState){
        var venueClientId = oFetch(requestOptions, "venueClientId");
        var dateOfRota = new RotaDate({shiftStartsAt: oFetch(requestOptions, "starts_at")}).getDateOfRota();
        return confirmIfRotaIsPublished({
            venueClientId,
            dateOfRota,
            rotasByClientId: getState().rotas,
            question: "Adding a shift to a published rota will send out email notifications. Do you want to continue?"
        })
    }
});


actionTypes.CLOCK_IN_OUT_APP_SELECT_STAFF_TYPE = "CLOCK_IN_OUT_APP_SELECT_STAFF_TYPE";
export function clockInOutAppSelectStaffType({selectedStaffTypeClientId}){
    return {
        type: actionTypes.CLOCK_IN_OUT_APP_SELECT_STAFF_TYPE,
        selectedStaffTypeClientId
    }
}

export const updateRotaShift = createApiRequestAction({
    requestType: "UPDATE_SHIFT",
    makeRequest: makeApiRequestMaker({
        path: (options) => apiRoutes.updateShift.getPath({shiftId: options.shiftServerId}),
        method: apiRoutes.updateShift.method,
        data: function(options, getState){
            var shiftType = oFetch(options, "shiftType");
            var staffMemberId = getState().rotaShifts[options.shiftClientId].staff_member.serverId;
            var shift = {
                shift_id: options.shiftServerId,
                starts_at: options.starts_at,
                ends_at: options.ends_at,
                staff_member_id: staffMemberId,
                shift_type: shiftType
            }
            return shift;
        },
        getSuccessActionData(responseData){
            var shift = backendData.processShiftObject(responseData);
            return {shift};
        }
    }),
    confirm: function(requestOptions, getState){
        var venueClientId = oFetch(requestOptions, "venueClientId");
        var dateOfRota = new RotaDate({shiftStartsAt: oFetch(requestOptions, "starts_at")}).getDateOfRota();
        return confirmIfRotaIsPublished({
            venueClientId,
            dateOfRota,
            rotasByClientId: getState().rotas,
            question: "Updating a shift on a published rota will send out email notifications. Do you want to continue?"
        })
    }
});



export const deleteRotaShift = createApiRequestAction({
    requestType: "DELETE_SHIFT",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.deleteShift.method,
        path: (options) => apiRoutes.deleteShift.getPath({shiftId: oFetch(options, "shift.serverId")}),
        getSuccessActionData: function(responseData, requestOptions) {
            return {shiftClientId: requestOptions.shift.clientId}
        }
    }),
    confirm: function(requestOptions, getState){
        var venueClientId = oFetch(requestOptions, "venueClientId");
        var dateOfRota = new RotaDate({shiftStartsAt: oFetch(requestOptions, "shift.starts_at")}).getDateOfRota();
        return confirmIfRotaIsPublished({
            venueClientId,
            dateOfRota,
            rotasByClientId: getState().rotas,
            question: "Deleting a shift on a published rota will send out email notifications. Do you want to continue?"
        })
    }
});

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

export function enterUserModeWithConfirmation(options){
    return showConfirmationModal({
        modalOptions: {
            title: "Enter manager password",
            confirmationType: "PIN"
        },
        confirmationAction: {
            apiRequestType: "CLOCK_IN_OUT_APP_ENTER_USER_MODE",
            requestOptions: options
        }
    })
}

function makeApiRequestMakerIfNecessary({tryWithoutRequest, makeRequest}){
    return function(requestOptions, success, error, getState){
        var actionData = tryWithoutRequest(requestOptions);
        if (actionData){
            success(actionData);
        } else {
            return makeRequest.apply(this, arguments);
        }
    }
}

export const clockInOutAppEnterUserMode = createApiRequestAction({
    requestType: "CLOCK_IN_OUT_APP_ENTER_USER_MODE",
    makeRequest: makeApiRequestMakerIfNecessary({
        tryWithoutRequest: function(requestOptions){
            if (requestOptions.userMode === "user") {
                return {
                    token: null,
                    mode: "user"
                }
            }
        },
        makeRequest: makeApiRequestMaker({
            doesntNeedAccessToken: true,
            method: apiRoutes.getSessionToken.method,
            path: apiRoutes.getSessionToken.getPath(),
            needsApiKey: true,
            data: function(requestOptions){
                var staff_member_id = oFetch(requestOptions, "staffMemberObject.serverId");
                var staff_member_pin = oFetch(requestOptions, "confirmationData.pin");
                return {
                    staff_member_id,
                    staff_member_pin
                }
            },
            getSuccessActionData(responseData, requestOptions){
                return {
                    mode: requestOptions.userMode,
                    token: responseData.access_token
                }
            }
        })
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

export const updateStaffStatus = createApiRequestAction({
    requestType: "UPDATE_STAFF_STATUS",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.updateStaffClockingStatus.method,
        accessToken(requestOptions) {
            return {
                pin: requestOptions.confirmationData.pin,
                staffMemberServerId: requestOptions.staffMemberObject.serverId
            }
        },
        path: (requestOptions) => {
            var [staffMemberObject, statusValue, venueServerId, currentStatus] = oFetch(requestOptions, "staffMemberObject", "statusValue", "venueServerId", "currentStatus");
            return apiRoutes.updateStaffClockingStatus.getPath({
                currentStatus,
                newStatus: statusValue
            });
        },
        data: (requestOptions, getState) => {
            var staffMemberObject = oFetch(requestOptions, "staffMemberObject");
            var statusValue = oFetch(requestOptions, "statusValue");
            var venueServerId = oFetch(requestOptions, "venueServerId");
            var date = oFetch(requestOptions, "date");
            var at = oFetch(requestOptions, "at");

            var accessToken = requestOptions.accessToken;

            return {
                staff_member_id: staffMemberObject.serverId,
                venue_id: venueServerId,
                date,
                at,
                accessToken
            }
        },
        getSuccessActionData(responseData, requestOptions, getState){
            var {staffMemberObject, statusValue} = requestOptions;
            return {
                staffMemberObject,
                statusValue,
                userIsManagerOrSupervisor: selectClockInOutAppIsInManagerMode(getState())
            }
        }
    }),
    additionalSuccessActionCreator: function(successActionData, requestOptions){
        return function(dispatch, getState){
            var userIsManagerOrSupervisor = selectClockInOutAppIsInManagerMode(getState());
            if (userIsManagerOrSupervisor) {
                // They aren't sent back to the staff type selector, so
                // they can see the change in the normal UI
                return;
            }

            var {first_name, surname} = successActionData.staffMemberObject;
            var name = first_name + " " + surname;
            var {statusValue} = successActionData;
            var statusOption = staffStatusOptionsByValue[statusValue];

            var message = `${name} has been ${statusOption.confirmationTitle}.`
            dispatch(showUserActionConfirmationMessage({
                message
            }));
        }
    }
});

actionTypes.SET_API_KEY = "SET_API_KEY";
export function setApiKey({apiKey}){
    return {
        type: actionTypes.SET_API_KEY,
        apiKey
    }
}

actionTypes.SHOW_USER_ACTION_CONFIRMATION_MESSAGE = "SHOW_USER_ACTION_CONFIRMATION_MESSAGE";
export function showUserActionConfirmationMessage({message}) {
    return function(dispatch) {
        dispatch({
            type: actionTypes.SHOW_USER_ACTION_CONFIRMATION_MESSAGE,
            message: message
        })
        setTimeout(function(){
            dispatch(hideUserActionConfirmationMessage({message}));
        }, 2000)
    }
}

actionTypes.HIDE_USER_ACTION_CONFIRMATION_MESSAGE = "HIDE_USER_ACTION_CONFIRMATION_MESSAGE";
export function hideUserActionConfirmationMessage({message}){
    return {
        type: actionTypes.HIDE_USER_ACTION_CONFIRMATION_MESSAGE,
        message
    }
}

actionTypes.REPLACE_ALL_STAFF_MEMBERS = "REPLACE_ALL_STAFF_MEMBERS";
export function replaceAllStaffMembers(options) {
    return {
        type: actionTypes.REPLACE_ALL_STAFF_MEMBERS,
        staffMembers: options.staffMembers
    }
}

actionTypes.REPLACE_ALL_VENUES = "REPLACE_ALL_VENUES";
export function replaceAllVenues(options) {
    return {
        type: actionTypes.REPLACE_ALL_VENUES,
        venues: options.venues
    }
}

actionTypes.REPLACE_ALL_ROTAS = "REPLACE_ALL_ROTAS";
export function replaceAllRotas(options) {
    return {
        type: actionTypes.REPLACE_ALL_ROTAS,
        rotas: options.rotas
    }
}

actionTypes.REPLACE_ALL_ROTA_FORECASTS = "REPLACE_ALL_ROTA_FORECASTS";
export function replaceAllRotaForecasts({rotaForecasts}) {
    return {
        type: actionTypes.REPLACE_ALL_ROTA_FORECASTS,
        rotaForecasts
    }
}

actionTypes.REPLACE_WEEKLY_ROTA_FORECAST = "REPLACE_WEEKLY_ROTA_FORECAST";
export function replaceWeeklyRotaForecast({weeklyRotaForecast}) {
    return {
        type: actionTypes.REPLACE_WEEKLY_ROTA_FORECAST,
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


actionTypes.REPLACE_ALL_HOLIDAYS = "REPLACE_ALL_HOLIDAYS";
function replaceAllHolidays(options){
    return {
        type: actionTypes.REPLACE_ALL_HOLIDAYS,
        holidays: options.holidays
    }
}

// Since we have lots of data it's cumbersome to create a new actionCreators for each
// data type. So I removed the individual actionCreators and we're now
// only using a generic one.
actionTypes.GENERIC_REPLACE_ALL_ITEMS = "GENERIC_REPLACE_ALL_ITEMS"
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

actionTypes.REPLACE_ALL_STAFF_STATUSES = "REPLACE_ALL_STAFF_STATUSES";
export function replaceAllStaffStatuses(options) {
    return {
        type: actionTypes.REPLACE_ALL_STAFF_STATUSES,
        staffStatuses: options.staffStatuses
    }
}

actionTypes.SET_PAGE_OPTIONS = "SET_PAGE_OPTIONS";
export function setPageOptions(options) {
    return {
        type: actionTypes.SET_PAGE_OPTIONS,
        pageOptions: options.pageOptions
    }
}

actionTypes.REPLACE_ALL_CLOCK_IN_DAYS = "REPLACE_ALL_CLOCK_IN_DAYS"
export function replaceAllClockInDays(options){
    return {
        type: actionTypes.REPLACE_ALL_CLOCK_IN_DAYS,
        clockInDays: oFetch(options, "clockInDays")
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
            replaceAction: replaceAllRotas,
            processFunction: backendData.processRotaObject
        },
        "rotaForecasts": {
            replaceAction: replaceAllRotaForecasts,
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
            replaceAction: replaceAllVenues,
            processFunction: backendData.processVenueObject
        },
        "clockInDays": {
            replaceAction: replaceAllClockInDays,
            processFunction: backendData.processClockInDayObject
        },
        "staffMembers": {
            replaceAction: replaceAllStaffMembers,
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
            replaceAction: replaceAllStaffStatuses,
            processFunction: backendData.processStaffStatusObject,
            indexBy: function(status){
                return status.staff_member.clientId;
            }
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
