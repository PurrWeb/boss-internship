import createApiRequestActionCreator from "../create-api-request-action-creator"
import {apiRoutes} from "~/lib/routes"
import makeApiRequestMaker from "../make-api-request-maker"
import oFetch from "o-fetch"
import getRotaFromDateAndVenue from "~/lib/get-rota-from-date-and-venue"
import * as backendData from "~/lib/backend-data/process-backend-objects"
import notify from '~/components/global-notification';

export const updateRotaStatus = createApiRequestActionCreator({
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

export const publishRotas = createApiRequestActionCreator({
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
          notify('Rota Published Successfully', {
            interval: 5000,
            status: 'success'
          });
          return requestOptions;
        }
    }),
});

export const getRotaWeeklyDay = createApiRequestActionCreator({
  requestType: 'GET_ROTA_WEEKLY_DAY',
  makeRequest: makeApiRequestMaker({
    method: apiRoutes.getRotaWeeklyDay.method,
    path: (options) => {
      var [serverVenueId, date] = oFetch(options, "serverVenueId", "date")
      return apiRoutes.getRotaWeeklyDay.getPath({serverVenueId: serverVenueId, date: date})
    },
    getSuccessActionData: function(responseData, requestOptions, getState){
      return {
        rotaWeeklyDay: backendData.processVenueRotaOverviewObject(responseData.rotaWeeklyDay),
      };
    },
  }),
  additionalSuccessActionCreator: (successActionData, requestOptions) => {
    return (dispatch, getState) => {
      dispatch({
        type: "UPDATE_ROTA_WEEKLY_DAY",
        payload: successActionData
      });
      const date = oFetch(requestOptions, "date");
      window.history.pushState('state', 'title', `rotas?highlight_date=${date}`);
    }
  }
});

export const actionTypes = ["UPDATE_ROTA_WEEKLY_DAY"]
