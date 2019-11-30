export interface IEdamamResponse {
  text: string;
  parsed: any[];
  hints: IEdamamHint[];
}

export interface IEdamamHint {
  food: IEdamamProduct;
}

export interface IEdamamProduct {
  foodId: string;
  label: string;
  nutrients: IEdamamNutrient;
  category: string;
  categoryLabel: string;
}

export interface IEdamamNutrient {
  ENERC_KCAL: number;
  PROCNT: number;
  FAT: number;
  CHOCDF: number;
}