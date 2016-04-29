import expect from "expect"
import makeApiRequestMaker from "./make-api-request"
import _ from "underscore"
import $ from "jquery"
window.$ = $; // expose globally because makeApiRequest is using the global version, because
// it has been supplied with the CSRF token by jQuery-Rails

describe("makeApiRequestMaker", function(){
    afterEach(function(){
        expect.restoreSpies();
    })

    it("Handles API errors and adds component information to the API response", function(done){
        var reject = null;
        var promise = new Promise(function(resolveArg, rejectArg) {
            reject = rejectArg
        });
        expect.spyOn($, "ajax").andReturn(promise)

        var apiRequestMaker = makeApiRequestMaker({
            method: "GET",
            path: "example/test",
            accessToken: "token"
        })
        var error = expect.createSpy();
        var success = function(){}
        apiRequestMaker({
            errorHandlingComponent: 77,
            requestSourceComponent: 88
        }, success, error)
        expect($.ajax).toHaveBeenCalled();

        reject({
            responseText: "It failed.",
            status: 500
        });

        _.defer(function(){
            expect(error).toHaveBeenCalled();

            var errorObject = error.calls[0].arguments[0];
            // undefined because jQuery's promises are slightly different and accept multiple arguments
            expect(errorObject.errors.base[0]).toBe("undefined - 500");
            expect(errorObject.errors.base[1]).toBe("It failed.");
            expect(errorObject.errorHandlingComponent).toBe(77);
            expect(errorObject.requestSourceComponent).toBe(88);

            done();
        })
    })

    it("Fetches a session token if the access token resolves to data for an auth request", function(done){
        var success = expect.createSpy();

        var apiRequestMaker = makeApiRequestMaker({
            method: "GET",
            path: "test",
            accessToken: function(){
                return {
                    pin: 20,
                    staffMemberServerId: 99
                }
            },
            getSuccessActionData(){
                return {}
            }
        });

        var resolve = null;
        var promise = new Promise(function(resolveArg, rejectArg) {
            resolve = resolveArg;
        });
        expect.spyOn($, "ajax").andReturn(promise)

        apiRequestMaker({}, success, function(){}, function getState(){
            return {
                apiKey: "adsfsd"
            }
        });
        resolve({access_token: "hello"})

        _.defer(function(){
            resolve({})
            _.defer(function(){
                expect($.ajax.calls.length).toBe(2);
                expect(success).toHaveBeenCalled();
                done();
            })
        })
    })
});
