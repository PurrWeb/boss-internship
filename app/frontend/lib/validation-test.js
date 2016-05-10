import expect from "expect"
import Validation from "./validation"
import RotaDate from "~lib/rota-date"

describe("Validation.validateBreaksDontOverlap", function(){
    var rotaDate = new RotaDate({dateOfRota: new Date(2016, 1,1)});

    function shouldBreaksOverlap(stringBreaks, expectedValue) {
        var breaks = [];
        stringBreaks.forEach(function(breakItem){
            breaks.push({
                starts_at: rotaDate.getDateFromShiftStartTimeString(breakItem[0]),
                ends_at: rotaDate.getDateFromShiftEndTimeString(breakItem[1])
            });
        })


        var validationResult = Validation.validateBreaksDontOverlap(breaks);
        expect(!validationResult.isValid).toBe(expectedValue)
    }

    it("Doesn't mark non-overlapping breaks as overlapping", function(){
        var breaks = [
            ["10:15", "11:00"],
            ["12:00", "12:30"]
        ]
        shouldBreaksOverlap(breaks, false);
    })

    it("Marks identical breaks as overlapping", function(){
        var breaks = [
            ["10:15", "11:00"],
            ["10:15", "11:00"]
        ]
        shouldBreaksOverlap(breaks, true);
    })

    it("Marks adjacent breaks as not overlapping", function(){
        var breaks = [
            ["10:15", "11:00"],
            ["11:00", "11:30"]
        ]
        shouldBreaksOverlap(breaks, false);
    })

    it("Marks breaks that start while another one is in progess as overlapping", function(){
        var breaks = [
            ["10:15", "11:00"],
            ["10:45", "11:30"]
        ]
        shouldBreaksOverlap(breaks, true);
    })

    it("Marks breaks that are a subset of another break as overlapping", function(){
        var breaks = [
            ["10:15", "11:00"],
            ["10:30", "10:45"]
        ]
        shouldBreaksOverlap(breaks, true);
    })
})
