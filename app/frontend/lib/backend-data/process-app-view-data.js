import {
    processHolidayObject,
    processVenueObject,
    processStaffMemberObject,
    processStaffTypeObject,
    processPageOptionsObject,
    processRotaObject,
    processShiftObject
} from "./process-backend-objects"

export function processHolidayAppViewState(viewState){
    var pageData = {...viewState.pageData};
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
        staffTypes: viewState.staffTypes.map(processStaffTypeObject),
        staffMembers: viewState.staffMembers.map(processStaffMemberObject),
        holidays: viewState.holidays.map(processHolidayObject),
        venues: viewState.venues.map(processVenueObject),
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
