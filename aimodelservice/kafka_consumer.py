from kafka import KafkaConsumer
import json

def start_consumer():
    consumer = KafkaConsumer(
        'course-validated',                 # Topic à écouter
        bootstrap_servers='localhost:9092', # Adresse Kafka
        auto_offset_reset='earliest',       # Lire depuis le début si pas de commit offset
        group_id='aimodel-group',            # Groupe de consommateurs
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))  # Désérialisation JSON
    )

    print("🧠 AIModelService écoute les events 'course-validated'...")

    for message in consumer:
        data = message.value
        print(f"📩 Reçu un event : {data}")
        # Ici tu peux déclencher :
        # - réentraînement modèle
        # - mise à jour recommandations
        # - autre logique IA

if __name__ == "__main__":
    start_consumer()
