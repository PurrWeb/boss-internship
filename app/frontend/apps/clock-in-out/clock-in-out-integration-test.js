import React from "react"
import expect from "expect"
import Promise from "bluebird"
import ClockInOutApp from "./clock-in-out-app"
import { simpleRender, accelerateTimeouts } from "~lib/test-helpers"
import ReactTestUtils from "react-addons-test-utils"
import ReactDOM from "react-dom"
import _ from "underscore"
import {
    clockInOutAppSelectStaffType,
    enterUserModeWithConfirmation
} from "~redux/actions/clocking"
import { loadInitialClockInOutAppState } from "~redux/actions/app-data"
import {createBossStore} from "~redux/store"


describe("Clock In/Out Page Integration Test", function(){
    var data = {
        staff_members: [{
            "id":2,
            "staff_type":{"id":7},
            "first_name":"Dermot",
            "surname":"O'Boyle"
        }],
        clock_in_days: [{
            id: 22,
            date: "2016-04-29",
            staff_member: {id: 2},
            venue: {id: 1},
            status: "clocked_out"
        }],
        staff_types: [{
            "id":7,
            "name":"Manager",
            "color":"#bb4dff"
        }],
        rota_shifts: [{
            id: 22,
            rota: {id: 307},
            venue: {id: 1},
            starts_at: new Date(2016, 3, 29, 10, 0),
            ends_at: new Date(2016, 3, 29, 12, 0),
            staff_member: {id: 2}
        }],
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

    function selectStaffType(component){
        component.store.dispatch(clockInOutAppSelectStaffType({selectedStaffTypeClientId: "CLIENT_ID_7"}))
    }
    function clickOnEnterManagerMode(component){
        component.store.dispatch(enterUserModeWithConfirmation({
            userMode: "Manager",
            staffMemberObject: {
                serverId: 2,
                clientId: "CLIENT_ID_2",
                staff_type: {clientId: "CLIENT_ID_7", serverId: 7},
                first_name :"Dermot",
                surname: "O'Boyle"
            }
        }))
    }
    function enterManagerMode(component){
        component.store.dispatch({
            type: "CLOCK_IN_OUT_APP_ENTER_USER_MODE_SUCCESS",
            mode: "Manager",
            token: "TOKEN"
        })
    }

    function loadAppWithData(data){
        var componentDetails = simpleRender(<ClockInOutApp />)
        componentDetails.component.store.dispatch(loadInitialClockInOutAppState(data))
        return componentDetails
    }

    function closePinModal(onClosed){
        var closeButton = getPinModal().parentElement.querySelector(".closeButton--jss-0-1")

        accelerateTimeouts(function(){
            // modal has a 500ms closing animation - couldn't find a config option
            // to disable that
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


    it("Shows an API key field if no venue data has been loaded", function(){
        var {$$} = simpleRender(<ClockInOutApp />)
        expect($$("[data-test-marker-api-key-button]").length).toBe(1);
    })


    it("Shows a large staff type selector after loading the venue's clock in/out data", function(done){
        var {$$} = simpleRender(<ClockInOutApp />)

        var promise = new Promise(function(resolve, reject){
            resolve(data);
        })
        expect.spyOn($, "ajax").andReturn(promise)
        ReactTestUtils.Simulate.submit($$("[data-test-marker-key-dialog-form]")[0]);

        _.defer(function(){
            expect($$(".large-staff-type-selector__button").length).toBeGreaterThan(0);
            done();
        })
    })

    it("Shows a list of staff members after selecting a staff type", function(){
        var {$$, component} = loadAppWithData(data)

        ReactTestUtils.Simulate.click($$(".large-staff-type-selector__button")[0]);

        expect($$(".staff-list-item--clock-in-out").length).toBeGreaterThan(0);
    })

    it("Shows a modal for pin entry after clicking on a staff member's clockin button", function(done){
        var {$$, component} = loadAppWithData(data)
        component.store.dispatch(clockInOutAppSelectStaffType({selectedStaffTypeClientId: "CLIENT_ID_7"}))
        ReactTestUtils.Simulate.click($$("[data-test-marker-toggle-staff-status]")[0])
        // I think the PIN modal module actually injects a new body-level element,
        // so it's not inside my component
        expect(getPinModal()).toNotBe(undefined)
        closePinModal(done)
    });

    it("Shows a modal after clicking on 'Enter Manager Mode'", function(done){
        var {$$, component} = loadAppWithData(data)
        selectStaffType(component);
        clickOnEnterManagerMode(component);

        ReactTestUtils.Simulate.click($$("[data-test-marker-enter-manager-mode]")[0]);
        expect(getPinModal()).toNotBe(undefined)
        closePinModal(done)
    })

    it("Logs the manager in after entering a PIN and shows change PIN buttons for users", function(done){
        var {$$, component} = loadAppWithData(data)
        selectStaffType(component)
        clickOnEnterManagerMode(component)

        var promise = Promise.resolve({access_token: "", expires_at: new Date(2050,10,10)})


        var oneButton = getPinModal().querySelector("[data-test-marker-numpad-key='1']");
        ReactTestUtils.Simulate.click(oneButton)
        ReactTestUtils.Simulate.click(oneButton)
        ReactTestUtils.Simulate.click(oneButton)
        ReactTestUtils.Simulate.click(oneButton)

        expect.spyOn($, "ajax").andReturn(promise);
        var form = getPinModal().querySelector("form")

        accelerateTimeouts(function(){
            ReactTestUtils.Simulate.submit(form)
        });

        _.delay(function(){
            expect(getPinModal()).toBe(undefined)
            expect($$("[data-test-marker-change-pin-button]").length).toBeGreaterThan(0)

            $.ajax.restore()

            done();
        }, 10);
    })

    it("Shows a modal after clicking on 'Change PIN'", function(done){
        var {$$, component} = loadAppWithData(data)
        selectStaffType(component)
        enterManagerMode(component)

        var changePinButton = $$("[data-test-marker-change-pin-button]")[0];
        ReactTestUtils.Simulate.click(changePinButton);

        _.defer(function(){
            expect(getPinModal()).toNotBe(undefined);
            closePinModal(done)
        })
    })

    it("Lets managers view and add clockInNotes", function(done){
        var {$$, component} = loadAppWithData(data)
        selectStaffType(component)
        enterManagerMode(component)

        var addNoteButton = $$("[data-test-marker-add-note]")[0];
        expect(addNoteButton).toNotBe(undefined);

        expect.spyOn(window, "prompt").andReturn("New Note Content")
        expect.spyOn($, "ajax").andReturn(Promise.resolve({
            id: 88,
            note: "New Note Content",
            clock_in_day: {id: 22}
        }))
        ReactTestUtils.Simulate.click(addNoteButton)

        _.defer(function(){
            var clockInNote = $$("[data-test-marker-clock-in-note]")[0];
            expect(clockInNote.innerHTML).toBe("New Note Content")
            $.ajax.restore();
            window.prompt.restore();

            done();
        })
    })
});
