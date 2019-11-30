export interface IProduct extends INutritionValues {
  name: string;
  photo: string;
}

export interface INutritionValues {
  kcal: number;
  protein: number;
  carbohydrate: number;
  fat: number;
  fibre: number;
}
