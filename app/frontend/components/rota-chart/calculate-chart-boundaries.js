import _ from "underscore"
import RotaDate from "~lib/rota-date"
import utils from "~lib/utils"

const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;

/**
 * Many venues ony operate at certain times, so we detect the times where there are
 * shifts and only show those.
 * @return {object} Object with "start" and "end" values that can be passed into the rota chart.
 */
export default function calculateChartBoundaries(rotaShifts){
    if (!_.isArray(rotaShifts)) {
        throw "calculateChartBoundaries needs array"
    }

    // Values indicating how many hours we're into the day
    var startOffset = 23; // means 7am based on an 8am start
    var endOffset = 1; // means 9am based on an 8am start

    var rotaDate;
    if (_.isEmpty(rotaShifts)) {
        startOffset = 0;
        endOffset = 24;
        rotaDate = new RotaDate({dateOfRota: Date()});
    } else {
        rotaDate = new RotaDate({shiftStartsAt: rotaShifts[0].starts_at});

        // Adjust offset range everytime we find a shift that's not contained inside it
        rotaShifts.forEach(function(rotaShift){
            var shiftStartOffset = rotaDate.getHoursSinceStartOfDay(rotaShift.starts_at);
            var shiftEndOffset = rotaDate.getHoursSinceStartOfDay(rotaShift.ends_at);
            if (shiftStartOffset < startOffset) {
                startOffset = Math.floor(shiftStartOffset);
            }
            if (shiftEndOffset > endOffset) {
                endOffset =  Math.ceil(shiftEndOffset)
            }
        });

        startOffset -= 1;
        startOffset = utils.containNumberWithinRange(startOffset, [0, 24]);
        endOffset += 1;
        endOffset = utils.containNumberWithinRange(endOffset, [0, 24]);
    }

    var boundaries = {
        start: new Date(rotaDate.startTime.valueOf() + startOffset * MILLISECONDS_PER_HOUR).getHours(),
        end: new Date(rotaDate.endTime.valueOf() + endOffset * MILLISECONDS_PER_HOUR).getHours(),
    };
    return boundaries;
}   