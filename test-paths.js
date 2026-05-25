/**
 * 测试不同路径格式
 */

import { promises as fs } from 'fs';
import path from 'path';

async function testPaths() {
  const paths = [
    'F:\\openclaw\\projects\\HarmonyOS\\HarmonyOS_Demo\\docs\\智慧客房 APP 项目需求.md',
    'F:/openclaw/projects/HarmonyOS/HarmonyOS_Demo/docs/智慧客房 APP 项目需求.md',
    path.join('F:', 'openclaw', 'projects', 'HarmonyOS', 'HarmonyOS_Demo', 'docs', '智慧客房 APP 项目需求.md'),
  ];
  
  for (const p of paths) {
    console.log(`\n测试路径：${p}`);
    try {
      const content = await fs.readFile(p, 'utf-8');
      console.log(`✅ 成功！长度：${content.length} 字符`);
    } catch (error) {
      console.log(`❌ 失败：${error.message}`);
    }
  }
}

testPaths().catch(console.error);
