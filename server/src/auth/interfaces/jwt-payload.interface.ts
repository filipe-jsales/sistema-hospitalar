export interface IJwtPayload {
  sub: number;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}
