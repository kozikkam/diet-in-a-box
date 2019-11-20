import { useGet } from 'restful-react'
import { Query, buildQueryParams } from './query'
import { Diet } from 'src/models'

interface DietsQuery extends Query {}

export default (query: DietsQuery) =>
  useGet<Diet[]>({
    path: `/diets`,
    queryParams: buildQueryParams(query),
  })
