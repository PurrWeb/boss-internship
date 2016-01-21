import React from "react";
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"
import expect from "expect"
import StaffListItem from "./staff-list-item"
import {ContextProvider, NoOpComponent} from "~lib/test-helpers"

StaffListItem.__Rewire__('StaffTypeBadge', NoOpComponent);
StaffListItem.__Rewire__('AddStaffToShiftButton', NoOpComponent);

describe('StaffListItem', function() {
    var staff = {
        first_name: "John",
        surname: "Doe",
    };

    it("shows the person's first and last name", function(){
        var item = TestUtils.renderIntoDocument(
            <ContextProvider context={{componentErrors: {}}}>
                <StaffListItem staff={staff} />
            </ContextProvider>
        );

        var itemNode = ReactDOM.findDOMNode(item);

        expect(itemNode.textContent).toContain("John");
        expect(itemNode.textContent).toContain("Doe");
    });
});