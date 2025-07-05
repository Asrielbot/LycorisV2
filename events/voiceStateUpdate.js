// events/voiceStateUpdate.js
import handleVoiceStateUpdate from "../features/dynamicChannels.js";

export default async function (client, oldState, newState) {
  const config = client.config || {};

  if (config.dynamicChannels !== false) {
    await handleVoiceStateUpdate(client, oldState, newState);
  }
}
