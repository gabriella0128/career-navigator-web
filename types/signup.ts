export interface SignupRequest {
  userId: string; // 사용자 아이디
  userPasswd: string; // 비밀번호
  userEmail: string; // 이메일
  userName: string; // 이름
}

export interface CheckIdDuplicationRequest {
  userId: string; // 사용자 아이디
}

export interface CheckIdDuplicationResponse {
  isDuplicated: boolean; // 아이디 중복 여부
}
