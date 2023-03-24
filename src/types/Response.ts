export type Response<ResponseType> = {
  message?: string
  error?: string
  items: ResponseType[]
}
