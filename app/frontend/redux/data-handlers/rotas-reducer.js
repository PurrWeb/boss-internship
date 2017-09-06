import utils from "~/lib/utils"
import _ from "underscore"
import oFetch from "o-fetch"
import makeDataHandler from "./make-data-handler"

export default makeDataHandler("rotas", {
    REPLACE_ALL_ROTAS: {
        action: "replaceAll"
    },
    UPDATE_ROTA_STATUS_SUCCESS: function(state, action) {
        var [rotaClientId, status] = oFetch(action, "rotaClientId", "status");
        var newState = {...state};
        var rota = _.find(newState, {clientId: rotaClientId})
        rota.status = status;
        newState[rota.clientId] = rota;
        return newState;
    },
    UPDATE_ROTA_WEEKLY_DAY: (state, action) => {
      return action.payload.rotaWeeklyDay.rota;
    },
    ADD_SHIFT_SUCCESS: function(state, action){
        // may now have the correct backend rota ID
        var rotaClientId = action.shift.rota.clientId;
        var rotaServerId = action.shift.rota.serverId;
        return _(state).mapObject(function(rota){
            if (rota.clientId !== rotaClientId){
                return rota;
            }
            return Object.assign({}, rota, {serverId: rotaServerId});
        });
    }
})
