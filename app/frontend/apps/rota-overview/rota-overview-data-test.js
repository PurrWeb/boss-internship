import expect from "expect"
import getStaffTypeBreakdownByTime, { _getSamplingTimeOffsetsForDay } from "./rota-overview-data"
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

    var staffTypes = {kitchen: {}, bar_back: {}};
    
    it("Determines the staff count for each staff type at different times during the day", function(){
        function getOffsetDate(offsetInMinutes){
            var newMinutes = rotaDate.startTime.getMinutes() + offsetInMinutes;
            return new Date(new Date(rotaDate.startTime).setMinutes(newMinutes));
        }
        var shifts = [
            {
                staff_id: 1,
                starts_at: rotaDate.getDateFromShiftStartTime(8, 0),
                ends_at: rotaDate.getDateFromShiftEndTime(22, 0)
            },
            {
                staff_id: 2,
                starts_at: rotaDate.getDateFromShiftStartTime(16, 0),
                ends_at: rotaDate.getDateFromShiftEndTime(2, 30)
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
        var expectedResult = [
            {
                timeOffset: 0,
                date: getOffsetDate(0),
                shiftsByStaffType: {
                    bar_back: [
                        shifts[0]
                    ],
                    kitchen: []
                }
            },
            {
                timeOffset: 6 * 60,
                date: getOffsetDate(6 * 60),
                shiftsByStaffType: {
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
                shiftsByStaffType: {
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
                shiftsByStaffType: {
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
                shiftsByStaffType: {
                    bar_back: [],
                    kitchen: []
                }
            }
        ];

        var result = getStaffTypeBreakdownByTime({
            shifts,
            staff,
            granularityInMinutes: 60 * 6,
            staffTypes,
            rotaDate
        });

        result.forEach(function(r, i){
            console.log(JSON.stringify(expectedResult[i], null, 4))
            console.log(JSON.stringify(r, null, 4))
            var e = expectedResult[i];
            expect(r).toEqual(expectedResult[i])
            
        })
    });

    it("Returns no shifts for all staff types if no shifts are passed in", function(){
        var result = getStaffTypeBreakdownByTime({
            shifts: [],
            staff: [],
            granularityInMinutes: 60 * 12,
            staffTypes,
            rotaDate
        });
        result.forEach(function(item){
            expect(item.shiftsByStaffType).toEqual({
                kitchen: [],
                bar_back: []
            })
        })
    });
});