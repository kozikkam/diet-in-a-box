export type DietOrder = {
  _id: string;
  dietId: string;
  customerId: string;
  dates: string[];
  kcal: number;
  cost: number;
  status: string;
  deliveryAddress: string;
  deliveryTime: string;
}
