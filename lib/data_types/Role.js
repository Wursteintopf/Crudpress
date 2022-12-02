/**
 * The basic roles needed for authentication.
 * Unauthenticed is open for everyone not logged in
 * Users are all basic users
 * Admins are users with special administrative rights
 */
export var Role;
(function (Role) {
    Role[Role["UNAUTHENTICATED"] = 0] = "UNAUTHENTICATED";
    Role[Role["USER"] = 1] = "USER";
    Role[Role["ADMIN"] = 2] = "ADMIN";
})(Role || (Role = {}));
