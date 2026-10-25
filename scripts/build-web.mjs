import { cpSync, mkdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'manifest.webmanifest', 'sw.js']) {
  cpSync(file, `dist/${file}`);
}
cpSync('assets', 'dist/assets', { recursive: true, force: true });
console.log('MijnMoment webbestanden staan in dist/.');
