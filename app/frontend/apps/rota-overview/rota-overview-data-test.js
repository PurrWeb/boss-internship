import expect from "expect"
import { getStaffTypeBreakdownByTime, _getSamplingTimeOffsetsForDay } from "./rota-overview-data"
import RotaDate from "~lib/rota-date"
import _ from "underscore"

describe("_getSamplingTimeOffsetsForDay", function(){
    it("determines the sampling times to use based on the sampling granularity", function(){
        var expectedOffsetsInMinutes = [
            0, 4, 8, 12, 16, 20, 24
        ].map((x) => x * 60);
        expect(_getSamplingTimeOffsetsForDay(4 * 60)).toEqual(expectedOffsetsInMinutes);
    })
})

describe("getStaffTypeBreakdownByTime", function() {
        var rotaDate = new RotaDate(new Date(2015,10, 1, 14, 0, 0));

        var shifts = [
            {
                staff_id: 1,
                starts_at: rotaDate.getDateFromShiftStartTime(10, 0),
                ends_at: rotaDate.getDateFromShiftEndTime(22, 0)
            },
            {
                staff_id: 2,
                starts_at: rotaDate.getDateFromShiftStartTime(16, 0),
                ends_at: rotaDate.getDateFromShiftEndTime(2, 0)
            },
            {
                staff_id: 3,
                starts_at: rotaDate.getDateFromShiftStartTime(14, 0),
                ends_at: rotaDate.getDateFromShiftEndTime(8, 0)
            }
    ];
    var staff = [
        {
            id: 1,
            staff_type: "bar_back"
        },
        {
            id: 2,
            staff_type: "bar_back"
        },

        {
            id: 3,
            staff_type: "kitchen"
        }
    ];
    var expectedResult = {
        0: { // 8am
            bar_back: 0,
            kitchen: 0
        },
        [6 * 60]: { // 2pm
            bar_back: 1,
            kitchen: 1
        },
        [12 * 60]: { // 8pm
            bar_back: 2,
            kitchen: 1
        },
        [18 * 60]: { // 2am
            bar_back: 1,
            kitchen: 1
        },
        [24 * 60]: { // 8am
            bar_back: 0,
            kitchen: 1
        }
    }

    var staffTypes = {kitchen: {}, bar_back: {}};

    it("Determines the staff count for each staff type at different times during the day", function(){
        expect(getStaffTypeBreakdownByTime(shifts, staff, 60 * 6, staffTypes)).toEqual(expectedResult)
    })
});