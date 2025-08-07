#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Função para corrigir aspas não escapadas em JSX
function fixUnescapedQuotes(content) {
  // Procura por texto entre tags que contém aspas duplas
  return content.replace(/>([^<]*)"([^"]*)"([^<]*)</g, (match, before, quoted, after) => {
    // Só substitui se não for um atributo JSX
    if (before.includes('=') || after.includes('=')) {
      return match;
    }
    return `>${before}&quot;${quoted}&quot;${after}<`;
  });
}

// Função para corrigir ponto e vírgula mal posicionados
function fixMisplacedSemicolons(content) {
  // Remove ponto e vírgula no final de linhas que não deveriam ter
  content = content.replace(/;\s*\n\s*([)}>\]])/g, '\n$1');
  
  // Remove ponto e vírgula antes de operadores
  content = content.replace(/;\s*\n\s*([|&?:])/g, '\n$1');
  
  return content;
}

// Função para corrigir comentários mal fechados
function fixBrokenComments(content) {
  // Corrige comentários de bloco que foram quebrados
  content = content.replace(/\/\/ \[\]\.(\w+)\(/g, '// [].forEach(item => {');
  content = content.replace(/\/\/ \}\)/g, '// });');
  
  return content;
}

// Função para corrigir imports faltantes
function fixMissingImports(content, filePath) {
  if (content.includes('PlusIcon') && !content.includes("import { PlusIcon }")) {
    content = content.replace(
      /import.*from ['"]@heroicons\/react\/24\/outline['"];?/,
      "import { PlusIcon } from '@heroicons/react/24/outline';"
    );
  }
  
  return content;
}

// Função para encontrar todos os arquivos JS/JSX
function findJSFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findJSFiles(fullPath, files);
    } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

console.log('🔧 Iniciando correção completa de erros de build...\n');

// Encontrar todos os arquivos JS/JSX
const allFiles = findJSFiles('./components');
const problematicFiles = [
  './components/AuctionManager.js',
  './components/AuthFixer.js', 
  './components/CostManager.js',
  './components/DirectInvoiceManager.js',
  './components/InteractiveDashboard.js',
  './components/InviteSystem.js',
  './components/LiveSaleEntry.js',
  './components/MarketPriceManager.js',
  './components/MaterialsManager.js',
  './components/reports/BreedAnalysis.js',
  './components/reports/MonthlyReport.js',
  './components/reports/RecommendationReports.js',
  './components/reproduction/FaseColeta.js',
  './components/reproduction/FaseSexagem.js',
  './components/reproduction/SemenStockManager.js',
  './components/SalesReport.js',
  './components/SmartGTAImporter.js',
  './components/UserManager.js'
];

problematicFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`📝 Corrigindo ${filePath}...`);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Aplicar todas as correções
      content = fixUnescapedQuotes(content);
      content = fixMisplacedSemicolons(content);
      content = fixBrokenComments(content);
      content = fixMissingImports(content, filePath);
      
      // Salvar arquivo corrigido
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${filePath} corrigido`);
      
    } catch (error) {
      console.error(`❌ Erro ao corrigir ${filePath}:`, error.message);
    }
  } else {
    console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
  }
});

console.log('\n🎉 Correção concluída!');
console.log('\n🧪 Testando build...');

try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✅ Build executado com sucesso!');
} catch (error) {
  console.log('\n❌ Ainda há erros no build. Verifique a saída acima.');
}