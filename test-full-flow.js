/**
 * 测试完整的任务规划流程
 */

import { TaskPlanner } from './src/lib/taskPlanner.js';

async function testFullFlow() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  测试完整任务规划流程                  ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  const planner = new TaskPlanner({
    smallModel: 'qwen3:8b',
    largeModel: 'qwen3:30b',
    maxSteps: 10
  });
  
  const userRequest = '根据"F:\\openclaw\\projects\\HarmonyOS\\HarmonyOS_Demo\\docs\\智慧客房 APP 项目需求.md"生成项目';
  
  console.log(`📝 用户请求：${userRequest}\n`);
  
  try {
    const result = await planner.processTask(userRequest);
    
    console.log('\n✅ 任务完成！\n');
    console.log('初步规划:', JSON.stringify(result.preliminaryPlan, null, 2));
    console.log('\n优化后的规划:', JSON.stringify(result.optimizedPlan, null, 2));
    console.log('\n执行结果:', JSON.stringify(result.executionResult, null, 2));
    
  } catch (error) {
    console.error('\n❌ 任务失败:', error.message);
    console.error('完整错误:', error);
  }
}

testFullFlow().catch(console.error);
