/**
 * 合并所有数据集
 */

import fs from 'fs';
import path from 'path';

async function mergeDatasets() {
  console.log('🔀 合并数据集...\n');
  
  const datasetsDir = path.join(process.cwd(), 'datasets');
  
  // 读取基础数据集
  const baseCode = JSON.parse(fs.readFileSync(
    path.join(datasetsDir, 'code_dataset.json'),
    'utf-8'
  ));
  
  const baseBestPractices = JSON.parse(fs.readFileSync(
    path.join(datasetsDir, 'best_practices_dataset.json'),
    'utf-8'
  ));
  
  // 读取补充数据集
  const supplementalCode = JSON.parse(fs.readFileSync(
    path.join(datasetsDir, 'supplemental', 'extended_code_examples.json'),
    'utf-8'
  ));
  
  const supplementalBestPractices = JSON.parse(fs.readFileSync(
    path.join(datasetsDir, 'supplemental', 'real_world_best_practices.json'),
    'utf-8'
  ));
  
  // 合并
  const mergedCode = [...baseCode, ...supplementalCode];
  const mergedBestPractices = [...baseBestPractices, ...supplementalBestPractices];
  
  // 保存合并后的数据集
  fs.writeFileSync(
    path.join(datasetsDir, 'merged_code_dataset.json'),
    JSON.stringify(mergedCode, null, 2),
    'utf-8'
  );
  
  fs.writeFileSync(
    path.join(datasetsDir, 'merged_best_practices.json'),
    JSON.stringify(mergedBestPractices, null, 2),
    'utf-8'
  );
  
  // 统计
  console.log('📊 合并完成统计:');
  console.log('='.repeat(70));
  console.log(`基础代码示例：${baseCode.length} 个`);
  console.log(`补充代码示例：${supplementalCode.length} 个`);
  console.log(`合并后代码示例：${mergedCode.length} 个`);
  console.log('');
  console.log(`基础最佳实践：${baseBestPractices.length} 个`);
  console.log(`补充最佳实践：${supplementalBestPractices.length} 个`);
  console.log(`合并后最佳实践：${mergedBestPractices.length} 个`);
  console.log('');
  console.log(`总样本数：${mergedCode.length + mergedBestPractices.length} 个`);
  console.log('='.repeat(70));
  console.log('\n✅ 数据集合并完成！');
  console.log('\n📁 输出文件:');
  console.log(`   ${datasetsDir}/merged_code_dataset.json`);
  console.log(`   ${datasetsDir}/merged_best_practices.json`);
}

mergeDatasets().catch(console.error);
