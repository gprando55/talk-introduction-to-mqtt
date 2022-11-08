import { waitSeconds } from "../commons/delay";
import { MqttProvider } from "../commons/mqtt-provider";
import { getSystemData } from "../commons/os";

const mqttProvider = new MqttProvider();

(async () => {
  
  while (1) {
    
    const systemData = getSystemData();

    mqttProvider.publishMessage(systemData);
    
    await waitSeconds();
  }
})()

