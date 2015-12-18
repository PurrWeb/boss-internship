export const ADD_STAFF_TO_PROPOSED_ROTA = "ADD_STAFF_TO_PROPOSED_ROTA";
export function addStaffToProposedRota (staff_id) {
    return {
        type: ADD_STAFF_TO_PROPOSED_ROTA,
        staff_id: staff_id
    }
}

export const REMOVE_STAFF_FROM_PROPOSED_ROTA = "REMOVE_STAFF_FROM_PROPOSED_ROTA";
export function removeStaffFromProposedRota (staff_id) {
    return {
        type: REMOVE_STAFF_FROM_PROPOSED_ROTA,
        staff_id: staff_id
    }
}


export const RESET_PROPOSED_ROTA_STAFF = "RESET_PROPOSED_ROTA_STAFF";
export function resetProposedRotaStaff () {
    return {
        type: RESET_PROPOSED_ROTA_STAFF
    }
}

export const ADD_ROTA_SHIFT = "ADD_ROTA_SHIFT";
export function addRotaShift (options) {
    return {
        type: ADD_ROTA_SHIFT,
        rota: {
            starts_at: options.starts_at,
            ends_at: options.ends_at,
            staff_id: options.staff_id,
            shift_id: Math.floor(Math.random() * 100000000000)
        }
    }
}

export const UPDATE_ROTA_SHIFT = "UPDATE_ROTA_SHIFT";
export function updateRotaShift (options) {
    return {
        type: UPDATE_ROTA_SHIFT,
        rota: {
            starts_at: options.starts_at,
            ends_at: options.ends_at,
            shift_id: options.shift_id
        }
    }
}

export const DELETE_ROTA_SHIFT = "DELETE_ROTA_SHIFT";
export function deleteRotaShift (shift_id) {
    return {
        type: DELETE_ROTA_SHIFT,
        shift_id: shift_id
    }
}
