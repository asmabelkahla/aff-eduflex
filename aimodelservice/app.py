from flask import Flask, request, jsonify
from model.recommender import Recommender

app = Flask(__name__)
recommender = Recommender()

@app.route("/recommend", methods=["POST"])
def recommend_courses():
    data = request.json
    user_vector = data.get("user_vector")

    if not user_vector:
        return jsonify({"error": "Missing user_vector"}), 400

    results = recommender.recommend(user_vector)
    return jsonify({"recommended_courses": results})

if __name__ == "__main__":
    app.run(port=5002, debug=True)
