import SignalProtocolStore from 'react-native-signal-protocol';
import { saveEncryptedItem, getEncryptedItem } from './secureStorage';

const store = new SignalProtocolStore();

export async function generateKeys() {
    const identityKeyPair = await store.createIdentityKeyPair();
    const registrationId = await store.createRegistrationId();
    const preKeys = await store.createPreKeys(100);
    const signedPreKey = await store.createSignedPreKey();

    return {
        identityKey: identityKeyPair.pubKey,
        signedPreKey: signedPreKey.keyPair.pubKey,
        preKey: preKeys[0].keyPair.pubKey,
    };
}

export async function generateSessionKeys(receiverId) {
    const sessionCipher = await store.createSessionCipher(receiverId);
    const sessionKeys = sessionCipher.sessionKey; // This is a placeholder; actual key extraction depends on implementation
    const sessionKeyHex = sessionKeys.toString('hex');
    const timestamp = new Date().toISOString();
    await saveEncryptedItem(`sessionKey-${receiverId}`, JSON.stringify({ sessionKey: sessionKeyHex, timestamp }));
    return sessionKeyHex;
}

export async function encryptMessage(receiverId, plaintext) {
    const sessionCipher = await store.createSessionCipher(receiverId);
    const ciphertext = await sessionCipher.encrypt(plaintext);
    return ciphertext;
}

export async function decryptMessage(senderId, ciphertext) {
    const sessionCipher = await store.createSessionCipher(senderId);
    const plaintext = await sessionCipher.decrypt(ciphertext);
    return plaintext;
}

export async function getSessionKey(receiverId) {
    const data = await getEncryptedItem(`sessionKey-${receiverId}`);
    if (data) {
        return JSON.parse(data.value);
    }
    return null;
}
