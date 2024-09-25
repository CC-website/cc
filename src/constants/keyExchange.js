// keyExchange.js
import axios from 'axios';
import { generateKeys } from './signalUtils';

export async function exchangeKeys(userId) {
  const keys = await generateKeys();

  await axios.post(`${main_url}/messages/exchange_keys`, {
    user_id: userId,
    identity_key: keys.identityKey,
    signed_pre_key: keys.signedPreKey,
    pre_key: keys.preKey,
  });

  return keys;
}
