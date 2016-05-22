import React from "react"
import expect from "expect"
import Promise from "bluebird"
import ClockInOutApp from "./clock-in-out-app"
import { simpleRender } from "~lib/test-helpers"
import ReactTestUtils from "react-addons-test-utils"
import ReactDOM from "react-dom"
import _ from "underscore"

describe("Clock In/Out Page Integration Test", function(){
    var renderedApp, getNode, $$;

    var data = {
        staff_members: [{
            "id":2,
            "staff_type":{"id":7},
            "first_name":"Dermot",
            "surname":"O'Boyle"
        }],
        clock_in_statuses: [{
            "staff_member":{"id":2},
            "status":"clocked_out"
        }],
        staff_types: [{
            "id":7,
            "name":"Manager",
            "color":"#bb4dff"
        }],
        rota_shifts: [],
        venues: [{
            "id":1,
            "name":"McCooley's",
            "staff_members":[{"id":2}]
        }],
        rotas: [{
            "id":307,
            "venue":{"id":1},
            "date":"2016-04-29",
            "status":"published"
        }],
        page_data: {
          rota_date: "2016-04-29",
          rota_venue_id: 1
        }
    };

    it("Renders without errors", function(){
        renderedApp = simpleRender(<ClockInOutApp />)
        getNode = renderedApp.getNode;
        $$ = renderedApp.$$;
    })

    it("Shows a form to input an API key", function(){
        expect($$("[data-test-marker-api-key-button]").length).toBe(1);
    })

    it("Shows a large staff type selector after loading the venue's clock in/out data", function(done){
        var promise = new Promise(function(resolve, reject){
            resolve(data);
        })
        expect.spyOn($, "ajax").andReturn(promise)
        ReactTestUtils.Simulate.submit(getNode());

        _.defer(function(){
            expect($$(".large-staff-type-selector__button").length).toBeGreaterThan(0);
            done();
        }, 0)
    })

    it("Shows a list of staff members after selecting a staff type", function(){
        ReactTestUtils.Simulate.click($$(".large-staff-type-selector__button")[0]);

        expect($$(".staff-list-item--clock-in-out").length).toBeGreaterThan(0);
    })

    function accelerateTimeouts(fn){
        // modal has a 500ms closing animation - couldn't find a config option
        // to disable that
        var originalSetTimeout = setTimeout;
        window.setTimeout =  function(callback, time){
            return originalSetTimeout(callback, time / 100);
        }
        fn();
        window.setTimeout = originalSetTimeout;
    }

    function closePinModal(onClosed){
        var closeButton = getPinModal().parentElement.querySelector(".closeButton--jss-0-1")

        accelerateTimeouts(function(){
            ReactTestUtils.Simulate.click(closeButton)
        })

        _.delay(function(){
            expect(getPinModal()).toBe(undefined)
            onClosed();
        }, 10)
    }

    function getPinModal(){
        return document.querySelectorAll("[data-test-marker-pin-modal]")[0];
    }

    it("Shows a modal for pin entry after clicking on a staff member's clockin button", function(done){
        ReactTestUtils.Simulate.click($$("[data-test-marker-toggle-staff-status]")[0])
        // I think the PIN modal module actually injects a new body-level element,
        // so it's not inside my component
        expect(getPinModal()).toNotBe(undefined)
        closePinModal(done)
    });

    it("Shows a modal after clicking on 'Enter Manager Mode'", function(){
        ReactTestUtils.Simulate.click($$("[data-test-marker-enter-manager-mode]")[0]);
        expect(getPinModal()).toNotBe(undefined)
    })

    it("Logs the manager in after entering a PIN and shows change PIN buttons for users", function(done){
        var promise = Promise.resolve({access_token: "", expires_at: new Date(2050,10,10)})

        var pinInput = getPinModal().querySelector("input[type='text']");

        pinInput.value = "1234"
        ReactTestUtils.Simulate.change(pinInput);

        expect.spyOn($, "ajax").andReturn(promise);
        var form = getPinModal().querySelector("form")

        accelerateTimeouts(function(){
            ReactTestUtils.Simulate.submit(form)
        });

        _.delay(function(){
            expect(getPinModal()).toBe(undefined)
            expect($$("[data-test-marker-change-pin-button]").length).toBeGreaterThan(0)

            done();
        }, 10);
    })

    it("Shows a modal after clicking on 'Change PIN'", function(done){
        var changePinButton = $$("[data-test-marker-change-pin-button]")[0];
        ReactTestUtils.Simulate.click(changePinButton);

        _.defer(function(){
            expect(getPinModal()).toNotBe(undefined);
            closePinModal(done)
        })
    })

});
