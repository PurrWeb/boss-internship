import Shift from "~models/shift"
import utils from "~lib/utils"

export default {
    getTotalShiftHours(shiftList){
        var shiftLengths = shiftList.map((shift) => Shift.getLengthInHours(shift));
        return utils.sum(shiftLengths);
    }
}