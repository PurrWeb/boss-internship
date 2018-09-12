import moment from 'moment';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';

class RotaShiftDate {
  constructor(date) {
    const mDate = safeMoment.uiDateParse(date);

    this.startTime = mDate
      .hours(8)
      .startOf('hour')
      .format();
    this.endTime = mDate.add(1, 'day').format();
  }
}

export default RotaShiftDate;
