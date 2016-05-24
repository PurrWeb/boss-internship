import expect from "expect"
import convertClockInHoursToIntervals from "./convert-clock-in-period-to-intervals"

describe("convertClockInPeriodsToIntevals", function(){
    it("Creates just one interval if there are no breaks but the staff member has clocked out", function(){
        var clockInHours = {
            starts_at: new Date(2016, 10, 1, 9, 0),
            ends_at: new Date(2016, 10, 1, 18, 0),
            breaks: []
        }
        var intervals = convertClockInHoursToIntervals(clockInHours, []);
        expect(intervals.length).toBe(1)
    })

    it("Creates no interval if there are no breaks and the staff member hasn't clocked out", function(){
        var clockInHours = {
            starts_at: new Date(2016, 10, 1, 9, 0),
            ends_at: null,
            breaks: []
        }
        var intervals = convertClockInHoursToIntervals(clockInHours, []);
        expect(intervals.length).toBe(0)
    });

    it("Creates one interval if the staff member is still working but has started and not finished a break", function(){
        var clockInHours = {
            starts_at: new Date(2016, 10, 1, 9, 0),
            ends_at: null,
            breaks: [{
                get: () => {
                    return {
                        starts_at: new Date(2016, 10, 1, 10),
                        ends_at: null
                    }
                }
            }]
        }
        var intervals = convertClockInHoursToIntervals(clockInHours, []);
        expect(intervals.length).toBe(1)
    });

    it("Creates two intervals if the staff member is still working but has taken a break earlier", function(){
        var clockInHours = {
            starts_at: new Date(2016, 10, 1, 9, 0),
            ends_at: null,
            breaks: [{
                get: () =>  {
                    return {
                        starts_at: new Date(2016, 10, 1, 10),
                        ends_at: new Date(2016, 10, 1, 11)
                    }
                }
            }],
        }
        var intervals = convertClockInHoursToIntervals(clockInHours, []);
        expect(intervals.length).toBe(2)
    });

    it("Creates three intervals if the staff member has finished working and taken one break inbetween", function(){
        var clockInHours = {
            starts_at: new Date(2016, 10, 1, 9, 0),
            ends_at: new Date(2016, 10, 1, 12, 0),
            breaks: [{
                get: () => {
                    return {
                        starts_at: new Date(2016, 10, 1, 10),
                        ends_at: new Date(2016, 10, 1, 11)
                    }
                }
            }],
        }
        var intervals = convertClockInHoursToIntervals(clockInHours, []);
        expect(intervals.length).toBe(3)
    });
})
