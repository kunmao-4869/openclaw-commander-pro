/**
 * 模拟真实技能执行环境
 */

import { ReadRequirementSkill } from './src/skills/file/ReadRequirement.js';

async function simulateRealExecution() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  模拟真实技能执行环境                  ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  const skill = new ReadRequirementSkill();
  
  // 使用绝对路径（测试表明这样可以工作）
  const testPath = 'F:\\openclaw\\projects\\HarmonyOS\\HarmonyOS_Demo\\docs\\智慧客房APP项目需求.md';
  
  console.log(`📖 文件路径：${testPath}`);
  console.log(`🔍 环境检查:`);
  console.log(`   - process: ${typeof process}`);
  console.log(`   - process.versions.node: ${process?.versions?.node || 'N/A'}`);
  console.log(`   - __dirname: ${typeof __dirname !== 'undefined' ? __dirname : 'N/A'}`);
  console.log();
  
  try {
    console.log('📝 执行读取...\n');
    const result = await skill.execute({ path: testPath });
    
    console.log('\n✅ 读取成功！\n');
    console.log(`文件路径：${result.path}`);
    console.log(`文件大小：${result.size} 字节`);
    console.log(`文件行数：${result.lines} 行`);
    console.log(`文档标题：${result.title}`);
    console.log(`\n前 300 字符预览：`);
    console.log(result.content.substring(0, 300));
    
  } catch (error) {
    console.error('\n❌ 读取失败:', error.message);
    console.error('完整错误:', error);
  }
}

simulateRealExecution().catch(console.error);
