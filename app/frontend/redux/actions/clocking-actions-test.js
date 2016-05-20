import expect from "expect"
import Promise from "bluebird"
import { updateStaffStatus } from "./clocking-actions"
import _ from "underscore"

describe("RotaActions", function(){
    it("Can make a request to update the status of a staff member", function(done){
        var dispatch = expect.createSpy();
        var getState = function(){ return {
            clockInOutAppUserMode: {
                mode: "user"
            }
        } }

        var promise = Promise.resolve({})

        expect.spyOn($, "ajax").andReturn(promise)

        updateStaffStatus({
            staffMemberObject: {},
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
            done();
        })

        return promise;

    })
})
