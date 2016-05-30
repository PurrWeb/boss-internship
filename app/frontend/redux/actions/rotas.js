import createApiRequestAction from "../create-api-request-action"
import {apiRoutes} from "~lib/routes"
import makeApiRequestMaker from "../make-api-request-maker"
import oFetch from "o-fetch"

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
