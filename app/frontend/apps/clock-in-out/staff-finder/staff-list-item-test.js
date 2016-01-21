import React from "react";
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"
import expect from "expect"
import StaffListItem from "./staff-list-item"
import {ContextProvider, NoOpComponent} from "~lib/test-helpers"

StaffListItem.__Rewire__('StaffTypeBadge', NoOpComponent);
StaffListItem.__Rewire__('StaffStatusBadge', NoOpComponent);
StaffListItem.__Rewire__('ToggleStaffClockedInButton', NoOpComponent);
StaffListItem.__Rewire__('ToggleStaffOnBreakButton', NoOpComponent);


describe('StaffListItem', function() {
    var staff = {
        first_name: "John",
        surname: "Doe",
        isManager: false,
        id: 10
    };

    var manager = {
        first_name: "Emma",
        surname: "Jones",
        isManager: true,
        id: 11
    };

    var context = {
        staffStatuses: {
            10: "clocked_in",
            11: "clocked_out"
        }
    };

    it("shows the person's first and last name", function(){
        var item = TestUtils.renderIntoDocument(
            <ContextProvider context={context}>
                <StaffListItem staff={staff} />
            </ContextProvider>
        );

        var itemNode = ReactDOM.findDOMNode(item);

        expect(itemNode.textContent).toContain("John");
        expect(itemNode.textContent).toContain("Doe");
    });

    it("does not show 'enter manager mode' for non-managers", function(){
        var item = TestUtils.renderIntoDocument(
            <ContextProvider context={context}>
                <StaffListItem staff={staff} />
            </ContextProvider>
        );

        var itemNode = ReactDOM.findDOMNode(item);

        expect(itemNode.textContent).toNotContain("Enter Manager Mode");
    });

    it("shows 'enter manager mode' to managers", function(){
        var item = TestUtils.renderIntoDocument(
            <ContextProvider context={context}>
                <StaffListItem staff={manager} />
            </ContextProvider>
        );

        var itemNode = ReactDOM.findDOMNode(item);

        expect(itemNode.textContent).toContain("Enter Manager Mode");
    });
});