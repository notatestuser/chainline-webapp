/* global self */

import { generateEncryptedWif, decryptWIF } from 'chainline-js';

self.addEventListener('message', async ({ data }) => {
  const { operation, passphrase, privateKey, encryptedWif } = data;
  switch (operation) {
    case 'generateEncryptedWif':
      try {
        const account = await generateEncryptedWif(passphrase, privateKey);
        self.postMessage(account);
      } catch ({ message }) {
        self.postMessage({ error: message });
      }
      break;
    case 'decryptWif':
      try {
        const wif = await decryptWIF(encryptedWif, passphrase);
        self.postMessage({ wif });
      } catch ({ message }) {
        self.postMessage({ error: message });
      }
      break;
    default:
      console.warn('WalletWorker: invalid operation!', operation);
  }
});

