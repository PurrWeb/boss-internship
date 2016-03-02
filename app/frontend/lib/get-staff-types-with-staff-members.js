import _ from "underscore"

export default function getStaffTypesWithStaffMembers(staffTypes, staffMembers) {
    return _(staffMembers).chain()
        .pluck("staff_type")
        .pluck("id")
        .unique()
        .map((staffTypeId) => staffTypes[staffTypeId])
        .indexBy("id")
        .value()
}