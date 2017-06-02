interface OptionData {
  readonly name: string;
  readonly id: number;
}

export interface BossData {
  readonly accessToken: string;
  readonly venueValues: OptionData[];
  readonly payrateValues: OptionData[];
  readonly staffTypeIds: OptionData[];
  readonly genderValues: string[];
}
