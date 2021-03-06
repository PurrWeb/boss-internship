const MINUTES_PER_DAY = 24 * 60;

/**
Splits the day into multiple intervals, 
*/
export default function getSamplingTimeOffsetsForDay(granularityInMinutes){
    var samplingTimes = [];

    var lastSamplingTimeInMinutes = 0;
    while (lastSamplingTimeInMinutes <= MINUTES_PER_DAY) {
        samplingTimes.push(lastSamplingTimeInMinutes);

        lastSamplingTimeInMinutes += granularityInMinutes;
    }

    return samplingTimes;
}
