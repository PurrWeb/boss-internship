import {BossData} from './interfaces/common-data-types';

const boss: BossData = {
  accessToken: 'someToken',
  venueValues: [
    {
      name: 'someVenue',
      id: 12
    },
    {
      name: 'otherVenue',
      id: 14
    }
  ],
  payrateValues: [
    {
      name: 'somePayrate',
      id: 112
    },
    {
      name: 'otherPayrate',
      id: 114
    }
  ],
  staffTypeIds: [
    {
      name: 'someStaffType',
      id: 212
    },
    {
      name: 'otherStaffType',
      id: 214
    }
  ],
  genderValues: ['male', 'female']
};

export default boss;
