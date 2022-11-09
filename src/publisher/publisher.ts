import { MqttProvider } from "../commons/mqtt-provider";

const mqttProvider = new MqttProvider();

mqttProvider.publishSystemMetrics();
