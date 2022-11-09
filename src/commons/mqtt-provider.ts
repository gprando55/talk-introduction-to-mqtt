import mqtt from "mqtt";
import { config } from "dotenv";
import { getSystemData } from "./os";
import { waitSeconds } from "./delay";
import { elasticClient } from "./elastic";
config();

export class MqttProvider {
  private host = "broker.emqx.io";
  private port = "1883";
  private topic = "/talk/mqtt";
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

  async publishSystemMetrics(): Promise<void> {
    this.client.on("connect", async () => {
      console.log("Connected");
      while (1) {
        const message = getSystemData();
        await this.client.publish(
          this.topic,
          JSON.stringify({...message, date: new Date()}),
          { qos: 0, retain: false },
          (error) => {
            if (error) {
              console.error(error);
            }
          }
          );
        await waitSeconds();
      }
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
        const message = JSON.parse(payload.toString());
        console.log("Received Message:", topic, message);

        elasticClient.index({
          index: 'system-stats',
          body: message,
          type:"json"
        })
      });
    });

  }
}