export class CreateLoginRequest {
  constructor(email, password) {
    this.email = email;         // Tên thuộc tính khớp với Backend
    this.password = password;   // Tên thuộc tính khớp với Backend
  }

  // Bạn có thể thêm phương thức kiểm tra dữ liệu ngay tại đây (Code tay tối ưu)
  isValid() {
    return this.email.includes('@') && this.password.length >= 6;
  }
}
