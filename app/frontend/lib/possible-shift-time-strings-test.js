import possibleShiftTimeStrings from "./possible-shift-time-strings"
import expect from "expect"
import _ from "underscore"

describe("possibleShiftTimeStrings", function(){
    it("Starts with '8:00' and '8:30", function(){
        expect(possibleShiftTimeStrings[0]).toBe("08:00");
        expect(possibleShiftTimeStrings[1]).toBe("08:30");
    })
    it("Ends with '07:30' and '08:00", function(){
        var last2 = _.last(possibleShiftTimeStrings, 2);
        expect(last2[0]).toBe("07:30");
        expect(last2[1]).toBe("08:00");
    })
});

