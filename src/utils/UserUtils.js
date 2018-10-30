export default class UserUtils {
  static isLogin() {
    return sessionStorage.isLogin === 'true';
  }

  static logout() {
    sessionStorage.isLogin = 'false';
    sessionStorage.userInfo = undefined;
  }

  static save(userInfo) {
    sessionStorage.isLogin = 'true';
    sessionStorage.userInfo = JSON.stringify(userInfo);
    let permissions = {};
    if (userInfo.permissions) {
      for (let item of userInfo.permissions) {
        permissions[item.code] = item;
      }
    }
    sessionStorage.permissions = JSON.stringify(permissions);
  }

  static isAdmin() {
    return this.getUserName() === 'admin';
  }

  static getPermission(code) {
    if (this.isAdmin()) {
      return {};
    } else {
      try {
        return JSON.parse(sessionStorage.permissions)[code];
      } catch (e) {
        return null;
      }
    }
  }

  static getPermissions() {
    const permissions = this.get().permissions;
    return permissions ? permissions : [];
  }

  static get() {
    try {
      return JSON.parse(sessionStorage.userInfo);
    } catch (e) {
      return {};
    }
  }

  static getUserId() {
    return this.get().id;
  }

  static getUserName() {
    return this.get().username;
  }

  static getToken() {
    return this.get().token;
  }

  static getUserMobile() {
    return this.get().mobile;
  }
}
