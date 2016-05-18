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
    processClockInDayObject
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

export function processStaffTypeRotaOverviewAppViewData(viewData){
    return {
        rotaDetailsObjects: viewData.securityRotaOverviews.map(processStaffTypeRotaOverviewObject),
        staffTypeSlug: viewData.staffTypeSlug
    }
}
