/**
 * The basic roles needed for authentication.
 * Unauthenticed is open for everyone not logged in
 * Users are all basic users
 * Admins are users with special administrative rights
 */
export enum Role {
  UNAUTHENTICATED,
  USER,
  ADMIN,
}
