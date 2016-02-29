import getSamplingTimeOffsetsForDay from "./get-sampling-time-offsets-for-day"
import expect from "expect"

describe("getSamplingTimeOffsetsForDay", function(){
    it("determines the sampling times to use based on the sampling granularity", function(){
        var expectedOffsetsInMinutes = [
            0, 4, 8, 12, 16, 20, 24
        ].map((x) => x * 60);
        expect(getSamplingTimeOffsetsForDay(4 * 60)).toEqual(expectedOffsetsInMinutes);
    })
})