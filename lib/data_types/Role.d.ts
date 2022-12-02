/**
 * The basic roles needed for authentication.
 * Unauthenticed is open for everyone not logged in
 * Users are all basic users
 * Admins are users with special administrative rights
 */
export declare enum Role {
    UNAUTHENTICATED = 0,
    USER = 1,
    ADMIN = 2
}
