#!/usr/bin/env node

/**
 * 数据集质量验证脚本
 * 验证完整代码数据集的质量和完整性
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载数据集
const datasetPath = path.join(__dirname, 'datasets', 'complete_code_dataset.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));

console.log('='.repeat(80));
console.log('数据集质量验证报告');
console.log('='.repeat(80));
console.log();

// 1. 基础统计
console.log('📊 基础统计');
console.log('-'.repeat(80));
console.log(`数据集名称：${dataset.metadata.name}`);
console.log(`版本：${dataset.metadata.version}`);
console.log(`总样本数：${dataset.samples.length}`);
console.log(`语言类型：${dataset.metadata.language}`);
console.log(`分类数量：${dataset.metadata.categories.length}`);
console.log();

// 2. 分类分布
console.log('📁 分类分布');
console.log('-'.repeat(80));
const categoryCount = {};
dataset.samples.forEach(sample => {
  const cat = sample.category;
  categoryCount[cat] = (categoryCount[cat] || 0) + 1;
});

Object.entries(categoryCount)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    const percentage = ((count / dataset.samples.length) * 100).toFixed(1);
    console.log(`${cat.padEnd(20)} ${count.toString().padStart(3)}  (${percentage}%)`);
  });
console.log();

// 3. 语言分布
console.log('🌐 语言分布');
console.log('-'.repeat(80));
const languageCount = {};
dataset.samples.forEach(sample => {
  const lang = sample.language;
  languageCount[lang] = (languageCount[lang] || 0) + 1;
});

Object.entries(languageCount)
  .sort((a, b) => b[1] - a[1])
  .forEach(([lang, count]) => {
    const percentage = ((count / dataset.samples.length) * 100).toFixed(1);
    console.log(`${lang.padEnd(20)} ${count.toString().padStart(3)}  (${percentage}%)`);
  });
console.log();

// 4. 难度分布
console.log('📈 难度分布');
console.log('-'.repeat(80));
const difficultyCount = {};
dataset.samples.forEach(sample => {
  const diff = sample.difficulty || 'unspecified';
  difficultyCount[diff] = (difficultyCount[diff] || 0) + 1;
});

Object.entries(difficultyCount)
  .sort((a, b) => b[1] - a[1])
  .forEach(([diff, count]) => {
    const percentage = ((count / dataset.samples.length) * 100).toFixed(1);
    console.log(`${diff.padEnd(20)} ${count.toString().padStart(3)}  (${percentage}%)`);
  });
console.log();

// 5. 质量评分分析
console.log('⭐ 质量评分分析');
console.log('-'.repeat(80));
const qualityScores = dataset.samples.map(s => s.quality || 0);
const avgQuality = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length;
const minQuality = Math.min(...qualityScores);
const maxQuality = Math.max(...qualityScores);
const highQuality = qualityScores.filter(q => q >= 95).length;
const mediumQuality = qualityScores.filter(q => q >= 90 && q < 95).length;
const lowQuality = qualityScores.filter(q => q < 90).length;

console.log(`平均质量评分：${avgQuality.toFixed(1)}/100`);
console.log(`最低质量评分：${minQuality}`);
console.log(`最高质量评分：${maxQuality}`);
console.log();
console.log(`高质量 (≥95):  ${highQuality.toString().padStart(3)}  (${((highQuality/dataset.samples.length)*100).toFixed(1)}%)`);
console.log(`中等质量 (90-95): ${mediumQuality.toString().padStart(3)}  (${((mediumQuality/dataset.samples.length)*100).toFixed(1)}%)`);
console.log(`低质量 (<90):   ${lowQuality.toString().padStart(3)}  (${((lowQuality/dataset.samples.length)*100).toFixed(1)}%)`);
console.log();

// 6. 标签分析
console.log('🏷️ 热门标签');
console.log('-'.repeat(80));
const tagCount = {};
dataset.samples.forEach(sample => {
  if (sample.tags) {
    sample.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  }
});

const topTags = Object.entries(tagCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);

topTags.forEach(([tag, count], index) => {
  console.log(`${(index + 1).toString().padStart(2)}. ${tag.padEnd(25)} ${count} 次`);
});
console.log();

// 7. 完整性检查
console.log('✅ 完整性检查');
console.log('-'.repeat(80));
let issues = 0;

dataset.samples.forEach((sample, index) => {
  if (!sample.id) {
    console.log(`❌ 样本 #${index} 缺少 id`);
    issues++;
  }
  if (!sample.code) {
    console.log(`❌ 样本 #${index} 缺少 code`);
    issues++;
  }
  if (!sample.title) {
    console.log(`❌ 样本 #${index} 缺少 title`);
    issues++;
  }
  if (!sample.category) {
    console.log(`❌ 样本 #${index} 缺少 category`);
    issues++;
  }
});

if (issues === 0) {
  console.log('✅ 所有样本完整');
} else {
  console.log(`⚠️  发现 ${issues} 个问题`);
}
console.log();

// 8. 代码质量检查
console.log('🔍 代码质量检查');
console.log('-'.repeat(80));
let emptyCode = 0;
let shortCode = 0;
let longCode = 0;

dataset.samples.forEach(sample => {
  const code = sample.code || '';
  const lines = code.split('\n').length;
  
  if (lines === 0) emptyCode++;
  else if (lines < 10) shortCode++;
  else if (lines > 100) longCode++;
});

console.log(`空代码：${emptyCode}`);
console.log(`短代码 (<10 行): ${shortCode}`);
console.log(`长代码 (>100 行): ${longCode}`);
console.log(`适中代码 (10-100 行): ${dataset.samples.length - emptyCode - shortCode - longCode}`);
console.log();

// 9. 重复检查
console.log('🔄 重复检查');
console.log('-'.repeat(80));
const idSet = new Set();
const duplicateIds = [];

dataset.samples.forEach(sample => {
  if (idSet.has(sample.id)) {
    duplicateIds.push(sample.id);
  }
  idSet.add(sample.id);
});

if (duplicateIds.length === 0) {
  console.log('✅ 无重复 ID');
} else {
  console.log(`⚠️  发现 ${duplicateIds.length} 个重复 ID: ${duplicateIds.slice(0, 5).join(', ')}`);
}
console.log();

// 10. 总结
console.log('📋 总结');
console.log('='.repeat(80));
console.log(`✅ 数据集规模：${dataset.samples.length} 个样本`);
console.log(`✅ 平均质量：${avgQuality.toFixed(1)}/100`);
console.log(`✅ 分类覆盖：${Object.keys(categoryCount).length} 个分类`);
console.log(`✅ 语言覆盖：${Object.keys(languageCount).length} 种语言`);
console.log(`✅ 完整性：${((dataset.samples.length - issues) / dataset.samples.length * 100).toFixed(1)}%`);
console.log();

if (avgQuality >= 90 && dataset.samples.length >= 100) {
  console.log('🎉 数据集质量优秀！符合生产标准。');
} else if (avgQuality >= 80 && dataset.samples.length >= 50) {
  console.log('✓ 数据集质量良好，可用于训练。');
} else {
  console.log('⚠️  数据集需要进一步改进。');
}

console.log();
console.log('='.repeat(80));
