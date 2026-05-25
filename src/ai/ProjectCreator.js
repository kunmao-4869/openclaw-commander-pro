/**
 * 项目级代码生成器 v1.0
 * 能够拆解项目为小模块，创建文件夹结构，逐个生成模块代码
 */

import AutonomousProgrammer from './AutonomousProgrammer.js';
import EnhancedAutonomousProgrammer from './EnhancedAutonomousProgrammer.js';

// 检测是否在 Node.js 环境
const isNode = typeof process !== 'undefined' && process.versions?.node;

// 动态导入 Node.js 模块（只在 Node.js 环境）
let fs, path, fileURLToPath;
if (isNode) {
  fs = await import('fs');
  path = await import('path');
  const url = await import('url');
  fileURLToPath = url.fileURLToPath;
}

const __filename = isNode ? fileURLToPath(import.meta.url) : '';
const __dirname = isNode ? path.dirname(__filename) : '';

export class ProjectCreator {
  constructor() {
    this.programmer = new EnhancedAutonomousProgrammer();
    this.projectTemplates = {
      'unreal_game': this.getUnrealGameTemplate(),
      'python_tool': this.getPythonToolTemplate(),
      'react_app': this.getReactAppTemplate(),
      'flask_api': this.getFlaskAPITemplate()
    };
  }

  /**
   * 获取虚幻游戏项目模板
   */
  getUnrealGameTemplate() {
    return {
      name: 'unreal_game',
      description: '虚幻引擎游戏项目',
      structure: {
        'Source/${ProjectName}': [
          { name: '${GameMode}.h', type: 'header', template: 'unreal_header' },
          { name: '${GameMode}.cpp', type: 'source', template: 'unreal_cpp' },
          { name: '${Character}.h', type: 'header', template: 'unreal_header' },
          { name: '${Character}.cpp', type: 'source', template: 'unreal_cpp' },
          { name: '${PlayerController}.h', type: 'header', template: 'unreal_header' },
          { name: '${PlayerController}.cpp', type: 'source', template: 'unreal_cpp' },
          { name: '${GameState}.h', type: 'header', template: 'unreal_header' },
          { name: '${GameState}.cpp', type: 'source', template: 'unreal_cpp' }
        ],
        'Config': [
          { name: 'DefaultEngine.ini', type: 'config', template: 'unreal_engine_ini' },
          { name: 'DefaultGame.ini', type: 'config', template: 'unreal_game_ini' }
        ]
      }
    };
  }

  /**
   * 获取 Python 工具项目模板
   */
  getPythonToolTemplate() {
    return {
      name: 'python_tool',
      description: 'Python 工具项目',
      structure: {
        'src': [
          { name: '__init__.py', type: 'init', template: 'python_init' },
          { name: 'main.py', type: 'source', template: 'python_main' },
          { name: 'utils.py', type: 'module', template: 'python_utils' }
        ],
        'tests': [
          { name: 'test_main.py', type: 'test', template: 'python_test' }
        ],
        '': [
          { name: 'requirements.txt', type: 'config', template: 'python_requirements' },
          { name: 'README.md', type: 'doc', template: 'readme' }
        ]
      }
    };
  }

  /**
   * 获取 React 应用项目模板
   */
  getReactAppTemplate() {
    return {
      name: 'react_app',
      description: 'React 应用项目',
      structure: {
        'src/components': [
          { name: 'Header.jsx', type: 'component', template: 'react_component' },
          { name: 'Footer.jsx', type: 'component', template: 'react_component' },
          { name: 'MainContent.jsx', type: 'component', template: 'react_component' }
        ],
        'src/hooks': [
          { name: 'useAuth.js', type: 'hook', template: 'react_hook' },
          { name: 'useApi.js', type: 'hook', template: 'react_hook' }
        ],
        'src/pages': [
          { name: 'Home.jsx', type: 'page', template: 'react_page' },
          { name: 'About.jsx', type: 'page', template: 'react_page' }
        ],
        'src': [
          { name: 'App.jsx', type: 'source', template: 'react_app' },
          { name: 'index.js', type: 'entry', template: 'react_index' }
        ],
        '': [
          { name: 'package.json', type: 'config', template: 'package_json' },
          { name: 'README.md', type: 'doc', template: 'readme' }
        ]
      }
    };
  }

  /**
   * 获取 Flask API 项目模板
   */
  getFlaskAPITemplate() {
    return {
      name: 'flask_api',
      description: 'Flask API 项目',
      structure: {
        'app': [
          { name: '__init__.py', type: 'init', template: 'flask_init' },
          { name: 'routes.py', type: 'module', template: 'flask_routes' },
          { name: 'models.py', type: 'module', template: 'flask_models' },
          { name: 'utils.py', type: 'module', template: 'flask_utils' }
        ],
        'tests': [
          { name: 'test_api.py', type: 'test', template: 'python_test' }
        ],
        '': [
          { name: 'requirements.txt', type: 'config', template: 'python_requirements' },
          { name: 'README.md', type: 'doc', template: 'readme' }
        ]
      }
    };
  }

  /**
   * 拆解项目为小模块
   */
  analyzeProject(requirement) {
    console.log(`\n🔍 分析项目需求：${requirement}`);
    
    const modules = [];
    const lowerReq = requirement.toLowerCase();
    
    // 检测项目类型
    let projectType = 'custom';
    
    if (lowerReq.includes('虚幻') || lowerReq.includes('unreal') || lowerReq.includes('游戏')) {
      projectType = 'unreal_game';
      modules.push(
        { name: 'GameMode', description: '游戏模式控制', files: 2 },
        { name: 'Character', description: '角色控制', files: 2 },
        { name: 'PlayerController', description: '玩家输入控制', files: 2 },
        { name: 'GameState', description: '游戏状态管理', files: 2 }
      );
    } else if (lowerReq.includes('python') && (lowerReq.includes('工具') || lowerReq.includes('脚本'))) {
      projectType = 'python_tool';
      modules.push(
        { name: 'Main', description: '主程序入口', files: 1 },
        { name: 'Utils', description: '工具函数', files: 1 },
        { name: 'Tests', description: '单元测试', files: 1 }
      );
    } else if (lowerReq.includes('react') || lowerReq.includes('前端')) {
      projectType = 'react_app';
      modules.push(
        { name: 'Components', description: 'UI 组件', files: 3 },
        { name: 'Hooks', description: '自定义 Hooks', files: 2 },
        { name: 'Pages', description: '页面', files: 2 }
      );
    } else if (lowerReq.includes('flask') || lowerReq.includes('api')) {
      projectType = 'flask_api';
      modules.push(
        { name: 'Routes', description: 'API 路由', files: 1 },
        { name: 'Models', description: '数据模型', files: 1 },
        { name: 'Utils', description: '工具函数', files: 1 }
      );
    }
    
    return {
      projectType,
      modules,
      totalFiles: modules.reduce((sum, m) => sum + m.files, 0)
    };
  }

  /**
   * 创建项目文件夹结构
   */
  async createProjectStructure(projectName, projectType) {
    console.log(`\n📁 创建项目结构：${projectName}`);
    
    const template = this.projectTemplates[projectType];
    if (!template) {
      throw new Error(`未找到项目模板：${projectType}`);
    }
    
    const baseDir = path.join(__dirname, '..', '..', 'generated', projectName);
    
    // 创建文件夹结构
    for (const [relPath, files] of Object.entries(template.structure)) {
      const fullPath = path.join(baseDir, relPath);
      
      // 创建文件夹
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`   ✅ 创建文件夹：${relPath || projectName}`);
      }
      
      // 创建空文件
      for (const file of files) {
        const fileName = this.replaceTemplateVars(file.name, { ProjectName: projectName });
        const filePath = path.join(fullPath, fileName);
        
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, '', 'utf-8');
          console.log(`   ✅ 创建文件：${relPath ? relPath + '/' : ''}${fileName}`);
        }
      }
    }
    
    return baseDir;
  }

  /**
   * 替换模板变量
   */
  replaceTemplateVars(str, vars) {
    let result = str;
    for (const [key, value] of Object.entries(vars)) {
      result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
    }
    return result;
  }

  /**
   * 生成模块代码
   */
  async generateModuleCode(moduleName, moduleDescription, projectType, projectName) {
    console.log(`\n📝 生成模块：${moduleName} - ${moduleDescription}`);
    
    const requirement = `为${projectType}项目生成${moduleName}模块：${moduleDescription}`;
    
    try {
      // 使用自主编程引擎生成代码
      const result = await this.programmer.enhancedProgram(requirement, {
        projectName,
        moduleType: moduleName
      });
      
      return result.code;
    } catch (error) {
      console.error(`   ❌ 生成失败：${error.message}`);
      return null;
    }
  }

  /**
   * 填充文件内容
   */
  async fillFileContent(baseDir, projectType, projectName, modules) {
    console.log(`\n📄 填充文件内容...`);
    
    const template = this.projectTemplates[projectType];
    const vars = { ProjectName: projectName };
    
    let successCount = 0;
    let totalCount = 0;
    
    for (const [relPath, files] of Object.entries(template.structure)) {
      for (const file of files) {
        const fileName = this.replaceTemplateVars(file.name, vars);
        const filePath = path.join(baseDir, relPath, fileName);
        
        console.log(`\n   生成：${relPath ? relPath + '/' : ''}${fileName}`);
        
        // 生成文件内容
        const content = await this.generateFileContent(file, projectType, projectName, modules);
        
        if (content) {
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log(`   ✅ 已生成`);
          successCount++;
        } else {
          console.log(`   ⚠️ 跳过`);
        }
        
        totalCount++;
      }
    }
    
    return {
      success: successCount,
      total: totalCount,
      rate: ((successCount / totalCount) * 100).toFixed(1) + '%'
    };
  }

  /**
   * 生成单个文件内容
   */
  async generateFileContent(file, projectType, projectName, modules) {
    const templates = {
      'unreal_header': this.generateUnrealHeader.bind(this),
      'unreal_cpp': this.generateUnrealCPP.bind(this),
      'unreal_engine_ini': this.generateUnrealEngineINI.bind(this),
      'unreal_game_ini': this.generateUnrealGameINI.bind(this),
      'python_init': this.generatePythonInit.bind(this),
      'python_main': this.generatePythonMain.bind(this),
      'python_utils': this.generatePythonUtils.bind(this),
      'python_test': this.generatePythonTest.bind(this),
      'python_requirements': this.generateRequirements.bind(this),
      'react_component': this.generateReactComponent.bind(this),
      'react_hook': this.generateReactHook.bind(this),
      'react_page': this.generateReactPage.bind(this),
      'react_app': this.generateReactApp.bind(this),
      'react_index': this.generateReactIndex.bind(this),
      'package_json': this.generatePackageJSON.bind(this),
      'readme': this.generateReadme.bind(this),
      'flask_init': this.generateFlaskInit.bind(this),
      'flask_routes': this.generateFlaskRoutes.bind(this),
      'flask_models': this.generateFlaskModels.bind(this),
      'flask_utils': this.generateFlaskUtils.bind(this)
    };
    
    const generator = templates[file.template];
    if (!generator) {
      return `// TODO: 实现 ${file.name}`;
    }
    
    return generator(file, projectName, modules);
  }

  // ========== 文件生成器 ==========

  generateUnrealHeader(file, projectName, modules) {
    const className = file.name.replace('.h', '');
    const baseClass = className.includes('GameMode') ? 'GameModeBase' : 
                      className.includes('Character') ? 'Character' :
                      className.includes('Controller') ? 'PlayerController' : 'GameStateBase';
    
    return `// ${file.name}
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/${baseClass}.h"
#include "${className}.generated.h"

UCLASS()
class ${projectName}API A${className} : public A${baseClass}
{
	GENERATED_BODY()
	
public:
	// 构造函数
	A${className}();

protected:
	// 开始游戏
	virtual void BeginPlay() override;

public:	
	// 每帧调用
	virtual void Tick(float DeltaTime) override;
};
`;
  }

  generateUnrealCPP(file, projectName, modules) {
    const className = file.name.replace('.cpp', '');
    
    return `// ${file.name}

#include "${className}.h"

A${className}::A${className}()
{
	PrimaryActorTick.bCanEverTick = true;
}

void A${className}::BeginPlay()
{
	Super::BeginPlay();
	
	UE_LOG(LogTemp, Log, TEXT("${className} 开始游戏"));
}

void A${className}::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	
	// TODO: 实现每帧逻辑
}
`;
  }

  generateUnrealEngineINI(file, projectName, modules) {
    return `[/Script/EngineSettings.GameMapsSettings]
GameDefaultMap=/Game/Maps/MainMap.MainMap
EditorStartupMap=/Game/Maps/MainMap.MainMap
GlobalDefaultGameMode=/Script/${projectName}.${projectName}GameMode
`;
  }

  generateUnrealGameINI(file, projectName, modules) {
    return `[/Script/EngineSettings.GeneralProjectSettings]
ProjectName=${projectName}
ProjectID=12345678-1234-1234-1234-123456789012
`;
  }

  generatePythonInit(file, projectName, modules) {
    return `"""
${projectName} - Python 工具项目
"""

__version__ = '1.0.0'
__author__ = 'AI Generated'
`;
  }

  generatePythonMain(file, projectName, modules) {
    return `#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
${projectName} - 主程序入口
"""

from src.utils import helper

def main():
    """主函数"""
    print(f"欢迎使用 {projectName}!")
    
    # TODO: 实现主逻辑
    result = helper.process()
    print(f"结果：{result}")

if __name__ == '__main__':
    main()
`;
  }

  generatePythonUtils(file, projectName, modules) {
    return `#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
工具函数模块
"""

def process():
    """处理函数"""
    # TODO: 实现具体逻辑
    return "处理完成"

def helper():
    """辅助函数"""
    return "辅助功能"
`;
  }

  generatePythonTest(file, projectName, modules) {
    return `#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
测试模块
"""

import unittest

class Test${projectName.replace(/\s+/g, '')}(unittest.TestCase):
    """测试类"""
    
    def test_example(self):
        """测试示例"""
        self.assertTrue(True)

if __name__ == '__main__':
    unittest.main()
`;
  }

  generateRequirements(file, projectName, modules) {
    return `# ${projectName} 依赖
# 添加需要的包
# requests>=2.28.0
`;
  }

  generateReactComponent(file, projectName, modules) {
    const componentName = file.name.replace('.jsx', '');
    
    return `import React from 'react';

/**
 * ${componentName} 组件
 */
function ${componentName}() {
  return (
    <div className="${componentName.toLowerCase()}">
      <h2>${componentName}</h2>
      {/* TODO: 实现组件内容 */}
    </div>
  );
}

export default ${componentName};
`;
  }

  generateReactHook(file, projectName, modules) {
    const hookName = file.name.replace('.js', '');
    
    return `import { useState, useEffect } from 'react';

/**
 * ${hookName} 自定义 Hook
 */
function ${hookName}() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // TODO: 实现逻辑
    setLoading(false);
  }, []);
  
  return { data, loading };
}

export default ${hookName};
`;
  }

  generateReactPage(file, projectName, modules) {
    const pageName = file.name.replace('.jsx', '');
    
    return `import React from 'react';

/**
 * ${pageName} 页面
 */
function ${pageName}() {
  return (
    <div className="${pageName.toLowerCase()}">
      <h1>${pageName}</h1>
      {/* TODO: 实现页面内容 */}
    </div>
  );
}

export default ${pageName};
`;
  }

  generateReactApp(file, projectName, modules) {
    return `import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent';

/**
 * 主应用组件
 */
function App() {
  return (
    <div className="App">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}

export default App;
`;
  }

  generateReactIndex(file, projectName, modules) {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  }

  generatePackageJSON(file, projectName, modules) {
    return `{
  "name": "${projectName.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "description": "${projectName}",
  "main": "src/index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
`;
  }

  generateReadme(file, projectName, modules) {
    return `# ${projectName}

AI 生成的项目

## 功能

- 功能 1
- 功能 2
- 功能 3

## 安装

\`\`\`bash
# 安装依赖
npm install  # 或 pip install -r requirements.txt
\`\`\`

## 使用

\`\`\`bash
# 运行
npm start  # 或 python src/main.py
\`\`\`

## 项目结构

\`\`\`
${projectName}/
├── src/          # 源代码
├── tests/        # 测试
└── README.md     # 说明文档
\`\`\`

## 生成时间

${new Date().toISOString()}
`;
  }

  generateFlaskInit(file, projectName, modules) {
    return `from flask import Flask

app = Flask(__name__)

from app import routes
`;
  }

  generateFlaskRoutes(file, projectName, modules) {
    return `from app import app
from flask import jsonify

@app.route('/')
def index():
    return jsonify({'message': '欢迎使用 ${projectName} API'})

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok'})
`;
  }

  generateFlaskModels(file, projectName, modules) {
    return `from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)
`;
  }

  generateFlaskUtils(file, projectName, modules) {
    return `"""
工具函数
"""

def helper():
    """辅助函数"""
    return "辅助功能"
`;
  }

  /**
   * 创建完整项目
   */
  async createProject(projectName, requirement) {
    console.log('='.repeat(80));
    console.log(`🚀 开始创建项目：${projectName}`);
    console.log('='.repeat(80));
    
    // 步骤 1：分析项目
    const analysis = this.analyzeProject(requirement);
    console.log(`\n📊 项目分析:`);
    console.log(`   类型：${analysis.projectType}`);
    console.log(`   模块数：${analysis.modules.length}`);
    console.log(`   文件数：${analysis.totalFiles}`);
    
    // 步骤 2：创建文件夹结构
    const baseDir = await this.createProjectStructure(projectName, analysis.projectType);
    console.log(`\n✅ 项目结构创建完成：${baseDir}`);
    
    // 步骤 3：填充文件内容
    const fillResult = await this.fillFileContent(
      baseDir,
      analysis.projectType,
      projectName,
      analysis.modules
    );
    
    console.log(`\n📄 文件生成统计:`);
    console.log(`   成功：${fillResult.success}/${fillResult.total}`);
    console.log(`   成功率：${fillResult.rate}`);
    
    // 步骤 4：生成总结
    console.log('\n' + '='.repeat(80));
    console.log('✅ 项目创建完成！');
    console.log('='.repeat(80));
    console.log(`\n项目位置：${baseDir}`);
    console.log(`项目类型：${analysis.projectType}`);
    console.log(`模块数量：${analysis.modules.length}`);
    console.log(`文件数量：${fillResult.total}`);
    
    return {
      success: true,
      projectType: analysis.projectType,
      baseDir,
      modules: analysis.modules,
      files: fillResult
    };
  }
}

// 导出
export default ProjectCreator;
