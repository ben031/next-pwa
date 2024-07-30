export class APIError {
  constructor(error: any) {
    this.status = 404;
    this.message = '';
    this.error = '';
    this.flag = '';
    if (error) {
      const { response } = error;
      if (response) {
        const { data } = response;
        if (data) {
          const { errorCode, error, message, statusCode = -1, flag } = data;
          this.error = errorCode || error;
          this.status = statusCode;
          this.flag = flag;
          if (typeof message === 'string') {
            this.message = message;
          } else if (Array.isArray(message)) {
            this.message = message[0] || '';
          }
        }
      }
    }
  }

  // Http status
  status: number;

  // 오류 메시지
  message: string;

  // 오류 코드
  error: string;

  //플래그
  flag: string;
}
