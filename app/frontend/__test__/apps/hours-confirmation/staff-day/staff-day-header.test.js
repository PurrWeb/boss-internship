import React from 'react';
import { mount } from 'enzyme';
import safeMoment from "~/lib/safe-moment";

import StaffDayHeader from '~/apps/hours-confirmation/components/staff-day/staff-day-header';

describe('StaffDayHeader component integration tests', () => {
  const status = 'Clocked out';
  const rotaDate = {
    startTime: new Date()
  };
  const parsedDate = safeMoment.iso8601Parse(rotaDate.startTime).format("dddd, DD MMM YYYY");
  const comp = mount(<StaffDayHeader displayDate={true} rotaDate={rotaDate} status={status}/>);

  it('status should appear', () => {
    expect(comp.find('.boss-hrc__status-label').prop('children')).toEqual(status);
  })

  it(`date should appear if displayDate property = true`, () => {
    expect(comp.find('p.boss-hrc__date').length).toEqual(1);
    expect(comp.find('p.boss-hrc__date span.boss-hrc__date-text').prop('children')).toEqual(parsedDate);
  })

  it(`date shouldn't appear if displayDate property = false`, () => {
    comp.setProps({displayDate: false}, () => {
      expect(comp.find('p.boss-hrc__date').length).toEqual(0);
    })
  })
});
