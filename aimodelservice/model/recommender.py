import pandas as pd
import json
from sklearn.neighbors import NearestNeighbors

class Recommender:
    def __init__(self):
        self.df = pd.read_csv("data/dummy_data.csv")
        self.course_names = self.load_course_names()
        self.model = NearestNeighbors(n_neighbors=3, metric='cosine')
        self.train_model()

    def load_course_names(self):
        with open("courses.json", "r") as f:
            return json.load(f)

    def train_model(self):
        self.course_matrix = self.df.drop("user_id", axis=1).fillna(0)
        self.model.fit(self.course_matrix)

    def recommend(self, user_vector):
        distances, indices = self.model.kneighbors([user_vector])
        recommendations = []
        for idx in indices[0]:
            course_id = str(self.course_matrix.columns[idx])
            course_name = self.course_names.get(course_id, f"Cours ({course_id})")
            recommendations.append({"id": course_id, "name": course_name})
        return recommendations
