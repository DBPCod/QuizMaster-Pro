export class CreateRegisterRequest {
  constructor(email, password) {
    this.email = email,
      this.password = password
  }

  isValid() {
    return this.password.length >= 6;
  }
}
