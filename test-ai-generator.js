/**
 * 测试真正的 AI 驱动代码生成
 * 使用大模型根据实际需求文档生成项目
 */

import { AIHarmonyOSGenerator } from './src/ai/AIHarmonyOSGenerator.js';
import { readFileSync } from 'fs';
import { join } from 'path';

async function testAIGeneration() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  测试真正的 AI 驱动代码生成                      ║');
  console.log('╚══════════════════════════════════════════════════╝\n');
  
  const generator = new AIHarmonyOSGenerator();
  
  // 需求文档路径
  const requirementPath = 'F:\\openclaw\\projects\\HarmonyOS\\HarmonyOS_Demo\\docs\\智慧客房 APP 项目需求.md';
  const outputPath = 'F:\\openclaw\\commander-pro\\generated-ai';
  
  console.log(`📖 需求文档：${requirementPath}`);
  console.log(`💾 输出目录：${outputPath}\n`);
  
  try {
    // 检查需求文档是否存在
    try {
      readFileSync(requirementPath, 'utf-8');
      console.log('✅ 需求文档存在\n');
    } catch (error) {
      console.log('❌ 需求文档不存在，使用示例需求\n');
      // 创建示例需求
      const demoRequirement = `
智慧客房 APP 项目需求

一、项目概述
开发一款基于 HarmonyOS 的智慧客房控制应用，用于酒店客房设备控制和服务管理。

二、核心功能
1. 用户登录：房号 + 用户名登录，记住密码功能
2. 首页：显示房间状态，空调控制，场景模式，快捷服务
3. 灯光控制：总开关，场景模式，独立控制各个灯光
4. 窗帘控制：布帘和窗纱分别控制，一键开合
5. 服务控制：请勿打扰，清理房间，SOS 紧急呼叫

三、技术要求
1. 使用 ArkTS 语言
2. 使用 V2 装饰器（@Observed, @Watch）
3. MVVM 架构
4. 响应式设计，适配手机和平板
5. 使用真实的资源引用
6. 完整的业务逻辑，不要 TODO 注释

四、页面列表
1. Login.ets - 登录页面
2. Home.ets - 首页
3. Light.ets - 灯光控制页面
4. Curtain.ets - 窗帘控制页面
5. Service.ets - 服务控制页面
`;
      const tempPath = 'F:\\openclaw\\commander-pro\\temp-requirement.md';
      // 这里只是演示，实际需要写入文件
      console.log('使用示例需求文档');
    }
    
    // 生成项目
    console.log('🚀 开始生成项目...\n');
    const result = await generator.generateProject(requirementPath, outputPath);
    
    console.log('\n✅ 生成完成！');
    console.log('\n📊 生成结果:');
    result.modules.forEach(module => {
      if (module.error) {
        console.log(`   ❌ ${module.filename}: ${module.error}`);
      } else {
        console.log(`   ✅ ${module.filename}: ${module.lines} 行`);
      }
    });
    
  } catch (error) {
    console.error('\n❌ 生成失败:', error);
    console.error(error.stack);
  }
}

// 运行测试
testAIGeneration().catch(console.error);
