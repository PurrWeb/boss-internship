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
            id: "bar_back",
            name: "Bar back"
        },{
            id: "kitchen",
            name: "Kitchen"
        }]).indexBy("id");

        var selectedStaffTypeTitle = "Kitchen";

        var html = renderTooltipHtml({
            shiftsByStaffType,
            staffTypes,
            selectedStaffTypeTitle
        })

        expect(html).toBe("<b>1 - Kitchen</b><br>2 - Bar back");
    })
});