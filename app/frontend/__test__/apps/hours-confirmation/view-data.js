export default {
  venues: [{
    "id": 1,
    "name": "McCooley's"
  }],
  pageOptions: {
    venue: {
      id: 1
    },
    pageDateFormat: {
      date: '05-12-2017'
    }
  },
  clockInDays: [{
    id: 22,
    date: "2016-11-01",
    staff_member: {
      id: 160
    },
    venue: {
      id: 1
    },
    status: "clocked_out"
  }],
  clockInPeriods: [{
    id: 2333,
    starts_at: new Date(2016, 10, 1, 9, 0).toString(),
    ends_at: new Date(2016, 10, 1, 18, 0).toString(),
    clock_in_day: {
      id: 22
    }
  }],
  hoursAcceptancePeriods: [{
    id: 11,
    starts_at: new Date(2016, 10, 1, 9, 30).toString(),
    ends_at: new Date(2016, 10, 1, 18, 0).toString(),
    reason_note: "custom note entered here",
    clock_in_day: {
      id: 22
    },
    status: "pending",
  }],
  clockInEvents: [{
    id: 11,
    type: "clock_in",
    time: new Date(2016, 10, 1, 9, 0).toString(),
    clock_in_period: {
      id: 2333
    }
  }, {
    id: 22,
    type: "start_break",
    time: new Date(2016, 10, 1, 10, 30).toString(),
    clock_in_period: {
      id: 2333
    }
  }, {
    id: 33,
    type: "end_break",
    time: new Date(2016, 10, 1, 11, 30).toString(),
    clock_in_period: {
      id: 2333
    }
  }, {
    id: 44,
    type: "clock_out",
    time: new Date(2016, 10, 1, 18, 0).toString(),
    clock_in_period: {
      id: 2333
    }
  }],
  rotaShifts: [{
    id: 1122,
    starts_at: new Date(2016, 10, 1, 10, 0).toString(),
    ends_at: new Date(2016, 10, 1, 16, 0).toString(),
    staff_member: {
      id: 160
    },
    rota: {
      id: 16
    }
  }],
  rotas: [{
    id: 16,
    venue: {
      id: 1
    },
    date: "2016-11-1"
  }],
  clockInBreaks: [{
      id: 22,
      clock_in_day: {
        id: 22
      },
      starts_at: new Date(2016, 10, 1, 10, 30).toString(),
      ends_at: new Date(2016, 10, 1, 11, 30).toString(),
      clock_in_period: {
        id: 2333
      }
    },
    {
      id: 33,
      clock_in_day: {
        id: 22
      },
      starts_at: new Date(2016, 10, 2, 2, 30).toString(),
      ends_at: null,
      clock_in_period: {
        id: 12222
      }
    }
  ],
  hoursAcceptanceBreaks: [{
    id: 24,
    clock_in_day: {
      id: 22
    },
    starts_at: new Date(2016, 10, 1, 10, 15).toString(),
    ends_at: new Date(2016, 10, 1, 11, 45).toString(),
    hours_acceptance_period: {
      id: 11
    }
  }],
  staffMembers: [{
    id: 160,
    avatar_url: "https://jsmbars-assets-boss-production.s3.amazonaws.com/uploads/staff_member/avatar/160/avatar.jpg",
    staff_type: {
      id: 8
    },
    first_name: "John",
    surname: "Smith",
    preferred_hours: "48",
    preferred_days: "Full time",
    holidays: [],
    venues: [{
      id: 1
    }]
  }],
  staffTypes: [{
    id: 8,
    url: "http://localhost:3000/api/v1/staff_types/1",
    name: "Bar Back",
    color: "#fd4949"
  }],
  clockInNotes: [{
    id: 33,
    text: "came in late",
    clock_in_day: {
      id: 22
    }
  }, {
    id: 88,
    text: "extra work from 8pm to midnight",
    clock_in_day: {
      id: 22
    }
  }]
};
