import { useGet } from 'restful-react'
import { Query, buildQueryParams, resolveData } from './query'
import { IKcalOption } from '../../../backend/src/api/diet/model/KcalOptions'

interface KcalOptionsQuery extends Query {}

export const useKcalOptionsQuery = (query: KcalOptionsQuery = {}) =>
  useGet<IKcalOption[]>({
    path: `/diets/kcal-options`,
    queryParams: buildQueryParams(query),
    resolve: resolveData<IKcalOption[]>()
  })
