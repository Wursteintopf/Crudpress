"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
/**
 * The basic roles needed for authentication.
 * Unauthenticed is open for everyone not logged in
 * Users are all basic users
 * Admins are users with special administrative rights
 */
var Role;
(function (Role) {
    Role[Role["UNAUTHENTICATED"] = 0] = "UNAUTHENTICATED";
    Role[Role["USER"] = 1] = "USER";
    Role[Role["ADMIN"] = 2] = "ADMIN";
})(Role = exports.Role || (exports.Role = {}));
