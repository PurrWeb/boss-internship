interface Venue {
  readonly name: string;
  readonly id: number;
}

interface Payrate {
  readonly name: string;
  readonly id: number;
}

interface StaffType {
  readonly name: string;
  readonly id: number;
}

export interface BossData {
  readonly accessToken: string;
  readonly venueValues: Venue[];
  readonly payrateValues: Payrate[];
  readonly staffTypeIds: StaffType[];
  readonly genderValues: string[];
}
