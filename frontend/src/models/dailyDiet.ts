import { ID } from './id'

export const MEAL_TIME_KEYS = [
  'breakfast',
  'morningSnack',
  'lunch',
  'afternoonSnack',
  'dinner',
] as const
export type MEAL_TIME = typeof MEAL_TIME_KEYS[number]
export type DailyMeals = {
  [prop in MEAL_TIME]: ID | null
}

export type DailyDiet = {
  _id: ID
  diet: ID
  dailyMeals: DailyMeals
  date: Date
}
