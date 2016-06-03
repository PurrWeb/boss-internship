import expect from "expect"
import Promise from "bluebird"
import { updateStaffStatus } from "./clocking"
import _ from "underscore"

describe("Clocking Actions", function(){
    it("Can make a request to update the status of a staff member", function(done){
        var dispatch = expect.createSpy();
        var getState = function(){ return {
            clockInOutAppUserMode: {
                mode: "user"
            },
            pageOptions: {
                dateOfRota: new Date("2016-04-01")
            },
            clockInDays: {
                44: {
                    staff_member: {clientId: 10},
                    date: "2016-04-01"
                }
            }
        } }

        var promise = Promise.resolve({})

        expect.spyOn($, "ajax").andReturn(promise)

        updateStaffStatus({
            staffMemberObject: {clientId: 10},
            statusValue: "clocked_in",
            venueServerId: 3,
            date: new Date(),
            at: new Date(),
            currentStatus: "clocked_out",
            accessToken: "token"
        })(dispatch, getState)

        expect($.ajax).toHaveBeenCalled();

        _.defer(function(){
            var actions = dispatch.calls[1].arguments[0];
            expect(actions[0].type).toBe("UPDATE_STAFF_STATUS_SUCCESS");

            var additionalActionCreator = dispatch.calls[2].arguments[0];
            additionalActionCreator(dispatch, getState)

            done();
        })

        return promise;

    })
})
