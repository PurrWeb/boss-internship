import expect from "expect"
import _ from "underscore"
import renderTooltipHtml from "./render-tooltip-html"

describe("rotaOverview - renderTooltipHtml", function(){
    it ("Shows all staff types and their counts, with the selected staff type at the top and in bold", function(){
        var shiftsByStaffType = {
            bar_back: [{}, {}],
            kitchen: [{}]
        }

        var staffTypes = _([{
            clientId: "bar_back",
            name: "Bar back"
        },{
            clientId: "kitchen",
            name: "Kitchen"
        }]).indexBy("clientId");

        var selectedStaffTypeTitle = "Kitchen";

        var html = renderTooltipHtml({
            shiftsByGroupId: shiftsByStaffType,
            groupsById: staffTypes,
            selectedGroupId: "kitchen"
        })

        expect(html).toBe("<b>1 - Kitchen</b><br>2 - Bar back");
    })
});