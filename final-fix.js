#!/usr/bin/env node

const fs = require('fs');

// Lista de arquivos problemáticos e suas correções específicas
const fixes = [
  {
    file: 'components/AuctionManager.js',
    fixes: [
      {
        search: /animal\.raca\?\.toLowerCase\(\)\.includes\(searchLower\)\s*animal\.nome/g,
        replace: 'animal.raca?.toLowerCase().includes(searchLower) ||\n          animal.nome'
      }
    ]
  },
  {
    file: 'components/CostManager.js',
    fixes: [
      {
        search: /className="text-sm text-gray-600 dark:text-gray-400">\s*{new Date\(cost\.data\)\.toLocaleDateString\('pt-BR'\)}\s*<\/div>/g,
        replace: 'className="text-sm text-gray-600 dark:text-gray-400">\n                        {new Date(cost.data).toLocaleDateString(\'pt-BR\')}\n                      </div>'
      }
    ]
  },
  {
    file: 'components/InteractiveDashboard.js',
    fixes: [
      {
        search: /\}\)\)\.sort\(\(a, b\) => b\.custo - a\.custo\)$/m,
        replace: '})).sort((a, b) => b.custo - a.custo);'
      }
    ]
  }
];

console.log('🔧 Aplicando correções finais...\n');

fixes.forEach(({ file, fixes: fileFixes }) => {
  if (fs.existsSync(file)) {
    console.log(`📝 Corrigindo ${file}...`);
    
    try {
      let content = fs.readFileSync(file, 'utf8');
      
      fileFixes.forEach(({ search, replace }) => {
        content = content.replace(search, replace);
      });
      
      // Correções gerais
      content = content.replace(/;\s*\n\s*([|&?:])/g, '\n$1');
      content = content.replace(/;\s*\n\s*([)}>\]])/g, '\n$1');
      content = content.replace(/\n\s*;\s*\n/g, '\n');
      
      fs.writeFileSync(file, content);
      console.log(`✅ ${file} corrigido`);
      
    } catch (error) {
      console.error(`❌ Erro ao corrigir ${file}:`, error.message);
    }
  }
});

// Correção global para remover ponto e vírgula mal posicionados
const globalFiles = [
  'components/MarketPriceManager.js',
  'components/MaterialsManager.js', 
  'components/reports/BreedAnalysis.js',
  'components/reports/MonthlyReport.js',
  'components/reports/RecommendationReports.js',
  'components/reproduction/SemenStockManager.js',
  'components/SalesReport.js'
];

globalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`🔧 Limpeza global em ${file}...`);
    
    try {
      let content = fs.readFileSync(file, 'utf8');
      
      // Remove ponto e vírgula mal posicionados
      content = content.replace(/;\s*\n\s*([|&?:)])/g, '\n$1');
      content = content.replace(/;\s*\n\s*([)}>\]])/g, '\n$1');
      content = content.replace(/\n\s*;\s*\n/g, '\n');
      
      // Corrige strings não terminadas
      content = content.replace(/(['"])[^'"]*\n[^'"]*\1/g, (match) => {
        return match.replace(/\n/g, ' ');
      });
      
      fs.writeFileSync(file, content);
      console.log(`✅ ${file} limpo`);
      
    } catch (error) {
      console.error(`❌ Erro na limpeza de ${file}:`, error.message);
    }
  }
});

console.log('\n🎉 Correções finais aplicadas!');