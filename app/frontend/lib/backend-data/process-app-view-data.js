import {
    processHolidayObject,
    processVenueObject,
    processStaffMemberObject,
    processStaffTypeObject,
    processPageOptionsObject,
    processRotaObject,
    processShiftObject,
    processStaffTypeRotaOverviewObject,
    processStaffStatusObject,
    processStaffStatusDataObject
} from "./process-backend-objects"

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
    return {
        staff_members: viewData.staff_members.map(processStaffMemberObject),
        staff_types: viewData.staff_types.map(processStaffTypeObject),
        staff_statuses: viewData.staff_statuses.map(processStaffStatusObject),
        staff_status_data: viewData.staff_status_data.map(processStaffStatusDataObject),
        rota_shifts: viewData.rota_shifts.map(processShiftObject),
        rotas: viewData.rotas.map(processRotaObject),
        venues: viewData.venues.map(processVenueObject)
    }
}