export const UNIFORM_TYPE = 'uniform';
export const MISC_TYPE = 'misc';

export const UNIFORM_TYPE_LABEL = 'Uniform';
export const MISC_TYPE_LABEL = 'Misc';

export const ACCESSORY_TYPE_LABELS = {
  [UNIFORM_TYPE]: UNIFORM_TYPE_LABEL,
  [MISC_TYPE]: MISC_TYPE_LABEL,
}

export const ACCESSORY_SELECT_TYPES = [
  {value: MISC_TYPE, label: ACCESSORY_TYPE_LABELS[MISC_TYPE]},
  {value: UNIFORM_TYPE, label: ACCESSORY_TYPE_LABELS[UNIFORM_TYPE]},
];
