
async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    'raw', 
    encoder.encode(password), 
    { name: 'PBKDF2' },
    false, 
    ['deriveKey']
  );
  
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    { name: 'AES-GCM', length: 256 },
    false, 
    ['encrypt', 'decrypt']
  );
}


export async function hashPassword(password: string) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const hashedPassword = await deriveKeyFromPassword(password, salt);
  
  const exportedKey = await window.crypto.subtle.exportKey('raw', hashedPassword);
  const hashArray = Array.from(new Uint8Array(exportedKey));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  

  return `${Array.from(salt).map(byte => byte.toString(16).padStart(2, '0')).join('')}:${hashHex}`;
}


export async function comparePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
  const [storedSaltHex, storedHashedPasswordHex] = storedPassword.split(':');
  const salt = new Uint8Array(storedSaltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  
  const hashedInputPassword = await deriveKeyFromPassword(inputPassword, salt);
  
  const exportedKey = await window.crypto.subtle.exportKey('raw', hashedInputPassword);
  const hashArray = Array.from(new Uint8Array(exportedKey));
  const hashedInputPasswordHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  
  return storedHashedPasswordHex === hashedInputPasswordHex;
}
