import { useMutate } from 'restful-react'
import { DietOrder } from 'src/models'

export const useCreateDietOrderMutation = () =>
    useMutate<any, any, any, CreateDietOrderMutation>({
        verb: "POST",
        path: `/diet-orders`,
    })

type CreateDietOrderMutation = Pick<DietOrder, "dietId" | "dates" | "kcal">
