/**
 * 生成补充数据集
 */

import SupplementalDatasetGenerator from './src/ai/SupplementalDatasetGenerator.js';

async function main() {
  console.log('🚀 生成补充数据集\n');
  console.log('目标：扩展数据集到 100+ 个示例\n');
  
  const generator = new SupplementalDatasetGenerator();
  const result = await generator.generateAll();
  
  if (result.success) {
    console.log('\\n📁 输出位置:');
    console.log(`   ${result.outputDir}/`);
    console.log('   - supplemental_code.json');
    console.log('   - supplemental_best_practices.json');
  }
}

main().catch(console.error);
