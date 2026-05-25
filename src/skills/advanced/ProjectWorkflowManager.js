/**
 * 智能项目工作流管理器 v1.0
 * 根据项目类型自动组织文件夹结构、管理学习资源和工程代码
 * 
 * 功能特性：
 * 1. 项目类型识别和分析
 * 2. 智能文件夹结构创建（HarmonyOS、Unreal、Python 等）
 * 3. studying 文件夹的学习文档管理
 * 4. project 文件夹的工程化代码管理
 * 5. img 文件夹的资源管理和配置
 * 6. 代码检索和反馈机制
 */

import { SecureSkill } from '../core/SecureSkill.js';
import { SafeFileWriteSkill } from './SafeFileWrite.js';
import { SafeFileReadSkill, SafeFileListSkill } from '../security/SafeFileOperations.js';
import { LearnWebpageSkill } from '../learning/LearnWebpage.js';

// 检测是否在 Node.js 环境
const isNode = typeof process !== 'undefined' && process.versions?.node;

let fs, path;
if (isNode) {
  fs = await import('fs/promises');
  path = await import('path');
}

/**
 * 项目类型配置
 */
const PROJECT_TEMPLATES = {
  // HarmonyOS 项目
  harmonyos: {
    name: 'HarmonyOS 应用',
    description: '鸿蒙操作系统应用开发',
    folders: {
      root: 'HarmonyOS',
      studying: 'studying',
      project: 'project',
      img: 'img',
      docs: 'docs'
    },
    files: {
      imgConfig: 'img/README.md',
      projectConfig: 'project/hvigorfile.ts',
      studyingGuide: 'studying/LEARNING_GUIDE.md'
    },
    keywords: ['harmonyos', '鸿蒙', 'arkts', 'arkui', 'hap'],
    extensions: ['.ets', '.ts', '.json', '.png', '.jpg', '.svg']
  },
  
  // Unreal Engine 项目
  unreal: {
    name: 'Unreal Engine 游戏',
    description: '虚幻引擎游戏开发',
    folders: {
      root: 'UE_Project',
      studying: 'studying',
      project: 'Source',
      img: 'Documentation/Images',
      content: 'Content'
    },
    files: {
      imgConfig: 'Documentation/ImgGuide.md',
      projectConfig: 'Source/ProjectName/ProjectName.Build.cs',
      studyingGuide: 'studying/UE_LEARNING.md'
    },
    keywords: ['unreal', 'ue5', 'ue4', '游戏', 'game', 'c++', 'blueprint'],
    extensions: ['.h', '.cpp', '.uasset', '.umap', '.png', '.jpg']
  },
  
  // Python 项目
  python: {
    name: 'Python 应用',
    description: 'Python 应用程序开发',
    folders: {
      root: 'Python_Project',
      studying: 'studying',
      project: 'src',
      img: 'assets/images',
      tests: 'tests'
    },
    files: {
      imgConfig: 'assets/images/README.md',
      projectConfig: 'pyproject.toml',
      studyingGuide: 'studying/PYTHON_LEARNING.md'
    },
    keywords: ['python', 'py', '脚本', '自动化', '数据分析'],
    extensions: ['.py', '.txt', '.md', '.png', '.jpg']
  },
  
  // React 项目
  react: {
    name: 'React Web 应用',
    description: 'React 前端应用开发',
    folders: {
      root: 'React_App',
      studying: 'studying',
      project: 'src',
      img: 'public/images',
      components: 'src/components'
    },
    files: {
      imgConfig: 'public/images/README.md',
      projectConfig: 'package.json',
      studyingGuide: 'studying/REACT_LEARNING.md'
    },
    keywords: ['react', '前端', 'web', 'javascript', 'typescript'],
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.png', '.svg']
  },
  
  // 自定义项目
  custom: {
    name: '自定义项目',
    description: '通用项目结构',
    folders: {
      root: 'Project',
      studying: 'studying',
      project: 'src',
      img: 'assets',
      docs: 'docs'
    },
    files: {
      imgConfig: 'assets/README.md',
      projectConfig: 'README.md',
      studyingGuide: 'studying/LEARNING_GUIDE.md'
    },
    keywords: [],
    extensions: []
  }
};

export class ProjectWorkflowManager {
  constructor(options = {}) {
    // 在浏览器环境中使用相对路径，在 Node.js 中使用绝对路径
    this.baseDir = options.baseDir || (isNode ? path.resolve('./projects') : './projects');
    this.writeSkill = new SafeFileWriteSkill();
    this.readSkill = new SafeFileReadSkill();
    this.listSkill = new SafeFileListSkill();
    this.learnSkill = new LearnWebpageSkill();
    
    // 当前项目上下文
    this.currentProject = null;
  }
  
  /**
   * 分析项目类型
   */
  analyzeProjectType(requirement) {
    const lowerReq = requirement.toLowerCase();
    
    // 根据关键词匹配项目类型
    for (const [type, config] of Object.entries(PROJECT_TEMPLATES)) {
      if (type === 'custom') continue;
      
      for (const keyword of config.keywords) {
        if (lowerReq.includes(keyword.toLowerCase())) {
          return {
            type,
            config,
            confidence: 0.9
          };
        }
      }
    }
    
    // 默认返回自定义类型
    return {
      type: 'custom',
      config: PROJECT_TEMPLATES.custom,
      confidence: 0.5
    };
  }
  
  /**
   * 创建项目文件夹结构
   */
  async createProjectStructure(projectName, projectType = 'custom') {
    const config = PROJECT_TEMPLATES[projectType];
    if (!config) {
      throw new Error(`未知的项目类型：${projectType}`);
    }
    
    // 创建根目录（只在 Node.js 环境）
    let rootDir;
    if (isNode) {
      rootDir = path.resolve(this.baseDir, config.folders.root, projectName);
      await fs.mkdir(rootDir, { recursive: true });
      
      // 创建子文件夹
      const folders = Object.values(config.folders);
      for (const folder of folders) {
        const folderPath = path.resolve(rootDir, folder);
        await fs.mkdir(folderPath, { recursive: true });
      }
    } else {
      // 浏览器环境：使用相对路径模拟
      rootDir = `${this.baseDir}/${config.folders.root}/${projectName}`;
      console.log(`[浏览器环境] 项目目录：${rootDir}`);
    }
    
    // 创建配置文件
    await this.createConfigFiles(rootDir, config, projectName);
    
    return {
      rootDir,
      config,
      structure: config.folders
    };
  }
  
  /**
   * 创建配置文件（只在 Node.js 环境执行）
   */
  async createConfigFiles(rootDir, config, projectName) {
    const files = [];
    
    // 只在 Node.js 环境创建实际文件
    if (!isNode) {
      console.log('[浏览器环境] 跳过配置文件创建');
      return files;
    }
    
    // 1. 创建图片资源说明文件
    if (config.files.imgConfig) {
      const imgConfigPath = path.resolve(rootDir, config.files.imgConfig);
      const imgConfigContent = this.generateImgConfig(config);
      await this.writeSkill.execute({
        path: imgConfigPath,
        content: imgConfigContent
      });
      files.push(config.files.imgConfig);
    }
    
    // 2. 创建学习指南
    if (config.files.studyingGuide) {
      const guidePath = path.resolve(rootDir, config.files.studyingGuide);
      const guideContent = this.generateLearningGuide(config, projectName);
      await this.writeSkill.execute({
        path: guidePath,
        content: guideContent
      });
      files.push(config.files.studyingGuide);
    }
    
    // 3. 创建项目配置文件
    if (config.files.projectConfig) {
      const projectConfigPath = path.resolve(rootDir, config.files.projectConfig);
      const projectConfigContent = this.generateProjectConfig(config, projectName);
      try {
        await this.writeSkill.execute({
          path: projectConfigPath,
          content: projectConfigContent
        });
        files.push(config.files.projectConfig);
      } catch (error) {
        // 项目配置文件可能不需要立即创建
        console.log(`项目配置文件将稍后创建：${config.files.projectConfig}`);
      }
    }
    
    return files;
  }
  
  /**
   * 生成图片资源配置
   */
  generateImgConfig(config) {
    return `# 图片资源管理指南

## 📁 目录说明

本目录用于存放项目所需的所有图片资源。

## 📋 图片要求

### 1. 图片格式
- **推荐格式**: PNG, JPG, SVG
- **透明背景**: 使用 PNG 格式
- **矢量图标**: 使用 SVG 格式

### 2. 图片尺寸
根据项目需求，请准备以下尺寸的图片：

#### HarmonyOS 应用图标
- 应用图标：512x512 px
- 通知栏图标：24x24 px
- 设置页图标：48x48 px

#### 通用图片
- 横幅图片：1920x480 px
- 卡片图片：400x300 px
- 头像图片：200x200 px

### 3. 命名规范
\`\`\`
类型_用途_尺寸.格式
例如:
- icon_app_512.png
- banner_home_1920x480.jpg
- avatar_user_200.png
\`\`\`

### 4. 风格要求
- **主色调**: 根据项目主题确定
- **风格**: 简洁现代 / 扁平化 / 拟物化
- **质量**: 高清，无压缩损失

## 📥 添加图片流程

1. 将图片放入此文件夹
2. 在下方记录图片信息
3. 系统会自动检测并更新代码引用

## 📝 已添加图片清单

| 文件名 | 用途 | 尺寸 | 添加时间 |
|--------|------|------|----------|
| (待添加) | - | - | - |

## 🔧 下一步

请用户将所需图片放入此文件夹，然后系统将：
1. 自动检测新图片
2. 更新代码中的图片引用
3. 生成图片预览和说明

---

**项目类型**: ${config.name}
**更新时间**: ${new Date().toISOString()}
`;
  }
  
  /**
   * 生成学习指南
   */
  generateLearningGuide(config, projectName) {
    return `# ${projectName} - 学习指南

## 📚 学习目标

本文件夹用于存放与项目相关的学习文档、示例代码和参考资料。

## 🎯 项目信息

- **项目类型**: ${config.name}
- **项目名称**: ${projectName}
- **创建时间**: ${new Date().toISOString()}

## 📖 学习路径

### 第一阶段：基础知识
- [ ] 了解${config.name}的基本概念
- [ ] 学习开发环境配置
- [ ] 掌握基础语法和结构

### 第二阶段：核心功能
- [ ] 学习核心 API 和组件
- [ ] 实践示例代码
- [ ] 理解最佳实践

### 第三阶段：项目实战
- [ ] 分析项目需求
- [ ] 设计项目架构
- [ ] 编写项目代码

## 📁 文件夹结构

\`\`\`
studying/
├── LEARNING_GUIDE.md    # 本文件
├── docs/                # 学习文档
│   ├── tutorial-1.md
│   └── tutorial-2.md
├── examples/            # 示例代码
│   ├── example-1.ets
│   └── example-2.cpp
└── references/          # 参考资料
    ├── official-docs.md
    └── community-links.md
\`\`\`

## 🔍 代码检索

在学习代码时，系统会：
1. 优先检索 studying 文件夹中的示例代码
2. 分析代码结构和用法
3. 提取可复用的代码片段
4. 在 project 文件夹中应用

## 📝 学习记录

### 已学习的文档
- (待添加)

### 已掌握的代码片段
- (待添加)

### 待解决的问题
- (待添加)

## 🔗 相关资源

- 官方文档：(待补充)
- 社区论坛：(待补充)
- 视频教程：(待补充)

---

**提示**: 学习新内容后，请及时更新本文档
`;
  }
  
  /**
   * 生成项目配置
   */
  generateProjectConfig(config, projectName) {
    const configs = {
      harmonyos: `// HarmonyOS 项目配置
export default {
  name: '${projectName}',
  type: 'harmonyos',
  version: '1.0.0',
  apiVersion: '9.0.0',
  buildProfile: 'release',
  modules: ['entry']
};
`,
      unreal: `// Unreal Engine 项目配置
using UnrealBuildTool;

public class ${projectName.replace(/\\s/g, '')} : ModuleRules
{
    public ${projectName.replace(/\\s/g, '')}(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        
        PublicDependencyModuleNames.AddRange(new[] { 
            "Core", 
            "CoreUObject", 
            "Engine", 
            "InputCore" 
        });
    }
}
`,
      python: `[build-system]
requires = ["setuptools>=45", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "${projectName.replace(/\\s/g, '-').toLowerCase()}"
version = "1.0.0"
description = "${projectName} - Python 项目"
authors = [{name = "Developer"}]
requires-python = ">=3.8"
`,
      react: `{
  "name": "${projectName.replace(/\\s/g, '-').toLowerCase()}",
  "version": "1.0.0",
  "private": true,
  "type": "react",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
`,
      custom: `# ${projectName}

## 项目说明

这是一个${config.name}项目。

## 文件夹结构

\`\`\`
${config.folders.root}/
├── studying/     # 学习资料
├── src/          # 项目代码
├── assets/       # 资源文件
└── docs/         # 文档
\`\`\`

## 快速开始

1. 在 studying 文件夹中学习相关文档
2. 在 src 文件夹中编写代码
3. 将资源文件放入 assets 文件夹

## 开发指南

- 优先检索 studying 中的示例代码
- 缺少代码时向用户反馈
- 图片资源放在 assets/images 目录
`
    };
    
    return configs[config.type] || configs.custom;
  }
  
  /**
   * 保存学习文档到 studying 文件夹（只在 Node.js 环境执行）
   */
  async saveLearningDoc(projectName, url, learningResult) {
    if (!this.currentProject) {
      throw new Error('请先创建或选择项目');
    }
    
    // 浏览器环境：模拟保存
    if (!isNode) {
      console.log('[浏览器环境] 模拟保存学习文档');
      return {
        docPath: `./projects/${projectName}/studying/doc_${Date.now()}.md`,
        docName: `doc_${Date.now()}.md`,
        success: true
      };
    }
    
    const config = this.currentProject.config;
    const studyingDir = path.resolve(
      this.currentProject.rootDir,
      config.folders.studying
    );
    
    // 生成学习文档
    const docName = `doc_${Date.now()}.md`;
    const docPath = path.resolve(studyingDir, docName);
    
    const content = `# 学习文档

## 来源
URL: ${url}
学习时间：${new Date().toISOString()}

## 内容摘要

${learningResult.learningDoc || '暂无摘要内容'}

## 示例代码

${learningResult.codeBlocks?.map((block, i) => 
  `### 代码示例 ${i + 1}

\`\`\`${block.language || 'text'}
${block.code}
\`\`\`
`).join('\n') || '暂无代码示例'}

## 关键知识点

${learningResult.summary?.keyPoints?.map(point => `- ${point}`).join('\n') || '暂无关键点'}

---
**保存到项目**: ${projectName}
`;
    
    await this.writeSkill.execute({
      path: docPath,
      content
    });
    
    return {
      docPath,
      docName,
      success: true
    };
  }
  
  /**
   * 在 studying 文件夹中检索代码（只在 Node.js 环境执行）
   */
  async searchInStudying(searchQuery) {
    if (!this.currentProject) {
      throw new Error('请先创建或选择项目');
    }
    
    // 浏览器环境：模拟搜索
    if (!isNode) {
      console.log('[浏览器环境] 模拟代码检索');
      return {
        query: searchQuery,
        results: [],
        total: 0
      };
    }
    
    const config = this.currentProject.config;
    const studyingDir = path.resolve(
      this.currentProject.rootDir,
      config.folders.studying
    );
    
    // 列出 studying 文件夹内容
    const result = await this.listSkill.execute({
      path: studyingDir
    });
    
    const files = result.files || [];
    const matchedFiles = [];
    
    // 搜索匹配的文件
    for (const file of files) {
      if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        try {
          const content = await this.readSkill.execute({
            path: file.path
          });
          
          if (content.content.toLowerCase().includes(searchQuery.toLowerCase())) {
            matchedFiles.push({
              file: file.name,
              path: file.path,
              preview: content.content.substring(0, 500)
            });
          }
        } catch (error) {
          // 跳过无法读取的文件
        }
      }
    }
    
    return {
      query: searchQuery,
      results: matchedFiles,
      total: matchedFiles.length
    };
  }
  
  /**
   * 检查图片资源是否就绪（只在 Node.js 环境执行）
   */
  async checkImgResources() {
    if (!this.currentProject) {
      throw new Error('请先创建或选择项目');
    }
    
    // 浏览器环境：模拟检查
    if (!isNode) {
      console.log('[浏览器环境] 模拟检查图片资源');
      return {
        imgDir: `./projects/${this.currentProject.name}/img`,
        images: [],
        totalImages: 0,
        hasConfig: false
      };
    }
    
    const config = this.currentProject.config;
    const imgDir = path.resolve(
      this.currentProject.rootDir,
      config.folders.img
    );
    
    // 列出图片文件夹内容
    const result = await this.listSkill.execute({
      path: imgDir
    });
    
    const files = result.files || [];
    const images = files.filter(f => 
      /\.(png|jpg|jpeg|svg|gif|webp)$/i.test(f.name)
    );
    
    // 读取图片配置
    const imgConfigPath = path.resolve(imgDir, 'README.md');
    let imgConfig = null;
    try {
      imgConfig = await this.readSkill.execute({
        path: imgConfigPath
      });
    } catch (error) {
      // 配置文件不存在
    }
    
    return {
      imgDir,
      images: images.map(img => ({
        name: img.name,
        size: img.size,
        path: img.path
      })),
      totalImages: images.length,
      hasConfig: !!imgConfig
    };
  }
  
  /**
   * 创建或选择项目
   */
  async createOrSelectProject(projectName, requirement) {
    // 分析项目类型
    const analysis = this.analyzeProjectType(requirement);
    
    console.log(`\n📊 项目分析:`);
    console.log(`   类型：${analysis.config.name}`);
    console.log(`   置信度：${(analysis.confidence * 100).toFixed(1)}%`);
    
    // 创建项目结构
    const structure = await this.createProjectStructure(projectName, analysis.type);
    
    // 设置当前项目
    this.currentProject = {
      name: projectName,
      type: analysis.type,
      rootDir: structure.rootDir,
      config: analysis.config,
      requirement
    };
    
    console.log(`\n✅ 项目创建成功：${projectName}`);
    console.log(`   根目录：${structure.rootDir}`);
    console.log(`   文件夹:`);
    for (const [name, folder] of Object.entries(structure.config.folders)) {
      console.log(`     - ${name}: ${folder}/`);
    }
    
    // 🚀 自动触发代码生成（可选）
    // 注意：这里不直接生成代码，而是返回项目信息
    // 代码生成由 TerminalAgent 中的技能调用处理
    
    return this.currentProject;
  }
  
  /**
   * 获取当前项目状态
   */
  getProjectStatus() {
    if (!this.currentProject) {
      return {
        hasProject: false,
        message: '当前没有活动项目'
      };
    }
    
    return {
      hasProject: true,
      name: this.currentProject.name,
      type: this.currentProject.type,
      rootDir: this.currentProject.rootDir,
      structure: this.currentProject.config.folders
    };
  }
}

// 导出
export default ProjectWorkflowManager;
