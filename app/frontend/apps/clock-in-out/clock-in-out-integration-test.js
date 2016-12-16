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
import PinInput from "~components/pin-input"


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

    it("Shows a large staff type selector after loading the venue's clock in/out data", function(done){
        var {$$} = simpleRender(<ClockInOutApp />)

        var promise = new Promise(function(resolve, reject){
            resolve(data);
        })
        expect.spyOn($, "ajax").andReturn(promise)
        ReactTestUtils.Simulate.submit($$("[data-test-marker-key-dialog-form]")[0]);

        _.defer(function(){
            expect($$(".test-main-menu-staff-button").length).toBeGreaterThan(0);
            $.ajax.restore()
            done();
        })
    })

    it("Shows a list of staff members after selecting a staff type", function(){
        var {$$, component} = loadAppWithData(data)

        ReactTestUtils.Simulate.click($$(".main-menu__button")[0]);

        expect($$(".test-staff-row").length).toBeGreaterThan(0);
    })

    it("Shows a modal for pin entry after clicking on a staff member's clockin button", function(done){
        window.getTooltipRoot = () => document.querySelector('body');
        var {$$, component} = loadAppWithData(data)
        component.store.dispatch(clockInOutAppSelectStaffType({selectedStaffTypeClientId: "CLIENT_ID_7"}))

        const infoStatus = $$(".info-table__user-status")[0];
        ReactTestUtils.Simulate.click(infoStatus);

        _.defer(function(){
            const changeStatusButton = document.querySelector('[data-test-marker-toggle-staff-status]');
            expect(changeStatusButton).toNotBe(undefined);

            ReactTestUtils.Simulate.click(changeStatusButton);

            _.defer(function(){
                const window = document.querySelector('.test-window-enter-pin');
                expect(window).toNotBe(undefined);
                done();
            })
        });
        window.getTooltipRoot = null;
    });

    it("Shows a modal after clicking on 'Enter Manager Mode'", function(done){
        window.getTooltipRoot = () => document.querySelector('body');
        var {$$, component} = loadAppWithData(data)
        selectStaffType(component);
        clickOnEnterManagerMode(component);

        ReactTestUtils.Simulate.click($$("[data-test-marker-enter-manager-mode]")[0]);
        expect(getPinModal()).toNotBe(undefined)
        done();
        window.getTooltipRoot = null;
    });

    it("Logs the manager in after entering a PIN and shows change PIN buttons for users", function(done){
        // Tapping on pin digit buttons is throttled, so disable that to prevent slow tests
        PinInput.__Rewire__("_", _.extend(_, {
            throttle: function(fn){
                return fn
            }
        }))

        var {$$, component} = loadAppWithData(data)
        selectStaffType(component)
        clickOnEnterManagerMode(component)

        var promise = Promise.resolve({access_token: "", expires_at: new Date(2050,10,10)})

        var oneButton = getPinModal().querySelector("[data-test-marker-numpad-key='1']");
        var twoButton = getPinModal().querySelector("[data-test-marker-numpad-key='2']");
        ReactTestUtils.Simulate.click(oneButton)
        ReactTestUtils.Simulate.click(oneButton)
        ReactTestUtils.Simulate.click(twoButton)
        ReactTestUtils.Simulate.click(twoButton)

        expect.spyOn($, "ajax").andReturn(promise)
        var form = getPinModal().querySelector("form")

        accelerateTimeouts(function(){
            ReactTestUtils.Simulate.submit(form)
        });

        _.delay(function(){
            expect($.ajax).toHaveBeenCalled()
            var ajaxData = JSON.parse($.ajax.calls[0].arguments[0].data)
            expect(ajaxData.staff_member_pin).toBe("1122")

            expect(getPinModal()).toBe(undefined)
            expect($$("[data-test-marker-change-pin-button]").length).toBeGreaterThan(0)

            PinInput.__ResetDependency__("_")
            $.ajax.restore()

            done();
        }, 10);
    })

    it("Shows a modal after clicking on 'Change PIN'", function(done){
        window.getTooltipRoot = () => document.querySelector('body');

        var {$$, component} = loadAppWithData(data)
        selectStaffType(component)
        enterManagerMode(component)

        ReactTestUtils.Simulate.click($$(".test-settings-sign")[0]);

        _.defer(function(){
            var changePinButton = document.querySelector('[data-test-marker-change-pin-button]');
            ReactTestUtils.Simulate.click(changePinButton);

            _.defer(function(){
                const window = document.querySelector('.test-window-enter-pin');
                expect(window).toNotBe(undefined);
                done();
            })
        });

        window.getTooltipRoot = null;
    });

    it("Lets managers view and add clockInNotes", function(done){
        window.getTooltipRoot = () => document.querySelector('body');

        const {$$, component} = loadAppWithData(data);
        selectStaffType(component);
        enterManagerMode(component);

        ReactTestUtils.Simulate.click($$(".test-settings-sign")[0]);

        _.defer(function(){
            const addNoteButton = document.querySelector('[data-test-marker-add-note]');
            expect(addNoteButton).toNotBe(undefined);

            ReactTestUtils.Simulate.click(addNoteButton);

            _.defer(function(){
                const window = document.querySelector('.test-window-add-note');
                expect(window).toNotBe(undefined);

                expect.spyOn($, "ajax").andReturn(Promise.resolve({
                    id: 88,
                    note: "New Note Content",
                    clock_in_day: {id: 22}
                }));

                _.defer(function(){
                    const clockInNote = document.querySelector('[data-test-marker-clock-in-note]');

                    expect(clockInNote).toNotBe(undefined);
                    expect(clockInNote.innerHTML).toBe("New Note Content");
                    $.ajax.restore();

                    done();
                });

                done();
            });
        });

        window.getTooltipRoot = null;
    })
});
