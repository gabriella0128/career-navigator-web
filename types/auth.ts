export interface ReissueResponse {
  accessToken: string;
}

export interface LoginInfo {
  userId: string;
  userPasswd: string;
}

export interface LoginResponse {
  accessToken: string;
  roles: string[];
  usrId: string;
  mailAddr: string;
}
