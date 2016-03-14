import React from "react"
import expect from "expect"
import { simpleRender } from "~lib/test-helpers"
import RotaApp from "./rota-app"
import TestUtils from "react-addons-test-utils"

import "~lib/load-underscore-mixins"

describe('StaffListItem', function() {
    var viewData = {
        rota: {
            staff_types: [{
                name: "Kitchen",
                id: 4
            }],
            venues: [{
                name: "The Bar",
                id: 3
            }], 
            staff_members: [{
                first_name: "John",
                surname: "Smith",
                id: 50,
                holidays: [],
                staff_type: {id: 4}
            }, {
                first_name: "Sally",
                surname: "Jones",
                id: 52,
                holidays: [],
                staff_type: {id: 4}
            }],
            rotas: [{
                id: 876,
                venue: { id: 3 },
                date: "2016-03-10",
                status: "in_progress"
            }],
            rota_shifts: [],
            holidays: []
        },
        rotaVenueId: 3,
        rotaDate: "2016-03-10"
    };

    it("Shows two staff members in the staff finder", function(){
        var {$, $$} = simpleRender(<RotaApp viewData={viewData} />);

        expect($$(".staff-list-item").length).toBe(2);
    });
});