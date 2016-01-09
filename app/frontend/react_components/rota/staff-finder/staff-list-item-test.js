import React from "react";
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"
import expect from "expect"
import StaffListItem from "./staff-list-item"

describe('StaffListItem', function() {
    var staff = {
        first_name: "John",
        surname: "Doe",
    };

    it("shows the person's first and last name", function(){
        var item = TestUtils.renderIntoDocument(
            <StaffListItem staff={staff} />
        );

        var itemNode = ReactDOM.findDOMNode(item);

        expect(itemNode.textContent).toContain("John");
        expect(itemNode.textContent).toContain("Doe");
    });
});