class appError extends Error {
  constructor() {
    super();
  }
  create(message, statusCode, statusText){
    this.message = message;
    this.statusCode = statusCode;
    this.statusText = statusText;
    return this; //فى انى اخد القيم createعلشان هنستخدم ال
  }
}

module.exports = new appError();