import { ID } from './id'

export const MEAL_TIME_LIST = [
  'breakfast',
  'morningSnack',
  'lunch',
  'afternoonSnack',
  'dinner',
] as const
export type MEAL_TIME = typeof MEAL_TIME_LIST[number]
export type DailyMeals = {
  [prop in MEAL_TIME]: ID | null
}

export type DailyDiet = {
  id: ID
  diet: ID
  dailyMeals: DailyMeals
  date: Date
}
