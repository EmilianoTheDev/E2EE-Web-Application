const encoder = new TextEncoder();
const decoder = new TextDecoder();
const algorithm = 'AES-GCM';
const keySalt = 'e2ee-chat-demo-salt';

const toBase64 = (buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)));

const fromBase64 = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

const getRoomKey = async (room) => {
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(room),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(keySalt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: algorithm, length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
};

export const encryptMessage = async (message, room) => {
  const key = await getRoomKey(room);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: algorithm, iv },
    key,
    encoder.encode(message),
  );

  return JSON.stringify({
    encrypted: true,
    iv: toBase64(iv),
    text: toBase64(encrypted),
  });
};

export const decryptMessage = async (payload, room) => {
  const message = JSON.parse(payload);

  if (!message.encrypted) {
    return payload;
  }

  const key = await getRoomKey(room);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: algorithm, iv: fromBase64(message.iv) },
    key,
    fromBase64(message.text),
  );

  return decoder.decode(decrypted);
};
