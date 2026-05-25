/**
 * 测试从不同 cwd 读取中文路径
 */

import { promises as fs } from 'fs';
import path from 'path';

async function testFromCwd(cwd) {
  console.log(`\n当前目录：${cwd}`);
  process.chdir(cwd);
  console.log(`实际目录：${process.cwd()}`);
  
  const relativePath = path.join('..', '..', 'projects', 'HarmonyOS', 'HarmonyOS_Demo', 'docs', '智慧客房 APP 项目需求.md');
  const absolutePath = 'F:\\openclaw\\projects\\HarmonyOS\\HarmonyOS_Demo\\docs\\智慧客房APP项目需求.md';
  
  console.log(`\n相对路径：${relativePath}`);
  try {
    const content = await fs.readFile(relativePath, 'utf-8');
    console.log(`✅ 相对路径成功！长度：${content.length}`);
  } catch (error) {
    console.log(`❌ 相对路径失败：${error.message}`);
  }
  
  console.log(`\n绝对路径：${absolutePath}`);
  try {
    const content = await fs.readFile(absolutePath, 'utf-8');
    console.log(`✅ 绝对路径成功！长度：${content.length}`);
  } catch (error) {
    console.log(`❌ 绝对路径失败：${error.message}`);
  }
}

// 从 commander-pro 目录测试
testFromCwd('F:\\openclaw\\commander-pro').catch(console.error);
