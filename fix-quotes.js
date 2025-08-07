#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixQuotesInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  console.log(`🔧 Corrigindo aspas em ${filePath}...`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Corrigir &quot; em atributos JSX (onde deveria ser aspas normais)
    content = content.replace(/className=&quot;([^"]*?)&quot;/g, 'className="$1"');
    content = content.replace(/id=&quot;([^"]*?)&quot;/g, 'id="$1"');
    content = content.replace(/type=&quot;([^"]*?)&quot;/g, 'type="$1"');
    content = content.replace(/placeholder=&quot;([^"]*?)&quot;/g, 'placeholder="$1"');
    content = content.replace(/value=&quot;([^"]*?)&quot;/g, 'value="$1"');
    content = content.replace(/href=&quot;([^"]*?)&quot;/g, 'href="$1"');
    content = content.replace(/src=&quot;([^"]*?)&quot;/g, 'src="$1"');
    content = content.replace(/alt=&quot;([^"]*?)&quot;/g, 'alt="$1"');
    content = content.replace(/title=&quot;([^"]*?)&quot;/g, 'title="$1"');
    content = content.replace(/name=&quot;([^"]*?)&quot;/g, 'name="$1"');
    content = content.replace(/role=&quot;([^"]*?)&quot;/g, 'role="$1"');
    content = content.replace(/onClick=&quot;([^"]*?)&quot;/g, 'onClick="$1"');
    content = content.replace(/onChange=&quot;([^"]*?)&quot;/g, 'onChange="$1"');
    
    // Corrigir strings quebradas
    content = content.replace(/(['"])[^'"]*\n[^'"]*\1/g, (match) => {
      return match.replace(/\n\s*/g, ' ');
    });
    
    // Adicionar ponto e vírgula faltantes
    content = content.replace(/^(\s*)(const|let|var|return)\s+[^;]+$/gm, '$1$2$3;');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${filePath} corrigido`);
    
  } catch (error) {
    console.error(`❌ Erro ao corrigir ${filePath}:`, error.message);
  }
}

const files = [
  'components/AuctionManager.js',
  'components/CostManager.js', 
  'components/InteractiveDashboard.js',
  'components/MarketPriceManager.js',
  'components/MaterialsManager.js',
  'components/reports/BreedAnalysis.js',
  'components/reports/RecommendationReports.js',
  'components/reproduction/SemenStockManager.js',
  'components/SalesReport.js'
];

console.log('🔧 Corrigindo problemas de aspas e sintaxe...\n');

files.forEach(fixQuotesInFile);

console.log('\n🎉 Correção de aspas concluída!');