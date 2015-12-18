jest.dontMock('../staff-list-item');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const StaffListItem = require('../staff-list-item').default;

describe('StaffListItem', function() {
    var staff = {
        first_name: "John",
        surname: "Doe"
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