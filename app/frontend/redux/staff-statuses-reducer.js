import { actionTypes } from "./actions.js"
import staffStatusMockData from "~data/staff-status-mock-data"
export default function staffStatuses(state={}, action){
    return staffStatusMockData;
}