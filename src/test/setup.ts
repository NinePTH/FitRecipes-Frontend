import '@testing-library/jest-dom';

// Essential polyfills for Node.js test environment
if (typeof global !== 'undefined') {
  // TextEncoder/TextDecoder for jsdom
  if (!global.TextEncoder) {
    const { TextEncoder, TextDecoder } = require('util');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  }
  
  // URL constructor for Node.js
  if (!global.URL) {
    global.URL = require('url').URL;
  }
}
