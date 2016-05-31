import clockInStatuses from "./data-handlers/clock-in-statuses"
import rotaShifts from "./data-handlers/rota-shifts-reducer"
import clockInOutAppUserMode from "./data-handlers/clock-in-out-app-user-mode"
import clockInOutAppSelectedStaffType from "./data-handlers/clock-in-out-app-selected-staff-type-reducer"
import apiRequestsInProgress from "./data-handlers/api-requests-in-progress-reducer"
import componentErrors from "./data-handlers/component-errors-reducer"
import rotas from "./data-handlers/rotas-reducer"
import hoursAcceptancePeriods from "./data-handlers/hours-acceptance-periods"
import pageOptions from "./data-handlers/page-options-reducer"
import rotaForecasts from "./data-handlers/rota-forecasts-reducer"
import weeklyRotaForecast from "./data-handlers/weekly-rota-forecast-reducer"
import confirmationModal from "./data-handlers/confirmation-modal-reducer"
import userActionConfirmationMessages from "./data-handlers/user-action-confirmation-messages-reducer"
import hoursAcceptanceBreaks from "./data-handlers/hours-acceptance-breaks"
import clockInDays from "./data-handlers/clock-in-days-reducer"
import apiKey from "./data-handlers/api-key"
import clockInBreaks from "./data-handlers/clock-in-breaks"
import clockInPeriods from "./data-handlers/clock-in-periods"
import clockInEvents from "./data-handlers/clock-in-events"
import {makeDefaultDataHandler} from "./data-handlers/make-data-handler"

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
    clockInPeriods,
    clockInBreaks,
    hoursAcceptanceBreaks,
    hoursAcceptancePeriods,
    clockInEvents,
    makeDefaultDataHandler("clockInNotes"),
    makeDefaultDataHandler("hoursAcceptanceReasons")
]

export default dataHandlers
