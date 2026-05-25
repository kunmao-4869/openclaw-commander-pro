/**
 * 测试全局 SkillExecutor
 */

import { skillExecutor } from './src/skills/core/SkillExecutor.js';
import { ReadRequirementSkill } from './src/skills/file/ReadRequirement.js';
import { SafeFileReadSkill } from './src/skills/security/SafeFileOperations.js';

async function testSkillExecutor() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  测试全局 SkillExecutor                ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  // 1. 测试技能注册
  console.log('📝 测试 1: 技能注册');
  const readReqSkill = new ReadRequirementSkill();
  const readFileSkill = new SafeFileReadSkill();
  
  skillExecutor.registerSkill('read_requirement', readReqSkill);
  skillExecutor.registerSkill('safe_read_file', readFileSkill);
  skillExecutor.markAsInitialized();
  
  console.log(`✅ 已注册技能数量：${skillExecutor.getSkillCount()}`);
  console.log(`📋 技能列表：${skillExecutor.getRegisteredSkills().join(', ')}\n`);
  
  // 2. 测试技能执行
  console.log('📝 测试 2: 技能执行');
  const testPath = 'F:\\openclaw\\projects\\HarmonyOS\\HarmonyOS_Demo\\docs\\智慧客房 APP 项目需求.md';
  
  try {
    console.log(`📖 执行 read_requirement 技能，路径：${testPath}`);
    const result = await skillExecutor.execute('read_requirement', { path: testPath });
    
    console.log('\n✅ 技能执行成功！');
    console.log(`   标题：${result.title}`);
    console.log(`   大小：${result.size} 字节`);
    console.log(`   行数：${result.lines} 行`);
    console.log(`\n前 200 字符预览：`);
    console.log(result.content.substring(0, 200));
    
  } catch (error) {
    console.error('\n❌ 技能执行失败:', error.message);
    console.error('完整错误:', error);
  }
  
  // 3. 测试技能状态
  console.log('\n📝 测试 3: 技能状态查询');
  const skillInfo = skillExecutor.getSkillInfo('read_requirement');
  console.log('read_requirement 技能信息:', skillInfo);
  
  console.log('\n✅ 所有测试完成！');
  console.log(`📊 SkillExecutor 状态：`, skillExecutor.exportState());
}

testSkillExecutor().catch(console.error);
