const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'tracking-service',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function sendValidationEvent(user_id, course_id) {
  await producer.connect();
  await producer.send({
    topic: 'course-validated',
    messages: [
      { value: JSON.stringify({ user_id, course_id }) }
    ],
  });
  console.log('📤 Event envoyé à Kafka :', { user_id, course_id });
  await producer.disconnect();
}

module.exports = sendValidationEvent;
