const api = require("../utils/CEXClient");

module.exports = class Auth {
  static async create(name, email, password) {
    const user = {
      name: name,
      email: email,
      password: password,
      confirmPassword: password,
    };
    try {
      const data = await api.post("/user/register", user).then((response) => {
        return response.data;
      });

      return {
        status: "success",
        token: JSON.stringify(data.token),
      };
    } catch (error) {
      return { status: "error", message: error?.response?.data?.message };
    }
  }
  static async generationToken(email, password) {
    //message:password invalid or user not Exists
    const user = { email: email, password: password };
    try {
      const data = await api
        .post("/user/login", user)
        .then((response) => {
          return {
            status: "success",
            token: JSON.stringify(response.data.token),
          };
        })
        .catch((error) => {
          return { status: "error", message: error?.response?.data?.message };
        });
      return data;
    } catch (error) {
      return { status: "error", message: error?.response?.data?.message };
    }
  }
  static async createCoinUser(register, token) {
    try {
      const data = await api
        .post("/coinuser/register", register, {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        })
        .then(async (response) => {
          return { data: response.data };
        });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};
