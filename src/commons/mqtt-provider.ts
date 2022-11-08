import mqtt from "mqtt";
import { config } from "dotenv";
config();

export class MqttProvider {
  private host = "broker.emqx.io";
  private port = "1883";
  private topic = "/nodejs/mqtt";
  private clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
  private connectUrl = `mqtt://${this.host}:${this.port}`;

  private client = mqtt.connect(this.connectUrl, {
    clientId: this.clientId,
    clean: true,
    connectTimeout: 4000,
    username: "emqx",
    password: "public",
    reconnectPeriod: 1000,
  });
  
  async publishMessage(message: Object): Promise<void> {
    this.client.on("connect", async () => {
      console.log("Connected");
      
      await this.client.publish(
        this.topic,
        JSON.stringify(message),
        { qos: 0, retain: false },
        (error) => {
          if (error) {
            console.error(error);
          }
        }
      );

      this.client.end(true);
    });
  }

  async subscribeTopic() {
    this.client.on("connect", () => {
      console.log("Connected");
      
      this.client = this.client.subscribe([this.topic], () => {
        console.log(`Subscribe to topic '${this.topic}'`);
      });
      
      this.client.on("message", (topic, payload) => {
        console.log("Received Message:", topic, JSON.parse(payload.toString()));
      });
    });

  }
}