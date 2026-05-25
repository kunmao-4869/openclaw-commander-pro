/**
 * 快速测试 TerminalAgent 技能注册
 */

import { TerminalAgent } from './src/terminal/TerminalAgent.js';

async function testSkillRegistration() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  测试 TerminalAgent 技能注册            ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  const agent = new TerminalAgent({
    apiBaseUrl: 'http://localhost:3003',
    autonomousMode: true,
    verbose: false
  });
  
  console.log('📝 注册默认技能...\n');
  await agent.registerDefaultSkills();
  
  console.log(`✅ 已注册 ${agent.skills.size} 个技能\n`);
  
  console.log('📋 技能列表:');
  for (const [name, skill] of agent.skills) {
    console.log(`   - ${name}: ${skill.description}`);
  }
  
  console.log('\n🔍 检查 read_requirement 技能:');
  const readSkill = agent.skills.get('read_requirement');
  if (readSkill) {
    console.log('✅ read_requirement 技能已注册');
    console.log(`   名称：${readSkill.name}`);
    console.log(`   描述：${readSkill.description}`);
    console.log(`   参数：${JSON.stringify(readSkill.params)}`);
  } else {
    console.log('❌ read_requirement 技能未注册');
  }
  
  console.log('\n🔍 检查 code_review 技能:');
  const reviewSkill = agent.skills.get('code_review');
  if (reviewSkill) {
    console.log('✅ code_review 技能已注册');
  } else {
    console.log('❌ code_review 技能未注册');
  }
}

testSkillRegistration().catch(console.error);
