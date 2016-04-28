import importedCreateApiRequestAction, { registeredApiRequestActionCreators} from "./create-api-request-action"
import _ from "underscore"
import moment from "moment"
import utils from "~lib/utils"
import * as backendData from "~lib/backend-data/process-backend-objects"
import makeApiRequest from "./make-api-request"
import {apiRoutes} from "~lib/routes"
import oFetch from "o-fetch"
import RotaDate from "~lib/rota-date"
import getRotaFromDateAndVenue from "~lib/get-rota-from-date-and-venue"
import { processVenueRotaAppViewData, processClockInOutAppViewData } from "~lib/backend-data/process-app-view-data"
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
    makeRequest: makeApiRequest({
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



actionTypes.REPLACE_ALL_SHIFTS = "REPLACE_ALL_SHIFTS";
export function replaceAllShifts (options) {
    return {
        type: actionTypes.REPLACE_ALL_SHIFTS,
        shifts: options.shifts
    }
}

actionTypes.CLOCK_IN_OUT_APP_SELECT_STAFF_TYPE = "CLOCK_IN_OUT_APP_SELECT_STAFF_TYPE";
export function clockInOutAppSelectStaffType({selectedStaffTypeClientId}){
    return {
        type: actionTypes.CLOCK_IN_OUT_APP_SELECT_STAFF_TYPE,
        selectedStaffTypeClientId
    }
}

export const updateRotaShift = createApiRequestAction({
    requestType: "UPDATE_SHIFT",
    makeRequest: makeApiRequest({
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
    makeRequest: makeApiRequest({
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
    makeRequest: makeApiRequest({
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
    makeRequest: makeApiRequest({
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

export const clockInOutAppEnterUserMode = createApiRequestAction({
    requestType: "CLOCK_IN_OUT_APP_ENTER_USER_MODE",
    makeRequest: makeApiRequest({
        method: apiRoutes.getSessionToken.method,
        path: apiRoutes.getSessionToken.getPath(),
        data: function(requestOptions){
            var staff_member_id = oFetch(requestOptions, "staffMemberObject.serverId");
            var staff_member_pin = oFetch(requestOptions, "confirmationData.pin");
            return {
                api_key: "F7AC8662738C9823E7410D1B5E720E4B",
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
});

actionTypes.LEAVE_MANAGER_MODE = "LEAVE_MANAGER_MODE";
export function leaveManagerMode () {
    return {
        type: actionTypes.LEAVE_MANAGER_MODE
    }
}

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
    makeRequest: function(requestOptions, success, error){
        setTimeout(function(){
            success({});
            alert("PIN changed to " + requestOptions.confirmationData.pin)
        }, 1000)
    }
})

export function updateStaffStatusWithConfirmation(requestOptions){
    return function(dispatch, getState){``
        var state = getState();
        if (selectClockInOutAppIsInManagerMode(state)) {
            requestOptions = {
                ...requestOptions,
                authToken: state.clockInOutAppUserMode.token
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
    makeRequest: makeApiRequest({
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
        data: (requestOptions) => {
            var staffMemberObject = oFetch(requestOptions, "staffMemberObject");
            var statusValue = oFetch(requestOptions, "statusValue");
            var venueServerId = oFetch(requestOptions, "venueServerId");
            var date = oFetch(requestOptions, "date");
            var at = oFetch(requestOptions, "at");
            return {
                staff_member_id: staffMemberObject.serverId,
                venue_id: venueServerId,
                date,
                at
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
    makeRequest: makeApiRequest({
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
    makeRequest: makeApiRequest({
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

actionTypes.REPLACE_ALL_STAFF_TYPES = "REPLACE_ALL_STAFF_TYPES";
export function replaceAllStaffTypes(options) {
    return {
        type: actionTypes.REPLACE_ALL_STAFF_TYPES,
        staffTypes: options.staffTypes
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
    viewData.pageOptions = pageOptions;
    viewData = processVenueRotaAppViewData(viewData);

    let rotaData = viewData.rota.rotas;
    let staffTypeData = viewData.rota.staff_types;
    let rotaShiftData = viewData.rota.rota_shifts;
    let staffMemberData = viewData.rota.staff_members;
    let venueData = viewData.rota.venues;
    let holidays = viewData.rota.holidays;
    pageOptions = viewData.pageOptions;

    return function(dispatch){
        dispatch([
            replaceAllStaffMembers({
                staffMembers: indexByClientId(staffMemberData),
            }),
            replaceAllStaffTypes({
                staffTypes: indexByClientId(staffTypeData),
            }),
            replaceAllShifts({
                shifts: indexByClientId(rotaShiftData)
            }),
            replaceAllVenues({
                venues: indexByClientId(venueData)
            }),
            replaceAllRotas({
                rotas: indexByClientId(rotaData)
            }),
            replaceAllHolidays({
                holidays: indexByClientId(holidays)
            }),
            setPageOptions({pageOptions})
        ]);
    }
}

export function loadInitialClockInOutAppState(viewData) {
    viewData = processClockInOutAppViewData(viewData);

    return function(dispatch){
        dispatch([
            replaceAllStaffMembers({
                staffMembers: indexByClientId(viewData.staff_members)
            }),
            replaceAllStaffTypes({
                staffTypes: indexByClientId(viewData.staff_types)
            }),
            replaceAllStaffStatuses({
                staffStatuses: _.indexBy(viewData.staff_statuses, function(data){
                    return data.staff_member.clientId;
                })
            }),
            replaceAllShifts({
                shifts: indexByClientId(viewData.rota_shifts)
            }),
            replaceAllRotas({
                rotas: indexByClientId(viewData.rotas)
            }),
            replaceAllVenues({
                venues: indexByClientId(viewData.venues)
            }),
            setPageOptions({
                pageOptions: viewData.pageOptions
            })
        ]);
    }
}

export function loadInitialRotaOverviewAppState(viewData){
    return function(dispatch) {
        var unprocessedRotasArray = _.pluck(viewData.rotas, "rota");
        var rotasArray  = unprocessedRotasArray.map(backendData.processRotaObject);
        var venuesArray = viewData.venues.map(backendData.processVenueObject);
        var rotas = utils.indexByClientId(rotasArray);
        var venues = utils.indexByClientId(venuesArray);

        var forecasts = viewData.rotaForecasts.map(backendData.processRotaForecastObject);
        forecasts = utils.indexByClientId(forecasts);

        var weeklyRotaForecast = backendData.processRotaForecastObject(viewData.weeklyRotaForecast);

        dispatch([
            replaceAllRotas({rotas: rotas}),
            replaceAllRotaForecasts({rotaForecasts: forecasts}),
            replaceWeeklyRotaForecast({weeklyRotaForecast}),
            setPageOptions({pageOptions: {
                startDate: new Date(viewData.startDate),
                endDate: new Date(viewData.endDate)
            }}),
            replaceAllVenues({venues})
        ]);
    }
}


function indexByClientId(data){
    return _.indexBy(data, "clientId")
}
