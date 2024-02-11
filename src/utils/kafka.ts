import { Kafka, type Producer } from "kafkajs";
import { MESSAGES_KAFKA_TOPIC } from "./constants";

const kafka = new Kafka({
  brokers: [""],
});

let producer: null | Producer = null;

export async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message: string) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: MESSAGES_KAFKA_TOPIC,
  });
  return true;
}

// !TODO
export async function startMessageConsumer() {
  console.log("Consumer is running..");
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({
    topic: MESSAGES_KAFKA_TOPIC,
    fromBeginning: true,
  });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      console.log(`New Message Recv..`);
      try {
        // add message to the database
        // !TODO
      } catch (err) {
        console.log("Something is wrong");
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: MESSAGES_KAFKA_TOPIC }]);
        }, 60 * 1000);
      }
    },
  });
}
export default kafka;
