export type GeneralResponse<ResponseType> = {
  message?: string
  error?: string
  data: ResponseType
}
