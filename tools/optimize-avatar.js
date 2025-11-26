const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

(async () => {
  try {
    const root = path.resolve(__dirname, '..');
    const src = path.join(root, 'assets', 'avatar.jpg');
    if (!fs.existsSync(src)) {
      console.error('Source avatar not found at', src);
      process.exit(2);
    }

    const out1 = path.join(root, 'assets', 'avatar-400.jpg');
    const out2 = path.join(root, 'assets', 'avatar-800.jpg');

    await sharp(src)
      .resize(400, 400, { fit: 'cover' })
      .jpeg({ quality: 82, progressive: true })
      .toFile(out1);

    await sharp(src)
      .resize(800, 800, { fit: 'cover' })
      .jpeg({ quality: 82, progressive: true })
      .toFile(out2);

    console.log('Optimized avatars written:', out1, out2);
  } catch (err) {
    console.error('Error optimizing avatar:', err);
    process.exit(1);
  }
})();
