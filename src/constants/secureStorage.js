import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

export async function saveEncryptedItem(key, value) {
    const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
    const timestamp = new Date().toISOString();
    const data = JSON.stringify({ encryptedValue, timestamp });
    await AsyncStorage.setItem(key, data);
}

export async function getEncryptedItem(key) {
    const data = await AsyncStorage.getItem(key);
    if (data) {
        const { encryptedValue, timestamp } = JSON.parse(data);
        const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY).toString(CryptoJS.enc.Utf8);
        return { value: decryptedValue, timestamp };
    }
    return null;
}
