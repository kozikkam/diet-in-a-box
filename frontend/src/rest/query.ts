export type PaginatedQuery = {
  after: string
  limit: number
}

export type Order = 'ASC' | 'DESC'
export const ASC: Order = 'ASC'
export const DESC: Order = 'DESC'

export type SortedQuery = {
  sortBy: string
  orderBy: Order
}

export interface Query {
  pagination?: PaginatedQuery
  sort?: SortedQuery
}

export const buildQueryParams = (query: Query): Record<string, keyof any> => {
  let params: Record<string, keyof any> = {}
  if (query.pagination) {
    params = { ...query.pagination }
  }
  if (query.sort) {
    params.sort_by = query.sort.sortBy
    params.order_by = query.sort.orderBy
  }
  return params
}
