const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;

export default {
    getLengthInHours(shift){
        var lengthInMilliseconds = shift.ends_at.valueOf() - shift.starts_at.valueOf();
        return lengthInMilliseconds/MILLISECONDS_PER_HOUR;
    }
}