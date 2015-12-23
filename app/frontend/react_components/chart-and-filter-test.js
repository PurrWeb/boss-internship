import React from "react";
import TestUtils from "react-addons-test-utils"
import expect from "expect"
import ChartAndFilter from "./chart-and-filter"

describe('ChartAndFilter', function() {
    function makeDate(hours, minutes){
        return new Date(2015, 10, 10, hours, minutes)
    }
    function expectBoundaries(shifts, start, end){
        var boundaries = ChartAndFilter.calculateChartBoundaries(shifts);
        expect(boundaries.start).toBe(start);
        expect(boundaries.end).toBe(end);
    }

    it("Determines the part of the day to show based on the shifts", function(){
        var shifts = [
            {
                starts_at: makeDate(14, 0),
                ends_at: makeDate(16, 0)
            },
            {
                starts_at: makeDate(18, 0),
                ends_at: makeDate(20, 0)
            }
        ];

        expectBoundaries(shifts, 13, 21);
    });

    it("Can handle shifts starting at 8am", function(){
        var shifts = [
            {
                starts_at: makeDate(8, 0),
                ends_at: makeDate(12, 0)
            }
        ];

        expectBoundaries(shifts, 8, 13);
    });

    it("Can handle shifts ending at 8am", function(){
        var shifts = [
            {
                starts_at: makeDate(14, 0),
                ends_at: new Date(2015, 10, 11, 8)
            }
        ];

        expectBoundaries(shifts, 13, 8);
    });
});