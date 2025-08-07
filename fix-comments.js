#!/usr/bin/env node

const fs = require('fs');

function fixBrokenComments(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  console.log(`🔧 Corrigindo comentários em ${filePath}...`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Corrigir comentários de código que foram quebrados
    // Padrão: // [].alguma_coisa seguido de código não comentado
    content = content.replace(/\/\/ \[\]\.([^(]+\([^)]*\) => \{[^}]*\n[^/][^}]*\}[^)]*\)[^;]*)/g, (match) => {
      // Comentar todas as linhas do bloco
      return match.split('\n').map(line => line.startsWith('//') ? line : '        // ' + line.trim()).join('\n');
    });
    
    // Corrigir linhas soltas que deveriam estar comentadas
    content = content.replace(/^(\s+)([a-zA-Z_][a-zA-Z0-9_]*:\s*[^,\n]+,?\s*)$/gm, (match, indent, code) => {
      // Se a linha anterior é um comentário, comentar esta também
      const lines = content.split('\n');
      const currentIndex = lines.findIndex(line => line.includes(code));
      if (currentIndex > 0 && lines[currentIndex - 1].trim().startsWith('//')) {
        return indent + '// ' + code.trim();
      }
      return match;
    });
    
    // Adicionar ponto e vírgula em linhas que terminam com )
    content = content.replace(/^(\s*\/\/.*\)\s*)$/gm, '$1;');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${filePath} corrigido`);
    
  } catch (error) {
    console.error(`❌ Erro ao corrigir ${filePath}:`, error.message);
  }
}

const files = [
  'components/InteractiveDashboard.js',
  'components/reports/BreedAnalysis.js',
  'components/reports/RecommendationReports.js'
];

console.log('🔧 Corrigindo comentários mal estruturados...\n');

files.forEach(fixBrokenComments);

console.log('\n🎉 Correção de comentários concluída!');