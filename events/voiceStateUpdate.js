// events/voiceStateUpdate.js
import handleDynamicChannels from "../features/dynamicChannels.js";

export default async function (client, oldState, newState) {
  const config = client.config || {};

  if (config.dynamicChannels !== false) {
    await handleDynamicChannels(client, oldState, newState);
  }
}
