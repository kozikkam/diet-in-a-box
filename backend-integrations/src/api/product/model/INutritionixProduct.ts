export interface INutritionixPhoto {
  thumb: string;
  highres: string;
  is_user_uploaded: boolean;
}

export interface INutritionixProduct {
  food_name: string;
  serving_unit: string;
  tag_name: string;
  serving_qty: number;
  common_type: string;
  tag_id: string;
  photo: INutritionixPhoto;
  locale: string;
}
