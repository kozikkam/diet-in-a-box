from flask import Flask, render_template, request, jsonify
import logging
from logging import Formatter, FileHandler
import os
import pickle
from scipy.spatial import distance

app = Flask(__name__)
app.config.from_object("config")

# load model
with open('./data/daily_meals.pickle','rb') as f:
    daily_meal_ids, features = pickle.load(f)


@app.route("/")
def home():
    return "recommendations"


@app.route("/recommendations/<daily_meal_id>")
def recommend(daily_meal_id):
    observation_idx = daily_meal_ids.index(daily_meal_id)
    distances = distance.cdist([features[observation_idx]], features, "cosine").argsort()[0]
    return jsonify([daily_meal_ids[int(v)][:10] for v in distances])

if not app.debug:
    file_handler = FileHandler("error.log")
    file_handler.setFormatter(
        Formatter("%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]")
    )
    app.logger.setLevel(logging.INFO)
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.info("errors")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
