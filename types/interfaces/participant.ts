export interface Participant {
  "@id"?: string;
  readonly user?: string;
  readonly guest?: string;
  readonly lastPing?: Date;
  readonly fishbowl?: string;
}
