import humanize from 'string-humanize';
export const VALIDATED = 'validated';
export const PENDING_VALIDATION = 'pending_validation';

export const STATUS_OPTIONS = [
  {
    label: humanize(VALIDATED),
    value: VALIDATED,
  },
  {
    label: humanize(PENDING_VALIDATION),
    value: PENDING_VALIDATION,
  },
];

export const CREATED = 'create';
export const REGISTERED = 'registered';
export const UPDATED = 'update';

export const HISTORY_EVENT_MAP = {
  [CREATED]: 'Registered ',
  [REGISTERED]: 'Registered to ',
  [UPDATED]: 'Updated by ',
};
