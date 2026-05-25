/**
 * 测试读取需求文档技能
 */

import { ReadRequirementSkill } from './src/skills/file/ReadRequirement.js';

async function testReadRequirement() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  测试读取需求文档技能                  ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  const skill = new ReadRequirementSkill();
  
  const testPath = 'F:/openclaw/projects/HarmonyOS/HarmonyOS_Demo/docs/智慧客房 APP 项目需求.md';
  
  console.log(`📖 测试路径：${testPath}\n`);
  
  try {
    // 验证参数
    const validation = skill.validate({ path: testPath });
    console.log('✅ 参数验证:', validation.valid ? '通过' : `失败：${validation.error}`);
    
    if (!validation.valid) {
      console.log('\n❌ 验证失败，无法继续测试');
      return;
    }
    
    // 执行读取
    console.log('\n📝 执行读取...\n');
    const result = await skill.execute({ path: testPath });
    
    console.log('\n✅ 读取成功！\n');
    console.log(`文件路径：${result.path}`);
    console.log(`文件大小：${result.size} 字节`);
    console.log(`文件行数：${result.lines} 行`);
    console.log(`文档标题：${result.title}`);
    console.log(`\n前 500 字符预览：`);
    console.log(result.content.substring(0, 500));
    
  } catch (error) {
    console.error('\n❌ 读取失败:', error.message);
    console.error(error.stack);
  }
}

testReadRequirement().catch(console.error);
