export const UNIFORM_TYPE = 'uniform';
export const MISC_TYPE = 'misc';

export const UNIFORM_TYPE_LABEL = 'Uniform';
export const MISC_TYPE_LABEL = 'Misc';

export const ACCESSORY_TYPE_LABELS = {
  [UNIFORM_TYPE]: UNIFORM_TYPE_LABEL,
  [MISC_TYPE]: MISC_TYPE_LABEL,
};

export const ACCESSORY_SELECT_TYPES = [
  { value: MISC_TYPE, label: ACCESSORY_TYPE_LABELS[MISC_TYPE] },
  { value: UNIFORM_TYPE, label: ACCESSORY_TYPE_LABELS[UNIFORM_TYPE] },
];

export const ACCESSORY_REQUEST_STATUS_PENDING = 'pending';
export const ACCESSORY_REQUEST_STATUS_ACCEPTED = 'accepted';
export const ACCESSORY_REQUEST_STATUS_COMPLETED = 'completed';
export const ACCESSORY_REQUEST_STATUS_REJECTED = 'rejected';
export const ACCESSORY_REQUEST_STATUS_CANCELED = 'canceled';

export const ACCESSORY_REQUEST_STATUS = {
  [ACCESSORY_REQUEST_STATUS_PENDING]: 'Pending',
  [ACCESSORY_REQUEST_STATUS_ACCEPTED]: 'Accepted',
  [ACCESSORY_REQUEST_STATUS_COMPLETED]: 'Completed',
  [ACCESSORY_REQUEST_STATUS_REJECTED]: 'Rejected',
  [ACCESSORY_REQUEST_STATUS_CANCELED]: 'Request canceled',
};