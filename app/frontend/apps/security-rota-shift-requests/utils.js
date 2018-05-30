import Moment from 'moment';
import { extendMoment } from 'moment-range';

const momentRange = extendMoment(Moment);

export function isRangesOverlapped(range1, range2) {
  return range1.overlaps(range2, { adjacent: false });
}

export const isShiftRequestOverlapped = ({ rotaShifts, staffMemberId, shiftRequestStartDate, shiftRequestEndDate }) => {
  return !!rotaShifts.find(rotaShift => {
    const rotaShiftStartDate = new Date(rotaShift.get('startsAt'));
    const rotaShiftEndDate = new Date(rotaShift.get('endsAt'));

    const rotaShiftStaffMemberId = rotaShift.get('staffMemberId');

    const shiftRange = momentRange.range(rotaShiftStartDate, rotaShiftEndDate);
    const shiftRequestRange = momentRange.range(shiftRequestStartDate, shiftRequestEndDate);
    return staffMemberId === rotaShiftStaffMemberId && isRangesOverlapped(shiftRange, shiftRequestRange);
  });
};

export const getOveplappedRotaShifts = (rotaShifts, startsAt, endsAt) => {
  const shiftRequestStartDate = new Date(startsAt);
  const shiftRequestEndDate = new Date(endsAt);

  const shiftRequestRange = momentRange.range(shiftRequestStartDate, shiftRequestEndDate);

  return rotaShifts.filter(rotaShift => {
    const rotaShiftStartDate = new Date(rotaShift.startsAt);
    const rotaShiftEndDate = new Date(rotaShift.endsAt);

    const shiftRange = momentRange.range(rotaShiftStartDate, rotaShiftEndDate);
    return isRangesOverlapped(shiftRange, shiftRequestRange);
  });
};
