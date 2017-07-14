import expect from "expect"
import React from "react"
import StaffHolidaysListItem from "./staff-holidays-list-item"
import { simpleRender } from "~/lib/test-helpers"

describe("StaffHolidaysListItem", function(){
    it("Displays two dates if the holiday is longer than one day.", function(){
        var holiday = {
            start_date: new Date(2015, 10, 5),
            end_date: new Date(2015, 10, 10)
        }
        var node = simpleRender(<StaffHolidaysListItem holiday={holiday} />).getNode();

        expect(node.textContent).toBe("5 Nov - 10 Nov");
    });

    it("Displays one date if the holiday is only one day long", function(){
        var holiday = {
            start_date: new Date(2015, 10, 2),
            end_date: new Date(2015, 10, 2)
        }
        var node = simpleRender(<StaffHolidaysListItem holiday={holiday} />).getNode();

        expect(node.textContent).toBe("2 Nov");
    });
});
