/**
 * Value object: credenciales de ingreso.
 */
export class Credentials {
    username;
    password;
    constructor(username, password) {
        this.username = username?.trim() ?? '';
        this.password = password ?? '';
    }
    isValid() {
        return this.username.length > 0 && this.password.length > 0;
    }
}
