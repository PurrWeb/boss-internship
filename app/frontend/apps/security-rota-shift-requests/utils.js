import Moment from 'moment';
import { extendMoment } from 'moment-range';

const momentRange = extendMoment(Moment);

function isRangesOverlapped(range1, range2) {
  return range1.overlaps(range2, { adjacent: true });
}

export const isShiftRequestOverlapped = ({
  rotaShifts,
  staffMemberId,
  shiftRequestStartDate,
  shiftRequestEndDate,
}) => {
  return !!rotaShifts.find(rotaShift => {
    const rotaShiftStartDate = new Date(rotaShift.get('startsAt'));
    const rotaShiftEndDate = new Date(rotaShift.get('endsAt'));

    const rotaShiftStaffMemberId = rotaShift.get('staffMemberId');

    const shiftRange = momentRange.range(rotaShiftStartDate, rotaShiftEndDate);
    const shiftRequestRange = momentRange.range(
      shiftRequestStartDate,
      shiftRequestEndDate,
    );
    return (
      staffMemberId === rotaShiftStaffMemberId &&
      isRangesOverlapped(shiftRange, shiftRequestRange)
    );
  });
};
