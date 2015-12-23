import expect from "expect"
import RotaDate from "./rota-date"

describe("utils", function() {
    var date = new RotaDate(new Date(2015, 5, 12, 18, 0, 0));
    var dateAt6Am = new RotaDate(new Date(2015, 5, 4, 6, 0, 0));

    it("Calculates the boundaries of the rota date", function() {
        expect(date.startTime).toEqual(new Date(2015, 5, 12, 8, 0));
        expect(date.endTime).toEqual(new Date(2015, 5, 13, 8, 0));
    });

    it("Knows that 6am is part of the previous day", function(){
        expect(dateAt6Am.startTime).toEqual(new Date(2015, 5, 3, 8, 0));
    });

    it("Can generate a date object for 2PM on a rota date", function(){
        expect(date._getDateAtTime(14, 0)).toEqual(new Date(2015, 5, 12, 14, 0));
    });

    it("Can generate a date object for 3AM on a rota date", function(){
        expect(date._getDateAtTime(3, 0)).toEqual(new Date(2015, 5, 13, 3, 0));
    });

    it("Can handle shifts starting at 8am", function(){
        expect(date.getDateFromShiftStartTime(8, 0).toString()).toEqual(date.startTime.toString());
    })

    it("Can handle shifts ending at 8am", function(){
        expect(date.getDateFromShiftEndTime(8, 0).toString()).toEqual(date.endTime.toString());
    })

    it("Can generate a date object based on a time string", function(){
        expect(date.getDateFromShiftEndTimeString("16:00")).toEqual(new Date(2015, 5, 12, 16, 0));
        expect(date.getDateFromShiftStartTimeString("8:00")).toEqual(new Date(2015, 5, 12, 8, 0));
    });
});