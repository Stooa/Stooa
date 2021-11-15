export interface User {
  "@id"?: string;
  name: string;
  surnames: string;
  allowShareData?: boolean;
  linkedinProfile?: string;
  twitterProfile?: string;
  plainPassword?: string;
  readonly email?: string;
  readonly locale?: string;
}
