// events/messageCreate.js
/*
import faqResponder from "../features/faq.js";

export default async function (client, message) {
  const config = client.config || {};

  if (config.faq !== false) {
    await faqResponder(client, message);
  }
}
*/

import faqResponder from "../features/faq.js";

export default async function (client, message) {
  await faqResponder(client, message);
}
