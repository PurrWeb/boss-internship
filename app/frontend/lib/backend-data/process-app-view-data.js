import {
    processHolidayObject,
    processVenueObject,
    processStaffMemberObject,
    processStaffTypeObject,
    processPageOptionsObject,
    processRotaObject,
    processShiftObject,
    processStaffTypeRotaOverviewObject,
    processStaffStatusObject
} from "./process-backend-objects"
import { getClientId } from "./process-backend-object"

export function processHolidayAppViewData(viewData){
    var pageData = {...viewData.pageData};
    var venueServerId = pageData.venueId;
    delete pageData.venueId;
    pageData.venueServerId = venueServerId;
    if (venueServerId === null){
        // no venue filter
        pageData.venueClientId = null;
    } else {
        pageData.venueClientId = getClientId(pageData.venueServerId);
    }

    return {
        staffTypes: viewData.staffTypes.map(processStaffTypeObject),
        staffMembers: viewData.staffMembers.map(processStaffMemberObject),
        holidays: viewData.holidays.map(processHolidayObject),
        venues: viewData.venues.map(processVenueObject),
        pageData
    }
}

export function processVenueRotaAppViewData(viewData){
    return {
        pageOptions: processPageOptionsObject(viewData.pageOptions),
        rota: {
            rotas: viewData.rota.rotas.map(processRotaObject),
            rota_shifts: viewData.rota.rota_shifts.map(processShiftObject),
            holidays: viewData.rota.holidays.map(processHolidayObject),
            venues: viewData.rota.venues.map(processVenueObject),
            staff_members: viewData.rota.staff_members.map(processStaffMemberObject),
            staff_types: viewData.rota.staff_types.map(processStaffTypeObject)
        }
    }
}

export function processStaffTypeRotaOverviewAppViewData(viewData){
    return {
        rotaDetailsObjects: viewData.securityRotaOverviews.map(processStaffTypeRotaOverviewObject),
        staffTypeSlug: viewData.staffTypeSlug
    }
}

export function processClockInOutAppViewData(viewData){
    var pageOptions = {
        dateOfRota: viewData.page_data.rota_date,
        venue: {id: viewData.page_data.rota_venue_id}
    }
    return {
        staff_members: viewData.staff_members.map(processStaffMemberObject),
        staff_types: viewData.staff_types.map(processStaffTypeObject),
        staff_statuses: viewData.clock_in_statuses.map(processStaffStatusObject),
        rota_shifts: viewData.rota_shifts.map(processShiftObject),
        rotas: viewData.rotas.map(processRotaObject),
        venues: viewData.venues.map(processVenueObject),
        pageOptions: processPageOptionsObject(pageOptions)
    }
}
