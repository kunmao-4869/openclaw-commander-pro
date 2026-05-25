/**
 * 快速项目生成器
 * 直接使用 AI 生成完整项目代码，不依赖网络搜索
 */

import { openClawClient } from '../lib/openclaw.js';

/**
 * 直接生成鸿蒙项目
 */
export async function generateHarmonyProjectDirectly(projectName, projectType, description) {
  console.log('='.repeat(80));
  console.log('🚀 快速项目生成 - 直接使用 AI 知识库');
  console.log('='.repeat(80));
  console.log(`项目：${projectName}`);
  console.log(`类型：${projectType}`);
  console.log(`描述：${description}`);
  console.log('='.repeat(80));
  console.log('');

  const model = 'qwen3:30b';

  // 生成完整项目
  const projectPrompt = `请为以下鸿蒙项目生成完整的代码实现：

**项目名称**: ${projectName}
**项目类型**: ${projectType}
**项目描述**: ${description}

**要求**:
1. 使用 ArkTS 语言和 ArkUI 框架
2. 符合 HarmonyOS 4.0+ 规范
3. 包含完整的项目结构
4. 提供所有必要的配置文件
5. 代码可运行、可测试

**请生成以下内容**:

## 1. 项目结构
以树形结构展示完整的项目目录

## 2. 核心代码文件
为每个关键文件提供完整代码，包括：
- entryability/EntryAbility.ets
- pages/Index.ets (主页面)
- pages/GameRoom.ets (游戏房间)
- common/Types.ets (类型定义)
- network/WebSocketManager.ets (网络通信)

## 3. 配置文件
- oh-package.json5
- module.json5
- build-profile.json5

## 4. 服务端代码 (Node.js)
- server/index.js (WebSocket 服务器)
- server/package.json

## 5. 使用说明
如何创建项目、配置环境、运行测试

请提供完整、可运行的代码，不要省略关键部分。`;

  try {
    console.log('🤖 AI 正在生成项目代码...\n');
    
    const response = await openClawClient.chat(model, [
      {
        role: 'system',
        content: '你是一个专业的鸿蒙应用开发专家，擅长生成完整、可运行的项目代码。'
      },
      {
        role: 'user',
        content: projectPrompt
      }
    ], {
      temperature: 0.5,
      maxTokens: 8192
    });

    console.log('✅ 项目生成完成!\n');
    console.log(response);

    return {
      success: true,
      projectName,
      projectType,
      description,
      content: response,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ 项目生成失败:', error.message);
    throw error;
  }
}

/**
 * 生成你画我猜游戏项目
 */
export async function generateDrawGuessGame() {
  return generateHarmonyProjectDirectly(
    '你画我猜',
    '实时在线游戏',
    '二人实时对战，一人画画一人猜词，支持多轮比赛和计分系统'
  );
}

// 如果直接运行此文件
if (typeof process !== 'undefined' && process.argv[1] && process.argv[1].includes('QuickProjectGenerator')) {
  generateDrawGuessGame().catch(console.error);
}
