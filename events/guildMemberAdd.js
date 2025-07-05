// events/guildMemberAdd.js
import onboarding from "../features/onboarding.js";
import createPrivateNotesChannel from "../features/notes.js";

export default async function (client, member) {
  const config = client.config || {};

  if (config.onboarding !== false) {
    await onboarding(client, member);
  }

  if (config.notes !== false) {
    await createPrivateNotesChannel(client, member);
  }
}
