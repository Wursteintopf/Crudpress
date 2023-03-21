const internalApiToken = process.env.INTERNAL_API_TOKEN

export const getInternalApiToken = (): string => {
  if (!internalApiToken) throw new Error('Environment variable INTERNAL_API_TOKEN is not set. Are you trying to access the internal API from external?')

  return internalApiToken
}
