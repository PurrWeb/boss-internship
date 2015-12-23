import React from "react";
import TestUtils from "react-addons-test-utils"
import expect from "expect"
import ChartAndFilter from "./chart-and-filter"

describe('ChartAndFilter', function() {
    function makeDate(hours, minutes){
        return new Date(2015, 10, 10, hours, minutes)
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

        var boundaries = ChartAndFilter.calculateChartBoundaries(shifts);
        expect(boundaries.start).toBe(13);
        expect(boundaries.end).toBe(21);
    });
});