import {
    processHolidayObject,
    processVenueObject,
    processStaffMemberObject,
    processStaffTypeObject
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
