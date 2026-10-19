const gTTS = require('gtts');

/** MP3 tiếng Việt qua Google TTS (cần internet). */
function speakViBuffer(text) {
  const clean = String(text).trim().slice(0, 250);
  if (!clean) return Promise.resolve(Buffer.alloc(0));
  return new Promise((resolve, reject) => {
    const g = new gTTS(clean, 'vi');
    const stream = g.stream();
    const chunks = [];
    stream.on('data', (c) => chunks.push(c));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

module.exports = { speakViBuffer };
