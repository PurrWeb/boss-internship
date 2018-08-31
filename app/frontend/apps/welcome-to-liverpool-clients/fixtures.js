export default {
  cards: [
    {
      number: 123456,
      disabled: false,
    },
    {
      number: 123457,
      disabled: true,
    },
    {
      number: 123458,
      disabled: false,
    },
    {
      number: 123459,
      disabled: false,
    },
    {
      number: 123466,
      disabled: true,
    },
    {
      number: 123476,
      disabled: false,
    },
    {
      number: 123486,
      disabled: false,
    },
    {
      number: 123496,
      disabled: true,
    },
    {
      number: 123556,
      disabled: false,
    },
    {
      number: 123656,
      disabled: false,
    },
    {
      number: 123756,
      disabled: false,
    },
  ],
  clients: [
    {
      id: 1,
      cardNumber: 123756,
      emailVerified: true,
      gender: 'male',
      dateOfBirth: '01-01-1990',
      university: 'John Moores University',
      disabled: false,
      email: 'john.doe@example.com',
      fullName: 'John Doe1',
      updatedAt: '2018-01-01T10:00:00Z',
      history: {
        '2018-08-31T10:05:49.000+01:00': {
          by: 'System',
          to: null,
          event: 'create',
          changeset: { state: null, number: [null, '123456'] },
        },
        '2018-08-31T10:19:31.000+01:00': {
          by: 'Dev User',
          to: null,
          event: 'update',
          changeset: { state: ['enabled', 'disabled'], number: null },
        },
        '2018-08-31T10:19:38.000+01:00': {
          by: 'Dev User',
          to: null,
          event: 'update',
          changeset: { state: ['disabled', 'enabled'], number: null },
        },
        '2018-08-31T10:20:16.000+01:00': {
          by: 'Dev User',
          to: null,
          event: 'update',
          changeset: { state: ['enabled', 'disabled'], number: null },
        },
        '2018-08-31T10:20:21.000+01:00': {
          by: 'Dev User',
          to: null,
          event: 'update',
          changeset: { state: ['disabled', 'enabled'], number: null },
        },
        '2018-08-31T11:02:33.000+01:00': {
          by: 'Dev User',
          to: null,
          event: 'update',
          changeset: { state: ['enabled', 'disabled'], number: null },
        },
        '2018-08-29T11:02:48.000+01:00': {
          by: 'Dev User',
          to: null,
          event: 'update',
          changeset: { state: ['disabled', 'enabled'], number: null },
        },
        '2018-08-28T10:15:43.000+01:00': { by: null, to: 'John Doe', event: 'registered', changeset: {} },
      },
    },
    {
      id: 2,
      cardNumber: 123656,
      emailVerified: true,
      updatedAt: '2018-01-01T10:00:00Z',

      email: 'john.doe@example.com',

      fullName: 'John Doe2',
      gender: 'female',
      dateOfBirth: '01-01-1990',
      university: 'John Moores University',
      disabled: false,
    },
    {
      id: 3,
      emailVerified: true,
      cardNumber: 56789,
      updatedAt: '2018-01-01T10:00:00Z',
      fullName: 'John Doe3',
      gender: 'male',
      dateOfBirth: '01-01-1990',
      university: 'John Moores University',
      disabled: true,
      email: 'john.doe@example.com',
    },
    {
      emailVerified: true,
      id: 4,
      cardNumber: 123556,

      updatedAt: '2018-01-01T10:00:00Z',
      fullName: 'John Doe4',
      gender: 'male',
      dateOfBirth: '01-01-1990',
      university: 'John Moores University',
      disabled: false,
      email: 'john.doe@example.com',
    },
    {
      id: 5,
      cardNumber: 123459,
      emailVerified: false,

      updatedAt: '2018-01-01T10:00:00Z',
      fullName: 'John Doe5',
      gender: 'male',
      dateOfBirth: '01-01-1995',
      university: 'John Moores University',
      disabled: false,
      email: 'john.doe@example.com',
    },
    {
      emailVerified: true,
      id: 6,
      cardNumber: 123722,
      updatedAt: '2018-01-01T10:00:00Z',
      fullName: 'John Doe6',
      gender: 'male',
      dateOfBirth: '01-01-1993',
      university: 'John Moores University',
      disabled: true,
      email: 'john.doe@example.com',
    },
    {
      emailVerified: true,
      id: 7,
      cardNumber: 23456,
      updatedAt: '2018-01-01T10:00:00Z',
      fullName: 'John Doe7',
      gender: 'male',
      dateOfBirth: '01-01-1990',
      university: 'John Moores University',
      disabled: false,
      email: 'john.doe@example.com',
    },
    {
      emailVerified: false,
      id: 8,
      cardNumber: 654321,

      updatedAt: '2018-01-01T10:00:00Z',
      fullName: 'John Doe8',
      gender: 'male',
      dateOfBirth: '01-01-1990',
      university: 'John Moores University',
      disabled: false,
      email: 'john.doe@example.com',
    },
    {
      emailVerified: true,
      id: 9,
      cardNumber: 76845,

      email: 'john.doe@example.com',

      updatedAt: '2018-01-01T10:00:00Z',
      fullName: 'John Doe9',
      gender: 'male',
      dateOfBirth: '01-01-1990',
      university: 'John Moores University2',
      disabled: false,
    },
    {
      emailVerified: true,
      id: 10,
      cardNumber: 987897,

      updatedAt: '2018-01-01T10:00:00Z',
      fullName: 'John Doe10',
      gender: 'male',
      dateOfBirth: '01-01-1990',
      university: 'John Moores University',
      disabled: false,
      email: 'john.doe@example.com',
    },
  ],
};
