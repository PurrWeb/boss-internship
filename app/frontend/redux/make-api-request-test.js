import expect from "expect"
import makeApiRequest from "./make-api-request"
import _ from "underscore"
import $ from "jquery"
window.$ = $; // expose globally because makeApiRequest is using the global version, because
// it has been supplied with the CSRF token by jQuery-Rails

describe("makeApiRequest", function(){
    afterEach(function(){
        expect.restoreSpies();
    })

    it("Handles API errors and adds component information to the API response", function(done){
        var reject = null;
        var promise = new Promise(function(resolveArg, rejectArg) {
            reject = rejectArg
        });
        expect.spyOn($, "ajax").andReturn(promise)


        var apiRequestMaker = makeApiRequest({
            method: "GET",
            path: "example/test"
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
});