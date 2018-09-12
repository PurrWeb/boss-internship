import moment from 'moment';
import utils from '~/lib/utils';

class RotaWeek {
  constructor(date) {
    const mDate = moment(date, utils.commonDateFormat, true);
    if (!mDate.isValid()) {
      throw Error(`Valid date format should present. Expect: date in ${utils.commonDateFormat} format, got: ${date} date.`);
    }
    this.startDate = mDate.isoWeekday(1).format(utils.commonDateFormat);
    this.endDate = mDate.isoWeekday(7).format(utils.commonDateFormat);
  }
}

RotaWeek.prototype.toString = function()
{
    return `${this.startDate}:${this.endDate}`;
}

export default RotaWeek;