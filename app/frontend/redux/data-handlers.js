// kind of a temporary file maybe, could be merged with the old actions/index file maybeContainedString

import clockInStatuses from "./reducers/clock-in-statuses"
import rotaShifts from "./reducers/rota-shifts-reducer"
import clockInOutAppUserMode from "./reducers/clock-in-out-app-user-mode"
import clockInOutAppSelectedStaffType from "./reducers/clock-in-out-app-selected-staff-type-reducer"
import apiRequestsInProgress from "./reducers/api-requests-in-progress-reducer"
import componentErrors from "./reducers/component-errors-reducer"
import rotas from "./reducers/rotas-reducer"
import hoursAcceptancePeriods from "./reducers/hours-acceptance-periods"
import pageOptions from "./reducers/page-options-reducer"
import rotaForecasts from "./reducers/rota-forecasts-reducer"
import weeklyRotaForecast from "./reducers/weekly-rota-forecast-reducer"
import confirmationModal from "./reducers/confirmation-modal-reducer"
import userActionConfirmationMessages from "./reducers/user-action-confirmation-messages-reducer"
import hoursAcceptanceBreaks from "./reducers/hours-acceptance-breaks"
import clockInDays from "./reducers/clock-in-days-reducer"
import apiKey from "./reducers/api-key"
import {makeDefaultDataHandler} from "./reducers/make-data-handler"

var dataHandlers = [
    makeDefaultDataHandler("staffMembers"),
    rotaShifts,
    clockInStatuses,
    clockInOutAppUserMode,
    clockInOutAppSelectedStaffType,
    apiRequestsInProgress,
    componentErrors,
    makeDefaultDataHandler("venues"),
    rotas,
    pageOptions,
    makeDefaultDataHandler("staffTypes"),
    makeDefaultDataHandler("holidays"),
    rotaForecasts,
    weeklyRotaForecast,
    confirmationModal,
    userActionConfirmationMessages,
    apiKey,
    clockInDays,
    makeDefaultDataHandler("clockInPeriods"),
    makeDefaultDataHandler("clockInBreaks"),
    hoursAcceptanceBreaks,
    hoursAcceptancePeriods,
    makeDefaultDataHandler("clockInEvents"),
    makeDefaultDataHandler("clockInNotes"),
    makeDefaultDataHandler("clockInReasons")
]

export default dataHandlers
