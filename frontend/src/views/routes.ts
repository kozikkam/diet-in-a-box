export const RouteBuilder = {
  toIndex: () => '/',
  toDashboard: () => '/panel',
  toLogin: () => `/login`,
  toLogout: () => `/logout`,
  toDietList: () => `${RouteBuilder.toDashboard()}/diets`,
  toDiet: (dietId: string) => `${RouteBuilder.toDietList()}/${dietId}`,
}
