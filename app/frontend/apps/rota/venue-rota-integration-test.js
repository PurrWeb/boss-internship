import React from "react"
import expect from "expect"
import { simpleRender } from "~lib/test-helpers"
import RotaApp from "./rota-app"
import TestUtils from "react-addons-test-utils"

import "~lib/load-underscore-mixins"

function replaceNbsp(string){
    var nbsp = String.fromCharCode(160);
    var regex = new RegExp(nbsp, "g");
    return string.replace(regex, " ");
}

describe('StaffListItem', function() {
    const JOHN_KITCHEN_ID = 50;
    const SALLY_SECURITY = 55;
    const ROTA_ID = 766;
    var viewData = {
        rota: {
            staff_types: [{
                name: "Kitchen",
                id: 4
            },{
                name: "Security",
                id: 5
            }],
            venues: [{
                name: "The Bar",
                id: 3
            }], 
            staff_members: [{
                first_name: "John",
                surname: "Smith",
                id: JOHN_KITCHEN_ID,
                holidays: [],
                staff_type: {id: 4}
            }, {
                first_name: "Sally",
                surname: "Jones",
                id: SALLY_SECURITY,
                holidays: [],
                staff_type: {id: 5}
            }],
            rotas: [{
                id: ROTA_ID,
                venue: { id: 3 },
                date: "2016-03-10",
                status: "in_progress"
            }, {
                id: 4,
                venue: { id: 3 },
                date: "2016-03-13",
                status: "in_progress"
            }],
            rota_shifts: [{
                id: 1,
                staff_member: {id: JOHN_KITCHEN_ID},
                starts_at: "2016-03-10T12:00:00Z",
                ends_at: "2016-03-10T16:00:00Z",
                rota: {id: ROTA_ID}
            },{
                id: 2,
                staff_member: {id: JOHN_KITCHEN_ID},
                starts_at: "2016-03-13T10:00:00Z",
                ends_at: "2016-03-13T11:00:00Z",
                rota: {id: 4}
            },{
                id: 3,
                staff_member: {id: SALLY_SECURITY},
                starts_at: "2016-03-11T02:00:00Z",
                ends_at: "2016-03-11T04:00:00Z",
                rota: {id: ROTA_ID}
            }],
            holidays: []
        },
        rotaVenueId: 3,
        rotaDate: "2016-03-10"
    };

    it("Shows two staff members in the staff finder", function(){
        var {$, $$} = simpleRender(<RotaApp viewData={viewData} />);

        expect($$(".staff-list-item").length).toBe(2);
    });

    it("Shows this week's shifts for each staff member in the staff finder", function(){
        var {$, $$} = simpleRender(<RotaApp viewData={viewData} />);

        var content = replaceNbsp($$(".staff-list-item")[0].textContent);
        expect(content).toContain("10 Mar 12:00 to 16:00"); 
        expect(content).toContain("13 Mar 10:00 to 11:00"); 

        content = replaceNbsp($$(".staff-list-item")[1].textContent);
        expect(content).toContain("10 Mar 2:00 to 4:00");
    });

    it("Shows todays shifts in the rota chart", function(){
        
    });

    it("Does not allow adding security shifts", function(){

    });

    it("Allows a shift to be edited if it's clicked in the rota chart", function(){

    });

    it("Allows rhe rota to be marked as finished", function(){

    })
});