/**
 * 测试直接读取中文文件
 */

import { promises as fs } from 'fs';
import { pathToFileURL } from 'url';

async function testRead() {
  const testPath = 'F:\\openclaw\\projects\\HarmonyOS\\HarmonyOS_Demo\\docs\\智慧客房APP项目需求.md';
  
  console.log('测试路径:', testPath);
  
  // 方法 1: 直接使用路径
  try {
    console.log('\n方法 1: 直接使用路径');
    const content = await fs.readFile(testPath, 'utf-8');
    console.log('✅ 成功！前 100 字符:', content.substring(0, 100));
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }
  
  // 方法 2: 使用 fileURL
  try {
    console.log('\n方法 2: 使用 fileURL');
    const fileUrl = pathToFileURL(testPath);
    console.log('URL:', fileUrl.href);
    const content = await fs.readFile(fileUrl, 'utf-8');
    console.log('✅ 成功！前 100 字符:', content.substring(0, 100));
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }
  
  // 方法 3: 使用短路径
  try {
    console.log('\n方法 3: 使用短路径');
    const shortPath = 'F:\\openclaw\\projects\\HarmonyOS\\HarmonyOS_Demo\\docs\\~1.md';
    const content = await fs.readFile(shortPath, 'utf-8');
    console.log('✅ 成功！前 100 字符:', content.substring(0, 100));
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }
}

testRead().catch(console.error);
