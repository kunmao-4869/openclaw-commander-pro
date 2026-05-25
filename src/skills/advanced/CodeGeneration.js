/**
 * 代码生成技能
 * 根据学习结果和需求自动生成项目代码
 */

import { SecureSkill } from '../core/SecureSkill.js';
import { openClawClient } from '../../lib/openclaw.js';

// 检测是否在 Node.js 环境
const isNode = typeof process !== 'undefined' && process.versions?.node;
let fs;
if (isNode) {
  fs = await import('fs/promises');
}

export class CodeGenerationSkill extends SecureSkill {
  constructor() {
    super({
      name: 'generate_project_code',
      description: '根据项目需求和学习结果自动生成代码',
      category: '代码生成',
      isSafe: true,
      requiresConfirmation: true,
      readOnly: false,
    });
  }

  validate(params) {
    // 支持多种参数命名格式
    const requirement = params.requirement || params.requirements;
    const requirementFile = params.requirement_file || params.requirementFile;
    const projectType = params.projectType || params.project_type;
    
    // 要么提供需求内容，要么提供需求文件路径
    if (!requirement && !requirementFile) {
      return { valid: false, error: '需要提供项目需求或需求文件路径' };
    }

    // projectType 不是必需的，可以自动推断
    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      // 支持多种参数命名格式
      let requirement = params.requirement || params.requirements;
      const requirementFile = params.requirement_file || params.requirementFile;
      const projectType = params.projectType || params.project_type || 'web';
      const learningResults = params.learningResults || params.learning_results;
      const techStack = params.techStack || params.tech_stack;

      // 如果提供的是文件路径，读取文件内容
      if (!requirement && requirementFile) {
        console.log(`[CodeGeneration] 读取需求文件：${requirementFile}`);
        if (!isNode) {
          throw new Error('需要 Node.js 环境来读取文件');
        }
        requirement = await fs.readFile(requirementFile, 'utf-8');
        console.log(`[CodeGeneration] 需求文件读取成功，${requirement.length} 字符`);
      }

      // 构建代码生成提示
      const codeGenPrompt = `请根据以下信息生成完整的项目代码：

项目类型：${projectType}
${techStack ? `技术栈：${techStack}` : '技术栈：请从需求文档中识别'}
项目需求：
${requirement}

${learningResults ? `学习总结：\n${learningResults}\n` : ''}

**🔴 极其重要的技术要求**：
1. 需求文档中明确提到了 **HarmonyOS、鸿蒙、MVVM、V2 状态管理、Navigation 导航、ArkTS、ArkUI** 等关键词
2. **必须使用 HarmonyOS 技术栈**，包括：
   - 语言：ArkTS (TypeScript 的超集)
   - UI 框架：ArkUI (声明式 UI)
   - 架构：MVVM + V2 状态管理装饰器 (@State, @Link, @Prop, @Watch, @ObjectLink)
   - 导航：Navigation 导航架构
   - 项目结构：common + feature + product 三层架构
   - 文件扩展名：.ets (不是 .js 或 .ts)
3. **禁止使用** React、Vue、Angular 等 Web 技术栈
4. 必须实现需求文档中描述的 5 个页面：登录页、首页、灯光控制、窗帘控制、服务控制
5. 需要适配手机、平板、折叠屏三种设备

**代码示例参考**：
\`\`\`arkts
// ArkTS 示例 - 使用 ArkUI 声明式 UI
@Component
struct HomePage {
  @State temperature: number = 22;
  @State acStatus: boolean = true;
  
  build() {
    Column() {
      Text('智慧客房')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
      // 空调控制
      Row() {
        Text('空调')
        Toggle({ state: this.acStatus })
          .onChange((isChecked: boolean) => {
            this.acStatus = isChecked;
          })
      }
    }
  }
}
\`\`\`

请生成：
1. 完整的 HarmonyOS 项目目录结构
2. 所有 .ets 文件（ArkTS 代码）
3. 配置文件（build-profile.json5、hvigorfile.ts 等）
4. 资源文件引用说明
5. README.md 使用说明

要求：
- 所有代码文件使用 .ets 扩展名
- 使用 ArkUI 声明式语法
- 使用@State、@Link 等 V2 状态管理装饰器
- 实现完整的 5 个页面
- 代码完整、可运行
- 包含必要的注释

请按以下格式返回 JSON：
\`\`\`json
{
  "projectStructure": "目录结构树",
  "files": [
    {
      "path": "文件路径",
      "content": "文件内容",
      "description": "文件说明"
    }
  ],
  "readme": "项目说明",
  "installSteps": "安装步骤"
}
\`\`\`

只返回 JSON，不要其他内容。`;

      // 使用 AI 生成代码 - 先用小模型测试，确保系统可用
      const model = params.model || 'qwen3:8b'; // 临时使用小模型，提高响应速度
      const response = await openClawClient.chat(model, [
        {
          role: 'system',
          content: `你是一个专业的代码生成专家，擅长根据需求文档生成完整、可运行的项目代码。

**🔴 核心原则**：
1. **必须严格遵循需求文档中的技术栈要求**
2. 如果需求文档提到 HarmonyOS/鸿蒙，必须使用 ArkTS 语言和 ArkUI 框架
3. 禁止混用不同技术栈（如 HarmonyOS 项目不能用 React/Vue）
4. 生成的代码必须完整、可运行、符合对应技术栈的最佳实践`
        },
        {
          role: 'user',
          content: codeGenPrompt
        }
      ], {
        temperature: 0.2, // 极低温度，提高准确性
        maxTokens: 16384, // 16K 输出
        timeout: 300000 // 5 分钟超时
      });

      // 解析生成的代码
      let projectConfig;
      try {
        // 提取 JSON 部分
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          projectConfig = JSON.parse(jsonMatch[0]);
        } else {
          projectConfig = JSON.parse(response);
        }
      } catch (parseError) {
        console.error('[CodeGeneration] JSON 解析失败，使用原始响应');
        projectConfig = {
          files: [{ path: 'main.js', content: response }],
          readme: response
        };
      }

      this.log('generate_code', { projectType }, {
        filesCount: projectConfig.files?.length || 0
      });

      // 保存文件到磁盘
      const savedFiles = [];
      if (projectConfig.files && isNode) {
        const nodePath = await import('path');
        const baseOutputDir = params.outputDir || nodePath.default.join(process.cwd(), 'generated');
        
        // 创建项目命名文件夹
        const projectName = params.projectName || `project-${Date.now()}`;
        const outputDir = nodePath.default.join(baseOutputDir, projectName);
        
        console.log(`[CodeGeneration] 开始保存 ${projectConfig.files.length} 个文件到：${outputDir}`);
        console.log(`  项目名称：${projectName}`);
        
        for (const file of projectConfig.files) {
          try {
            const filePath = nodePath.default.join(outputDir, file.path);
            const dirPath = nodePath.default.dirname(filePath);
            
            // 确保目录存在
            await fs.mkdir(dirPath, { recursive: true });
            
            // 保存文件
            await fs.writeFile(filePath, file.content, 'utf-8');
            savedFiles.push({
              path: file.path,
              fullPath: filePath,
              description: file.description
            });
            console.log(`  ✅ 已保存：${file.path}`);
          } catch (saveError) {
            console.error(`  ❌ 保存失败：${file.path}`, saveError.message);
          }
        }
        
        console.log(`[CodeGeneration] ✅ 已保存 ${savedFiles.length}/${projectConfig.files.length} 个文件`);
      }

      return {
        success: true,
        projectConfig,
        projectType,
        techStack,
        filesCount: projectConfig.files?.length || 0,
        savedFiles,
        outputDir: isNode ? await (async () => {
          const nodePath = await import('path');
          const baseOutputDir = params.outputDir || nodePath.default.join(process.cwd(), 'generated');
          const projectName = params.projectName || `project-${Date.now()}`;
          return nodePath.default.join(baseOutputDir, projectName);
        })() : undefined,
        projectName: params.projectName || `project-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.log('generate_code_error', params, error.message);
      throw error;
    }
  }
}

/**
 * 代码审查技能
 * 检查生成的代码质量
 */
export class CodeReviewSkill extends SecureSkill {
  constructor() {
    super({
      name: 'review_code',
      description: '审查代码质量，提供改进建议',
      category: '代码生成',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  async execute(params) {
    if (!params.code && !params.files) {
      throw new Error('需要提供代码或文件');
    }

    const codeContent = params.code || JSON.stringify(params.files);

    const reviewPrompt = `请审查以下代码，提供详细的质量评估和改进建议：

${codeContent.slice(0, 5000)}

请从以下方面审查：
1. 代码质量（可读性、可维护性）
2. 最佳实践遵循情况
3. 潜在的错误和漏洞
4. 性能优化建议
5. 安全建议

请提供结构化的审查报告。`;

    try {
      const model = params.model || 'qwen3:30b';
      const review = await openClawClient.chat(model, [
        {
          role: 'system',
          content: '你是一个专业的代码审查专家，擅长发现代码问题并提供改进建议。'
        },
        {
          role: 'user',
          content: reviewPrompt
        }
      ], {
        temperature: 0.3,
        maxTokens: 4096
      });

      return {
        success: true,
        review,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.log('review_code_error', params, error.message);
      throw error;
    }
  }
}

// 导出单例
export const codeGenerationSkill = new CodeGenerationSkill();
export const codeReviewSkill = new CodeReviewSkill();
