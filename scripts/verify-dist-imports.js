import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

function verifyImports() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`Dist directory not found at ${DIST_DIR}. Please run 'npm run build' first.`);
    process.exit(1);
  }

  const files = getAllFiles(DIST_DIR);
  const jsFiles = files.filter(file => file.endsWith('.js'));
  let hasErrors = false;

  console.log(`Verifying imports in ${jsFiles.length} files...`);

  jsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const importRegex = /from\s+['"]([^'"]+)['"]/g;
    const dynamicImportRegex = /import\s*\(['"]([^'"]+)['"]\)/g;
    let match;

    const checkPath = (importPath) => {
      if (importPath.startsWith('.')) {
        const absolutePath = path.resolve(path.dirname(file), importPath);
        if (!fs.existsSync(absolutePath)) {
           console.error(`[ERROR] File: ${path.relative(process.cwd(), file)}`);
           console.error(`        Broken import: "${importPath}" -> ${absolutePath} not found`);
           hasErrors = true;
        }
      }
    };

    while ((match = importRegex.exec(content)) !== null) {
      checkPath(match[1]);
    }
    
    while ((match = dynamicImportRegex.exec(content)) !== null) {
      checkPath(match[1]);
    }
  });

  if (hasErrors) {
    console.error('\n❌ Verification failed! Found broken imports.');
    process.exit(1);
  } else {
    console.log('\n✅ All imports verified successfully!');
  }
}

verifyImports();
