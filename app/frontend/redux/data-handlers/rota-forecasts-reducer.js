import _ from "underscore"
import utils from "~/lib/utils"
import makeDataHandler from "./make-data-handler"

export default makeDataHandler("rotaForecasts", {
    REPLACE_ALL_ROTA_FORECASTS: {
        action: "replaceAll"
    },
})
