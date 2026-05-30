import fs from 'node:fs';

const source = 'Audit UI - Amya Signature.html';
const html = fs.readFileSync(source, 'utf8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);

if (!styleMatch || !bodyMatch) {
  throw new Error(`Could not extract <style> and <body> from ${source}`);
}

const css = styleMatch[1].trim();
const body = bodyMatch[1].trim();

fs.mkdirSync('src', { recursive: true });

fs.writeFileSync(
  'package.json',
  `${JSON.stringify(
    {
      scripts: {
        dev: 'vite',
        build: 'tsc --noEmit && vite build',
        preview: 'vite preview',
      },
      dependencies: {
        '@vitejs/plugin-react': '^4.3.4',
        vite: '^5.4.19',
        typescript: '^5.8.3',
        react: '^19.1.0',
        'react-dom': '^19.1.0',
      },
      devDependencies: {
        '@types/react': '^19.2.15',
        '@types/react-dom': '^19.2.3',
      },
    },
    null,
    2,
  )}\n`,
);

fs.writeFileSync(
  'index.html',
  `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Audit UI - Amya Signature</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Hanken+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&family=Caveat:wght@500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
);

fs.writeFileSync('src/styles.css', `${css}\n`);

fs.writeFileSync(
  'src/App.tsx',
  `const auditMarkup = ${JSON.stringify(body)};

export default function App() {
  return <div dangerouslySetInnerHTML={{ __html: auditMarkup }} />;
}
`,
);

fs.writeFileSync(
  'src/main.tsx',
  `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`,
);

fs.writeFileSync(
  'tsconfig.json',
  `${JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        useDefineForClassFields: true,
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        allowJs: false,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: 'ESNext',
        moduleResolution: 'Bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
      },
      include: ['src'],
    },
    null,
    2,
  )}\n`,
);

fs.writeFileSync(
  'tsconfig.node.json',
  `${JSON.stringify(
    {
      compilerOptions: {
        composite: true,
        skipLibCheck: true,
        module: 'ESNext',
        moduleResolution: 'Bundler',
        allowSyntheticDefaultImports: true,
        noEmit: true,
      },
      include: ['vite.config.ts'],
    },
    null,
    2,
  )}\n`,
);

fs.writeFileSync(
  'vite.config.ts',
  `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`,
);
