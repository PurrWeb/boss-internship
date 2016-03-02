import expect from "expect"
import getStaffTypeBreakdownByTime from "./get-grouped-shift-breakdown-by-time"
import RotaDate from "~lib/rota-date"
import _ from "underscore"

describe("getGroupedShiftBreakdownByTime", function() {
    var rotaDate = new RotaDate({dateOfRota: new Date(2015,10, 1, 0, 0, 0)});

    var staffTypes = {kitchen: {}, bar_back: {}};
    
    it("Determines the staff count for each staff type at different times during the day", function(){
        function getOffsetDate(offsetInMinutes){
            var newMinutes = rotaDate.startTime.getMinutes() + offsetInMinutes;
            return new Date(new Date(rotaDate.startTime).setMinutes(newMinutes));
        }
        var shifts = [
            {
                staff_member: {id: 1},
                starts_at: rotaDate.getDateFromShiftStartTime(8, 0),
                ends_at: rotaDate.getDateFromShiftEndTime(22, 0)
            },
            {
                staff_member: {id: 2},
                starts_at: rotaDate.getDateFromShiftStartTime(16, 0),
                ends_at: rotaDate.getDateFromShiftEndTime(2, 30)
            },
            {
                staff_member: {id: 3},
                starts_at: rotaDate.getDateFromShiftStartTime(14, 0),
                ends_at: rotaDate.getDateFromShiftEndTime(8, 0)
            }
        ];
        var staff = [
            {
                id: 1,
                staff_type: {id: "bar_back"}
            },
            {
                id: 2,
                staff_type: {id: "bar_back"}
            },
            {
                id: 3,
                staff_type: {id: "kitchen"}
            }
        ];
        staff = _(staff).indexBy("id");
        var expectedResult = [
            {
                timeOffset: 0,
                date: getOffsetDate(0),
                shiftsByGroup: {
                    bar_back: [
                        shifts[0]
                    ],
                    kitchen: []
                }
            },
            {
                timeOffset: 6 * 60,
                date: getOffsetDate(6 * 60),
                shiftsByGroup: {
                    bar_back: [
                        shifts[0]
                    ],
                    kitchen: [
                        shifts[2]
                    ]
                }
            },
            {
                timeOffset: 12 * 60,
                date: getOffsetDate(12 * 60),
                shiftsByGroup: {
                    bar_back: [
                        shifts[0],
                        shifts[1]
                    ],
                    kitchen: [
                        shifts[2]
                    ]
                }
            },
            {
                timeOffset: 18 * 60, // 2am
                date: getOffsetDate(18 * 60),
                shiftsByGroup: {
                    bar_back: [
                        shifts[1]
                    ],
                    kitchen: [
                        shifts[2]
                    ]
                }
            },
            {
                timeOffset: 24 * 60,
                date: getOffsetDate(24 * 60),
                shiftsByGroup: {
                    bar_back: [],
                    kitchen: []
                }
            }
        ];

        var result = getStaffTypeBreakdownByTime({
            shifts,
            staff,
            granularityInMinutes: 60 * 6,
            groupsById: staffTypes,
            getGroupFromShift: function(shift){
                return staff[shift.staff_member.id].staff_type;       
            },
            rotaDate
        });

        result.forEach(function(r, i){
            var e = expectedResult[i];
            expect(r).toEqual(expectedResult[i])
            
        })
    });

    it("Returns no shifts for all staff types if no shifts are passed in", function(){
        var result = getStaffTypeBreakdownByTime({
            shifts: [],
            staff: [],
            granularityInMinutes: 60 * 12,
            groupsById: staffTypes,
            rotaDate
        });
        result.forEach(function(item){
            expect(item.shiftsByGroup).toEqual({
                kitchen: [],
                bar_back: []
            })
        })
    });
});