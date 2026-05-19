import type { IApiService } from './types/service'
import { JsonApiService } from './service-json'

const apiService: IApiService = new JsonApiService()

export { apiService }
export type { IApiService }
