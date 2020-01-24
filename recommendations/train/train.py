# pulls & stores daily meals

import pymongo
from dotenv import load_dotenv
import os
import numpy as np
import pickle

load_dotenv()

client = pymongo.MongoClient(os.environ.get("DB_URL"))
db = client.get_default_database()

# print(db.list_collection_names())
mealsAggregation = [
    {
        "$lookup": {
            "from": "meals",
            "localField": "dailyMeals.breakfast",
            "foreignField": "_id",
            "as": "dailyMeals.breakfast",
        }
    },
    {"$unwind": "$dailyMeals.breakfast"},
    {
        "$lookup": {
            "from": "meals",
            "localField": "dailyMeals.morningSnack",
            "foreignField": "_id",
            "as": "dailyMeals.morningSnack",
        }
    },
    {"$unwind": "$dailyMeals.morningSnack"},
    {
        "$lookup": {
            "from": "meals",
            "localField": "dailyMeals.lunch",
            "foreignField": "_id",
            "as": "dailyMeals.lunch",
        }
    },
    {"$unwind": "$dailyMeals.lunch"},
    {
        "$lookup": {
            "from": "meals",
            "localField": "dailyMeals.afternoonSnack",
            "foreignField": "_id",
            "as": "dailyMeals.afternoonSnack",
        }
    },
    {"$unwind": "$dailyMeals.afternoonSnack"},
    {
        "$lookup": {
            "from": "meals",
            "localField": "dailyMeals.dinner",
            "foreignField": "_id",
            "as": "dailyMeals.dinner",
        }
    },
    {"$unwind": "$dailyMeals.dinner"},
]

flatten = lambda l: [item for sublist in l for item in sublist]

# find all ingredients
all_ingredients = set()
num_meals = 0
for item in db.dailydiets.aggregate(mealsAggregation):
  num_meals = num_meals + 1
  ingredients = set(flatten([[i['productId'] for i in v['ingredients']] for _, v in item['dailyMeals'].items()]))
  all_ingredients.update(ingredients)
all_ingredients = list(all_ingredients)

# create observation vectors
daily_meal_ids = []
features = np.zeros((num_meals, len(all_ingredients)))
for i, item in enumerate(db.dailydiets.aggregate(mealsAggregation)):
  ingredients = set(flatten([[i['productId'] for i in v['ingredients']] for _, v in item['dailyMeals'].items()]))
  for ingredient in ingredients:
      idx = all_ingredients.index(ingredient)
      features[i, idx] = 1
  daily_meal_ids.append(item['_id'])

with open('../data/daily_meals.pickle','wb') as f:
    pickle.dump((daily_meal_ids, features), f)

print(f"saved {len(daily_meal_ids)} daily meals")
print(daily_meal_ids)
print(features)
