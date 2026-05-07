class ErrorHandler {
  constructor() {
    this.messages = new Map([
      [400, (name) => `${name}`],
      [404, (name) => `${name}`],
      [403, (name) => `${name}`],
    ]);
  }

  display(code, target = "Yêu cầu") {
    const strategy = this.messages.get(code);
    if (strategy) {
      return strategy(target);
    }

    return "Đã xảy ra lỗi hệ thống";
  }
}

export default ErrorHandler;
