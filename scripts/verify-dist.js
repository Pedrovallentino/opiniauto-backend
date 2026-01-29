import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
      if (file.endsWith('.js')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

function verifyImports() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`Directory ${DIST_DIR} does not exist. Run 'npm run build' first.`);
    process.exit(1);
  }

  const files = getAllFiles(DIST_DIR);
  let hasErrors = false;

  console.log(`Verifying imports in ${files.length} files...`);

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    // Match import/export ... from '...'
    const regex = /from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const importPath = match[1];

      // Ignorar imports de pacotes (não começam com ./ ou ../)
      if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
        continue;
      }

      const dir = path.dirname(file);
      const resolvedPath = path.resolve(dir, importPath);

      // Verificar se o arquivo existe
      // O importPath já deve ter extensão .js se for ESM, ou não se for CJS/TSUP handled.
      // Mas como convertemos para .js, esperamos que esteja lá.
      
      let exists = fs.existsSync(resolvedPath);
      
      if (!exists) {
         // Tentar adicionar .js caso não tenha (embora devesse ter)
         if (fs.existsSync(resolvedPath + '.js')) {
             // Se existe com .js mas o import não tem, é um erro em ESM nativo, mas ok em CJS
             // Vamos considerar erro se não encontrar exatamente como declarado OU com .js se omitido
             exists = true; 
         }
      }

      if (!exists) {
        console.error(`[ERROR] File: ${file}`);
        console.error(`        Import: ${importPath}`);
        console.error(`        Resolved: ${resolvedPath}`);
        console.error(`        Status: NOT FOUND`);
        hasErrors = true;
      }
    }
    
    // Check dynamic imports: import('...')
    const dynamicRegex = /import\(['"]([^'"]+)['"]\)/g;
    while ((match = dynamicRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (!importPath.startsWith('./') && !importPath.startsWith('../')) continue;
        
        const dir = path.dirname(file);
        const resolvedPath = path.resolve(dir, importPath);
        if (!fs.existsSync(resolvedPath)) {
            console.error(`[ERROR] File: ${file} (Dynamic Import)`);
            console.error(`        Import: ${importPath}`);
            console.error(`        Resolved: ${resolvedPath}`);
            hasErrors = true;
        }
    }
  });

  if (hasErrors) {
    console.error('\nVerification FAILED: Broken imports found.');
    process.exit(1);
  } else {
    console.log('\nVerification PASSED: All relative imports are valid.');
  }
}

verifyImports();
