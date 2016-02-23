import { possibleShiftStartTimeStrings, possibleShiftEndTimeStrings } from "./possible-shift-time-strings"
import expect from "expect"
import _ from "underscore"

describe("possibleShiftStartTimeStrings", function(){
    it("Starts with '8:00' and '8:30", function(){
        expect(possibleShiftStartTimeStrings[0]).toBe("08:00");
        expect(possibleShiftStartTimeStrings[1]).toBe("08:30");
    })
    it("Ends with '07:30' and '08:00", function(){
        var last2 = _.last(possibleShiftStartTimeStrings, 2);
        expect(last2[0]).toBe("07:30");
        expect(last2[1]).toBe("08:00");
    })
});

describe("possibleShiftEndTimeStrings", function(){
    it("Starts with 8:30", function(){
        expect(possibleShiftEndTimeStrings[0]).toBe("08:30");
    })
    it("Ends with 8:00", function(){
        expect(_.last(possibleShiftEndTimeStrings)).toBe("08:00");
    })
})
