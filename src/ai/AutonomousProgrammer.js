/**
 * 自主编程引擎 v2.0
 * 能够自主搜索、学习并编写代码，支持多种语言和框架
 */

class AutonomousProgrammer {
  constructor() {
    // 编程知识图谱
    this.knowledgeGraph = {
      // 数据结构
      dataStructures: ['array', 'list', 'dict', 'set', 'stack', 'queue', 'tree', 'graph'],
      
      // 算法
      algorithms: ['sort', 'search', 'recursion', 'iteration', 'dynamic_programming'],
      
      // 设计模式
      patterns: ['singleton', 'factory', 'observer', 'decorator', 'strategy', 'state', 'component'],
      
      // 架构模式
      architectures: ['mvc', 'microservices', 'event_driven', 'layered', 'ecs', 'component_based'],
      
      // 编程范式
      paradigms: ['oop', 'functional', 'procedural', 'declarative'],
      
      // 语言支持
    languages: {
      'python': { ext: '.py', type: 'script' },
      'javascript': { ext: '.js', type: 'script' },
      'cpp': { ext: '.cpp', type: 'compiled', header: '.h' },
      'java': { ext: '.java', type: 'compiled' },
      'csharp': { ext: '.cs', type: 'compiled' },
      'typescript': { ext: '.ts', type: 'script' },
      'harmonyos': { ext: '.ets', type: 'script', framework: 'arkts' },
      'ets': { ext: '.ets', type: 'script', framework: 'arkts' },
      'arkts': { ext: '.ets', type: 'script' }
    },
      
      // 框架知识
    frameworks: {
      'unreal_engine': {
        language: 'cpp',
        baseClasses: ['UObject', 'AActor', 'AGameModeBase', 'UActorComponent'],
        macros: ['UCLASS', 'UFUNCTION', 'UPROPERTY', 'GENERATED_BODY'],
        headers: ['CoreMinimal.h', 'GameFramework/GameModeBase.h', 'CoreUObject.h']
      },
      'unity': {
        language: 'csharp',
        baseClasses: ['MonoBehaviour', 'ScriptableObject'],
        attributes: ['SerializeField', 'HideInInspector']
      },
      'flask': {
        language: 'python',
        decorators: ['@app.route', '@blueprint.route']
      },
      'express': {
        language: 'javascript',
        patterns: ['middleware', 'router']
      },
      'harmonyos': {
        language: 'ets',
        baseClasses: ['Component', 'CustomDialog'],
        decorators: ['@Component', '@Builder', '@State', '@Prop', '@Link', '@Watch'],
        lifecycle: ['aboutToAppear', 'aboutToDisappear', 'onPageShow', 'onPageHide'],
        components: ['Text', 'Button', 'Column', 'Row', 'Stack', 'Image', 'TextInput', 'Tabs', 'TabContent'],
        patterns: ['MVVM', 'Navigation', 'EventEmitter']
      },
      'arkts': {
        language: 'ets',
        decorators: ['@Component', '@Builder', '@State', '@Prop', '@Link'],
        patterns: ['declarative_ui', 'reactive_programming']
      }
    }
    };
    
    // 图片资源库（动态加载）
    this.imageResources = {
      available: false,
      path: '',
      files: [],
      analysis: {}
    };
    
    // 自主学习能力
    this.learningCapability = {
      enabled: true,
      searchEngines: ['google', 'bing'],
      knowledgeSources: ['official_docs', 'github', 'stackoverflow', 'tutorials'],
      learningHistory: []
    };
    
    // 问题类型识别器
    this.problemTypes = {
      'game': ['游戏', '玩', '猜', '棋', '牌', '闯关'],
      'tool': ['工具', '脚本', '自动化', '批处理'],
      'system': ['系统', '管理', '监控', '服务'],
      'data': ['数据', '分析', '统计', '图表'],
      'web': ['网站', '网页', 'API', '接口'],
      'file': ['文件', '读写', '处理', '解析'],
      'network': ['网络', '爬虫', '下载', '上传'],
      'ui': ['界面', 'GUI', '窗口', '按钮'],
      'algorithm': ['算法', '计算', '优化', '求解'],
      'harmonyos': ['HarmonyOS', '鸿蒙', '华为', 'Harmony', 'ETS', 'ArkTS', '鸿蒙应用']
    };
    
    // 代码生成策略
    this.strategies = {
      'simple': this.simpleStrategy.bind(this),      // 简单直接
      'modular': this.modularStrategy.bind(this),    // 模块化
      'oop': this.oopStrategy.bind(this),            // 面向对象
      'functional': this.functionalStrategy.bind(this), // 函数式
      'image_driven': this.imageDrivenStrategy.bind(this) // 图片驱动
    };
  }

  /**
   * 自主编程核心方法 v2.0
   * @param {string} requirement - 需求描述
   * @param {object} options - 选项
   */
  async program(requirement, options = {}) {
    console.log(`\n🤖 自主编程引擎 v2.0 启动`);
    console.log(`   需求：${requirement}`);
    
    // 步骤 0：扫描图片资源（如果有）
    const imagePath = options.imagePath || 'F:\\openclaw\\projects\\HarmonyOS\\HarmonyOS_Demo\\img\\media';
    await this.scanImageResources(imagePath);
    
    // 步骤 1：自主学习（如果需要）
    if (this.learningCapability.enabled && !options.skipLearning) {
      await this.searchAndLearn(requirement, options);
    }
    
    // 步骤 2：理解需求
    const understanding = this.understand(requirement);
    console.log(`\n📖 需求理解:`);
    console.log(`   类型：${understanding.type}`);
    console.log(`   语言：${understanding.language}`);
    console.log(`   复杂度：${understanding.complexity}`);
    console.log(`   核心功能：${understanding.coreFeatures.join(', ')}`);
    
    // 自动设置语言选项（从理解结果中获取）
    if (!options.language && understanding.language) {
      options.language = understanding.language;
    }
    
    // 步骤 3：判断是否需要模块化处理
    const isComplexProject = this.isComplexProject(understanding, requirement);
    
    if (isComplexProject && options.modular !== false) {
      console.log(`\n🏗️  检测到复杂项目，启动模块化生成模式...`);
      return await this.programModular(requirement, options, understanding);
    }
    
    // 步骤 4：设计方案
    let design;
    if (options.framework === 'unreal' || understanding.requirement.includes('虚幻')) {
      console.log(`\n🎮 检测到虚幻引擎项目`);
      design = this.designUnrealArchitecture(understanding, options);
    } else {
      design = this.design(understanding, options);
    }
    
    console.log(`\n📐 设计方案:`);
    console.log(`   架构：${design.architecture}`);
    console.log(`   基类：${design.baseClass || 'N/A'}`);
    console.log(`   类名：${design.className || 'N/A'}`);
    console.log(`   模块：${design.modules ? design.modules.length : 0} 个`);
    
    // 步骤 5：选择策略（优先使用图片驱动）
    let strategy = this.selectStrategy(understanding, options);
    
    // 如果有图片资源，使用图片驱动策略
    if (this.imageResources.available) {
      console.log(`\n🎨 检测到图片资源，使用图片驱动策略`);
      strategy = 'image_driven';
    }
    
    console.log(`\n🎯 编程策略：${strategy}`);
    
    // 步骤 6：编写代码
    let code;
    if (options.framework === 'unreal' || understanding.requirement.includes('虚幻')) {
      code = this.generateUnrealCPP(understanding, design);
      console.log(`\n✅ 虚幻引擎 C++ 代码生成完成`);
      console.log(`   头文件：${design.className}.h`);
      console.log(`   源文件：${design.className}.cpp`);
    } else {
      code = await this.writeCode(understanding, design, strategy, options);
      console.log(`\n✅ 代码生成完成`);
      console.log(`   行数：${code.split('\n').length}`);
      console.log(`   语言：${options.language || understanding.language || 'unknown'}`);
    }
    
    // 步骤 7：自我审查
    const review = this.review(code, understanding);
    console.log(`\n🔍 代码审查:`);
    console.log(`   质量：${review.quality}/100`);
    console.log(`   建议：${review.suggestions.length} 条`);
    
    const result = {
      success: true,
      code,
      understanding,
      design,
      strategy,
      review,
      filename: this.generateFilename(understanding, options.language || 'cpp')
    };
    
    // 步骤 8：自动保存文件（如果后端服务可用）
    if (options.autoSave !== false) {
      await this.saveGeneratedFile(result);
    }
    
    return result;
  }

  /**
   * 判断是否是复杂项目
   */
  isComplexProject(understanding, requirement) {
    const complexKeywords = [
      '项目', '系统', '平台', '框架',
      '多模块', '多页面', '多组件',
      '企业级', '商业级', '大型',
      '完整', '全套', '整个'
    ];
    
    const hasComplexKeyword = complexKeywords.some(kw => requirement.includes(kw));
    const isHarmonyOS = understanding.language === 'ets';
    const hasMultipleFiles = requirement.includes('.ets') || requirement.includes('页面') || requirement.includes('模块');
    
    return hasComplexKeyword || (isHarmonyOS && hasMultipleFiles);
  }

  /**
   * 模块化生成大型项目
   */
  async programModular(requirement, options, understanding) {
    try {
      console.log(`\n📦 模块化生成模式启动...`);
      
      // 步骤 1: 分析项目结构
      const projectStructure = await this.analyzeProjectStructure(requirement, understanding);
      console.log(`\n📋 项目结构:`);
      console.log(`   模块数：${projectStructure.modules.length}`);
      console.log(`   文件数：${projectStructure.files.length}`);
      
      // 步骤 2: 逐个生成模块
      const generatedModules = [];
      
      for (let i = 0; i < projectStructure.modules.length; i++) {
        const module = projectStructure.modules[i];
        console.log(`\n[${i + 1}/${projectStructure.modules.length}] 生成模块：${module.name}`);
        
        try {
          const moduleCode = await this.generateModule(module, requirement, understanding, options);
          generatedModules.push({
            ...module,
            code: moduleCode.code,
            filename: moduleCode.filename
          });
          
          // 保存模块文件
          if (options.autoSave !== false) {
            await this.saveGeneratedFile({
              code: moduleCode.code,
              filename: moduleCode.filename,
              success: true
            });
          }
        } catch (error) {
          console.error(`❌ 模块 ${module.name} 生成失败:`, error.message);
          generatedModules.push({
            ...module,
            error: error.message
          });
        }
        
        // 延迟一下，避免请求过快
        if (i < projectStructure.modules.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // 步骤 3: 生成项目总结
      const summary = this.generateProjectSummary(projectStructure, generatedModules);
      
      console.log(`\n📊 项目总结:`);
      console.log(`   成功生成：${summary.successModules}/${summary.totalModules} 个模块`);
      
      if (summary.failedModules > 0) {
        console.log(`   失败模块：${summary.failedModules} 个`);
      }
      
      return {
        success: true,
        modular: true,
        modules: generatedModules,
        summary,
        understanding,
        projectStructure
      };
    } catch (error) {
      console.error(`❌ 模块化生成失败:`, error.message);
      // 返回错误但不抛出，避免未处理的 Promise rejection
      return {
        success: false,
        modular: true,
        error: error.message,
        modules: [],
        summary: {
          totalModules: 0,
          successModules: 0,
          failedModules: 0,
          files: [],
          note: '模块化生成失败'
        }
      };
    }
  }

  /**
   * 分析项目结构
   */
  async analyzeProjectStructure(requirement, understanding) {
    // 对于 HarmonyOS 项目，使用预设结构
    if (understanding.language === 'ets') {
      return {
        modules: [
          { name: '登录模块', type: 'page', file: 'Login.ets' },
          { name: '首页模块', type: 'page', file: 'Home.ets' },
          { name: '灯光控制模块', type: 'page', file: 'Light.ets' },
          { name: '窗帘控制模块', type: 'page', file: 'Curtain.ets' },
          { name: '服务控制模块', type: 'page', file: 'Service.ets' }
        ],
        files: [
          'Login.ets',
          'Home.ets',
          'Light.ets',
          'Curtain.ets',
          'Service.ets'
        ]
      };
    }
    
    // 通用项目结构分析
    return {
      modules: [
        { name: '主模块', type: 'main', file: 'main.py' }
      ],
      files: ['main.py']
    };
  }

  /**
   * 生成单个模块
   */
  async generateModule(module, requirement, understanding, options) {
    try {
      const moduleRequirement = `${requirement}\n\n当前生成：${module.name} (${module.file})`;
      
      const moduleUnderstanding = {
        ...understanding,
        type: module.type,
        module: module.name,  // ✅ 关键：传递模块名称
        language: understanding.language,
        filename: module.file  // ✅ 添加文件名
      };
      
      // 添加调试日志
      console.log(`   📝 生成模块代码：${module.name}`);
      console.log(`   📋 模块语言：${moduleUnderstanding.language}`);
      console.log(`   📄 目标文件：${module.file}`);
      console.log(`   🔍 understanding.module: ${moduleUnderstanding.module}`);
      
      const design = this.design(moduleUnderstanding, options);
      if (!design) {
        throw new Error(`设计失败：${module.name}`);
      }
      
      const strategy = this.selectStrategy(moduleUnderstanding, options);
      if (!strategy) {
        throw new Error(`策略选择失败：${module.name}`);
      }
      
      // 确保 options 中有 language
      if (!options.language && moduleUnderstanding.language) {
        options.language = moduleUnderstanding.language;
      }
      
      // 强制使用模块化策略，确保每个页面独立生成
      const forceStrategy = 'modular';
      console.log(`   🎯 强制使用策略：${forceStrategy} (原策略：${strategy})`);
      
      const code = await this.writeCode(moduleUnderstanding, design, forceStrategy, options);
      if (!code) {
        throw new Error(`代码生成失败：${module.name}`);
      }
      
      console.log(`   ✅ 模块代码生成完成：${code.split('\n').length} 行`);
      console.log(`   📄 返回文件：${module.file}`);
      
      return {
        code,
        filename: module.file  // ✅ 使用 module.file 作为文件名
      };
    } catch (error) {
      console.error(`   ❌ 生成模块失败 [${module.name}]:`, error.message);
      throw error;
    }
  }

  /**
   * 生成项目总结
   */
  generateProjectSummary(projectStructure, generatedModules) {
    const successCount = generatedModules.filter(m => !m.error).length;
    const totalCount = generatedModules.length;
    
    return {
      totalModules: totalCount,
      successModules: successCount,
      failedModules: totalCount - successCount,
      files: generatedModules.map(m => m.filename),
      note: `成功生成 ${successCount}/${totalCount} 个模块`
    };
  }

  /**
   * 保存生成的文件到后端服务器
   */
  async saveGeneratedFile(result) {
    try {
      const { code, filename } = result;
      
      console.log(`\n💾 准备保存文件:`);
      console.log(`   文件名：${filename}`);
      console.log(`   代码行数：${code.split('\n').length}`);
      console.log(`   代码前 5 行:`);
      code.split('\n').slice(0, 5).forEach((line, i) => {
        console.log(`     ${i + 1}: ${line.substring(0, 60)}`);
      });
      
      // 调用后端保存 API
      const response = await fetch('http://localhost:3003/api/file/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: filename,
          content: code,
          projectDir: undefined // 使用默认目录
        })
      });
      
      if (response.ok) {
        const saveResult = await response.json();
        console.log(`\n✅ 文件已自动保存:`);
        console.log(`   路径：${saveResult.path}`);
        console.log(`   大小：${saveResult.size} 字节`);
        console.log(`   返回文件名：${saveResult.filename}`);
      } else {
        console.log(`\n⚠️  文件保存失败：${response.statusText}`);
      }
    } catch (error) {
      console.log(`\n⚠️  文件保存失败：${error.message}`);
      // 不抛出错误，只是记录日志
    }
  }

  /**
   * 扫描和分析图片资源
   * @param {string} imagePath - 图片资源目录路径
   */
  async scanImageResources(imagePath) {
    try {
      console.log(`\n🖼️  开始扫描图片资源...`);
      console.log(`   路径：${imagePath}`);
      
      // 这里应该使用 Node.js 的 fs 模块扫描目录
      // 由于在浏览器环境中，我们通过后端 API 来获取
      const response = await fetch('http://localhost:3003/api/file/scan-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: imagePath })
      });
      
      if (response.ok) {
        const result = await response.json();
        this.imageResources = {
          available: true,
          path: imagePath,
          files: result.files || [],
          analysis: this.analyzeImageNames(result.files || [])
        };
        
        console.log(`✅ 图片资源扫描完成:`);
        console.log(`   文件数：${this.imageResources.files.length}`);
        console.log(`   分析结果：${Object.keys(this.imageResources.analysis).length} 个类别`);
        
        return this.imageResources;
      } else {
        console.log(`⚠️  图片资源扫描失败，使用自主编程模式`);
        this.imageResources.available = false;
        return this.imageResources;
      }
    } catch (error) {
      console.log(`⚠️  图片资源扫描失败：${error.message}，使用自主编程模式`);
      this.imageResources.available = false;
      return this.imageResources;
    }
  }

  /**
   * 分析图片名称，推断 UI 结构和功能
   * @param {string[]} fileNames - 文件名列表
   */
  analyzeImageNames(fileNames) {
    const analysis = {
      pages: {},
      components: [],
      icons: [],
      backgrounds: [],
      buttons: []
    };
    
    for (const fileName of fileNames) {
      const name = fileName.toLowerCase();
      
      // 分析页面类型
      if (name.includes('login') || name.includes('start')) {
        analysis.pages.login = true;
      } else if (name.includes('home')) {
        analysis.pages.home = true;
      } else if (name.includes('light')) {
        analysis.pages.light = true;
      } else if (name.includes('curtain')) {
        analysis.pages.curtain = true;
      } else if (name.includes('service')) {
        analysis.pages.service = true;
      }
      
      // 分析图标类型
      if (name.includes('icon')) {
        analysis.icons.push(fileName);
      }
      
      // 分析背景
      if (name.includes('bg') || name.includes('background')) {
        analysis.backgrounds.push(fileName);
      }
      
      // 分析按钮
      if (name.includes('btn') || name.includes('button')) {
        analysis.buttons.push(fileName);
      }
      
      // 分析功能组件
      if (name.includes('airconditioner') || name.includes('ac')) {
        analysis.components.push({ type: 'air_conditioner', file: fileName });
      }
      if (name.includes('bright') || name.includes('soft') || name.includes('read') || name.includes('warm')) {
        analysis.components.push({ type: 'scene_mode', file: fileName });
      }
      if (name.includes('toggle') || name.includes('switch')) {
        analysis.components.push({ type: 'toggle_switch', file: fileName });
      }
      if (name.includes('tabs')) {
        analysis.components.push({ type: 'tab_navigation', file: fileName });
      }
    }
    
    console.log(`\n📊 图片资源分析结果:`);
    console.log(`   页面：${Object.keys(analysis.pages).join(', ')}`);
    console.log(`   图标：${analysis.icons.length} 个`);
    console.log(`   背景：${analysis.backgrounds.length} 个`);
    console.log(`   按钮：${analysis.buttons.length} 个`);
    console.log(`   组件：${analysis.components.length} 个`);
    
    return analysis;
  }

  /**
   * 图片驱动的编程策略
   * 根据图片资源自动生成对应的 UI 代码
   */
  async imageDrivenStrategy(understanding, design, options) {
    console.log(`\n🎨 图片驱动编程策略启动...`);
    
    if (!this.imageResources.available) {
      console.log(`⚠️  图片资源不可用，回退到模块化策略`);
      return await this.modularStrategy(understanding, design, options);
    }
    
    const { analysis } = this.imageResources;
    const { requirement, projectName = 'HarmonyOS_App' } = understanding;
    
    // 根据图片分析结果生成对应的页面
    if (analysis.pages.login && analysis.pages.home && analysis.pages.light) {
      console.log(`✅ 检测到智慧客房系统图片资源`);
      return this.generateSmartRoomSystem(understanding, design);
    }
    
    // 通用图片驱动生成
    return this.generateGenericImageDrivenApp(understanding, design, analysis);
  }

  /**
   * 生成通用图片驱动应用
   */
  generateGenericImageDrivenApp(understanding, design, analysis) {
    const { projectName = 'HarmonyOS_App' } = understanding;
    
    let code = `/**
 * ${projectName}
 * 图片资源驱动生成
 * MVVM 架构 | V2 状态管理
 */

import router from '@ohos.router';
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct GeneratedApp {
  @State message: string = '${projectName}';
  @State currentTab: string = 'home';

  build() {
    Column() {
      // 顶部导航
      Row() {
        Text(this.message)
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
      }
      .width('100%')
      .padding(20)
      .backgroundColor('#007DFF')

      // 内容区域 - 使用图片资源
      Scroll() {
        Column() {
          // 根据图片资源生成 UI 组件
          ${this.generateUIComponentsFromImages(analysis)}
        }
        .width('100%')
        .padding(20)
      }
      .layoutWeight(1)

      // 底部导航 - 如果有 tabs 图片
      ${analysis.components.some(c => c.type === 'tab_navigation') ? this.generateTabBar(analysis) : ''}
    }
    .width('100%')
    .height('100%')
  }
}
`;
    
    return code;
  }

  /**
   * 根据图片资源生成 UI 组件
   */
  generateUIComponentsFromImages(analysis) {
    let components = '';
    
    // 生成背景
    if (analysis.backgrounds.length > 0) {
      components += `
      // 背景图片
      Image($r('app.media.${analysis.backgrounds[0].replace('.png', '').replace('.jpg', '')}'))
        .width('100%')
        .height(200)
        .objectFit(ImageFit.Cover)
        .margin({ bottom: 20 })
`;
    }
    
    // 生成图标按钮
    if (analysis.icons.length > 0) {
      components += `
      // 功能图标
      Flex({ wrap: FlexWrap.Wrap }) {
        ${analysis.icons.slice(0, 6).map(icon => `
        Column() {
          Image($r('app.media.${icon.replace('.png', '')}'))
            .width(40)
            .height(40)
          Text('${icon.replace('.png', '').split('_').pop()}')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .margin({ right: 15, bottom: 15 })
        .onClick(() => {
          promptAction.showToast({
            message: '点击：${icon.replace('.png', '')}',
            duration: 1500
          });
        })
        `).join('')}
      }
      .width('100%')
      .justify(FlexAlign.Start)
`;
    }
    
    return components;
  }

  /**
   * 生成底部导航栏
   */
  generateTabBar(analysis) {
    const tabs = analysis.components
      .filter(c => c.type === 'tab_navigation')
      .map(t => t.file.replace('.png', '').split('_').pop())
      .slice(0, 4);
    
    return `
      // 底部导航栏
      Row() {
        ${tabs.map((tab, index) => `
        Column() {
          Image(this.currentTab === '${tab}' ? $r('app.media.tabs_icon_${tab}_select') : $r('app.media.tabs_icon_${tab}_unselect'))
            .width(24)
            .height(24)
          Text('${tab}')
            .fontSize(12)
            .margin({ top: 4 })
            .fontColor(this.currentTab === '${tab}' ? '#007DFF' : '#666666')
        }
        .onClick(() => {
          this.currentTab = '${tab}';
        })
        `).join('')}
      }
      .width('100%')
      .height(60)
      .backgroundColor('#FFFFFF')
      .justify(FlexAlign.SpaceEvenly)
      .alignItems(VerticalAlign.Center)
      .shadow({
        radius: 8,
        color: 'rgba(0, 0, 0, 0.1)',
        offsetX: 0,
        offsetY: -2
      })
`;
  }

  /**
   * 理解需求
   */
  understand(requirement) {
    const lowerReq = requirement.toLowerCase();
    
    // 识别问题类型
    let type = 'general';
    let maxScore = 0;
    
    for (const [problemType, keywords] of Object.entries(this.problemTypes)) {
      const score = keywords.filter(kw => lowerReq.includes(kw)).length;
      if (score > maxScore) {
        maxScore = score;
        type = problemType;
      }
    }
    
    // 自动识别编程语言
    const language = this.detectLanguage(requirement, type);
    
    // 提取核心功能
    const coreFeatures = this.extractCoreFeatures(requirement);
    
    // 评估复杂度
    const complexity = this.assessComplexity(requirement, coreFeatures);
    
    // 识别约束条件
    const constraints = this.extractConstraints(requirement);
    
    return {
      type,
      language,
      complexity,
      coreFeatures,
      constraints,
      requirement: requirement,
      originalRequirement: requirement
    };
  }

  /**
   * 自动识别编程语言
   */
  detectLanguage(requirement, type) {
    const lowerReq = requirement.toLowerCase();
    
    // HarmonyOS 识别
    if (lowerReq.includes('harmonyos') || lowerReq.includes('鸿蒙') || 
        lowerReq.includes('华为') || lowerReq.includes('ets') || 
        lowerReq.includes('arkts')) {
      return 'ets';
    }
    
    // TypeScript/JavaScript 识别
    if (lowerReq.includes('typescript') || lowerReq.includes('ts ') || 
        lowerReq.includes('react') || lowerReq.includes('vue') || 
        lowerReq.includes('angular')) {
      return 'typescript';
    }
    
    // Python 识别
    if (lowerReq.includes('python') || lowerReq.includes('py ') || 
        lowerReq.includes('脚本') || type === 'tool') {
      return 'python';
    }
    
    // C++ 识别
    if (lowerReq.includes('c++') || lowerReq.includes('cpp') || 
        lowerReq.includes('虚幻') || lowerReq.includes('unreal')) {
      return 'cpp';
    }
    
    // Java 识别
    if (lowerReq.includes('java') || lowerReq.includes('android')) {
      return 'java';
    }
    
    // C# 识别
    if (lowerReq.includes('c#') || lowerReq.includes('csharp') || 
        lowerReq.includes('unity')) {
      return 'csharp';
    }
    
    // 默认返回 TypeScript（现代 Web 开发常用）
    return 'typescript';
  }

  /**
   * 提取核心功能
   */
  extractCoreFeatures(requirement) {
    const features = [];
    
    // 功能关键词
    const featureKeywords = {
      '输入输出': ['输入', '输出', '读取', '写入', '打印'],
      '数据处理': ['处理', '转换', '过滤', '排序', '统计'],
      '用户交互': ['交互', '界面', '菜单', '提示', '输入'],
      '文件操作': ['文件', '保存', '加载', '导出', '导入'],
      '网络功能': ['网络', '请求', '下载', '上传', '爬虫'],
      '图形界面': ['窗口', '按钮', '菜单', '界面', 'GUI'],
      '数据存储': ['存储', '数据库', '缓存', '记录'],
      '自动化': ['自动', '批量', '定时', '触发'],
      '算法': ['算法', '计算', '优化', '搜索', '排序']
    };
    
    for (const [category, keywords] of Object.entries(featureKeywords)) {
      if (keywords.some(kw => requirement.includes(kw))) {
        features.push(category);
      }
    }
    
    // 如果没有识别到特定功能，默认为基础功能
    if (features.length === 0) {
      features.push('基础功能');
    }
    
    return features;
  }

  /**
   * 评估复杂度
   */
  assessComplexity(requirement, features) {
    let score = 0;
    
    // 需求长度
    if (requirement.length > 50) score += 1;
    if (requirement.length > 100) score += 1;
    
    // 功能数量
    score += features.length;
    
    // 特殊要求
    if (requirement.includes('界面')) score += 2;
    if (requirement.includes('数据库')) score += 2;
    if (requirement.includes('网络')) score += 1;
    if (requirement.includes('多线程')) score += 2;
    if (requirement.includes('实时')) score += 1;
    
    if (score <= 2) return 'simple';
    if (score <= 5) return 'medium';
    return 'complex';
  }

  /**
   * 提取约束条件
   */
  extractConstraints(requirement) {
    const constraints = [];
    
    if (requirement.includes('必须') || requirement.includes('一定要')) {
      constraints.push('强制要求');
    }
    if (requirement.includes('不能') || requirement.includes('禁止')) {
      constraints.push('禁止事项');
    }
    if (requirement.includes('性能')) {
      constraints.push('性能要求');
    }
    if (requirement.includes('安全')) {
      constraints.push('安全要求');
    }
    
    return constraints;
  }

  /**
   * 设计架构
   */
  design(understanding, options = {}) {
    const { type, complexity, coreFeatures } = understanding;
    
    // 选择架构
    let architecture;
    if (type === 'game') {
      // 检测是否是虚幻引擎
      if (options.framework === 'unreal' || understanding.requirement.includes('虚幻') || understanding.requirement.includes('unreal')) {
        architecture = 'unreal_component';
      } else {
        architecture = 'game_loop';
      }
    } else if (type === 'tool') {
      architecture = 'procedural';
    } else if (type === 'system') {
      architecture = 'layered';
    } else if (type === 'web') {
      architecture = 'mvc';
    } else {
      architecture = 'modular';
    }
    
    // 选择设计模式
    const patterns = [];
    if (coreFeatures.includes('用户交互')) {
      patterns.push('observer');
    }
    if (complexity === 'complex') {
      patterns.push('factory');
      patterns.push('strategy');
    }
    if (type === 'game') {
      patterns.push('state');
    }
    
    // 划分模块
    const modules = this.createModules(understanding);
    
    return {
      architecture,
      patterns,
      modules,
      dataFlow: this.designDataFlow(modules)
    };
  }

  /**
   * 创建模块
   */
  createModules(understanding) {
    const modules = [];
    const { type, coreFeatures } = understanding;
    
    // 通用模块
    modules.push({
      name: 'main',
      responsibility: '程序入口和主流程控制',
      dependencies: []
    });
    
    // 根据功能添加模块
    if (coreFeatures.includes('输入输出')) {
      modules.push({
        name: 'io_handler',
        responsibility: '处理输入输出',
        dependencies: ['main']
      });
    }
    
    if (coreFeatures.includes('数据处理')) {
      modules.push({
        name: 'data_processor',
        responsibility: '数据处理和转换',
        dependencies: ['main']
      });
    }
    
    if (coreFeatures.includes('用户交互')) {
      modules.push({
        name: 'ui_controller',
        responsibility: '用户界面控制',
        dependencies: ['main', 'io_handler']
      });
    }
    
    if (coreFeatures.includes('文件操作')) {
      modules.push({
        name: 'file_manager',
        responsibility: '文件读写和管理',
        dependencies: ['main']
      });
    }
    
    // 游戏特有模块
    if (understanding.type === 'game') {
      modules.push({
        name: 'game_logic',
        responsibility: '游戏逻辑和规则',
        dependencies: ['main']
      });
      modules.push({
        name: 'game_state',
        responsibility: '游戏状态管理',
        dependencies: ['game_logic']
      });
    }
    
    return modules;
  }

  /**
   * 设计虚幻引擎架构
   */
  designUnrealArchitecture(understanding, options) {
    const { coreFeatures } = understanding;
    
    // 确定基类
    let baseClass = 'GameModeBase';
    let className = 'MyGameMode';
    
    if (coreFeatures.includes('角色控制')) {
      baseClass = 'Character';
      className = 'MyCharacter';
    } else if (coreFeatures.includes('组件')) {
      baseClass = 'ActorComponent';
      className = 'MyComponent';
    } else if (coreFeatures.includes('Actor')) {
      baseClass = 'Actor';
      className = 'MyActor';
    }
    
    return {
      architecture: 'unreal_component',
      baseClass,
      className,
      projectName: options.projectName || 'MyProject',
      features: coreFeatures,
      modules: [
        { name: 'GameMode', responsibility: '游戏模式控制' },
        { name: 'PlayerController', responsibility: '玩家输入控制' },
        { name: 'GameState', responsibility: '游戏状态管理' },
        { name: 'HUD', responsibility: 'UI 显示' }
      ]
    };
  }

  /**
   * 自主搜索和学习
   */
  async searchAndLearn(requirement, options = {}) {
    console.log(`\n🔍 启动自主学习...`);
    console.log(`   目标：${requirement}`);
    
    // 生成搜索查询
    const searchQueries = this.generateSearchQueries(requirement);
    console.log(`   搜索查询：${searchQueries.join(', ')}`);
    
    // 这里应该调用搜索 API，但现在先模拟
    const searchResults = await this.mockSearchResults(requirement);
    
    // 提取知识
    const knowledge = this.extractKnowledge(searchResults);
    
    // 更新知识图谱
    this.updateKnowledgeGraph(knowledge);
    
    return knowledge;
  }

  /**
   * 生成搜索查询
   */
  generateSearchQueries(requirement) {
    const queries = [];
    
    // 基础查询
    queries.push(`${requirement} 教程`);
    queries.push(`${requirement} 实现`);
    
    // 技术查询
    if (requirement.includes('虚幻') || requirement.includes('unreal')) {
      queries.push('Unreal Engine C++ GameMode 示例');
      queries.push('UE5 RPG GameMode tutorial');
      queries.push('Unreal Engine GameModeBase example');
    }
    
    // 框架查询
    if (requirement.includes('RPG')) {
      queries.push('RPG game system design');
      queries.push('RPG 游戏属性系统');
      queries.push('RPG inventory system unreal');
    }
    
    return queries;
  }

  /**
   * 模拟搜索结果（应该调用真实 API）
   */
  async mockSearchResults(requirement) {
    // 这里应该调用真实的搜索 API
    // 现在返回模拟数据
    return {
      documentation: [
        {
          title: 'Unreal Engine GameMode 文档',
          url: 'https://docs.unrealengine.com/',
          content: 'GameMode 定义游戏规则，包括得分、胜利条件、玩家生成等'
        },
        {
          title: 'C++ 编程指南',
          url: 'https://dev.epicgames.com/',
          content: '虚幻引擎 C++ 编程基础，UCLASS、UFUNCTION、UPROPERTY 宏的使用'
        }
      ],
      examples: [
        {
          title: 'RPG GameMode 示例',
          code: 'AGameModeBase subclass with RPG features'
        }
      ],
      bestPractices: [
        '使用 GameModeBase 作为基类',
        '使用 UPROPERTY 宏标记需要在蓝图中访问的属性',
        '使用 UFUNCTION 宏暴露函数给蓝图',
        '遵循虚幻引擎的命名规范'
      ]
    };
  }

  /**
   * 提取知识
   */
  extractKnowledge(searchResults) {
    const knowledge = {
      patterns: [],
      bestPractices: [],
      codeTemplates: [],
      commonMistakes: []
    };
    
    // 从搜索结果中提取
    if (searchResults.bestPractices) {
      knowledge.bestPractices = searchResults.bestPractices;
    }
    
    return knowledge;
  }

  /**
   * 更新知识图谱
   */
  updateKnowledgeGraph(knowledge) {
    // 将学到的知识添加到知识图谱
    if (knowledge.patterns) {
      this.knowledgeGraph.patterns.push(...knowledge.patterns);
    }
    if (knowledge.bestPractices) {
      this.knowledgeGraph.bestPractices = knowledge.bestPractices;
    }
    
    console.log(`✅ 知识图谱已更新`);
  }

  /**
   * 设计数据流
   */
  designDataFlow(modules) {
    return modules.map(m => m.name).join(' -> ');
  }

  /**
   * 选择编程策略
   */
  selectStrategy(understanding) {
    const { type, complexity } = understanding;
    
    if (complexity === 'simple') {
      return 'simple';
    } else if (type === 'game' || type === 'system') {
      return 'oop';
    } else if (type === 'data') {
      return 'functional';
    } else {
      return 'modular';
    }
  }

  /**
   * 编写代码
   */
  async writeCode(understanding, design, strategy, options) {
    const strategyFn = this.strategies[strategy];
    return await strategyFn(understanding, design, options);
  }

  /**
   * 简单策略 - 直接编写
   */
  async simpleStrategy(understanding, design, options) {
    const language = options.language || understanding.language || 'typescript';
    
    console.log(`\n📝 简单策略 - 语言：${language}`);
    
    if (language === 'python') {
      return this.generateSimplePython(understanding);
    } else if (language === 'cpp') {
      return this.generateSimpleCPP(understanding);
    } else if (language === 'javascript') {
      return this.generateSimpleJavaScript(understanding);
    } else if (language === 'ets' || language === 'harmonyos' || language === 'arkts') {
      console.log(`   🎯 调用 HarmonyOS 代码生成`);
      return this.generateHarmonyOSApp(understanding);
    } else if (language === 'typescript') {
      return this.generateTypeScript(understanding);
    }
    
    throw new Error(`不支持的语言：${language}`);
  }

  /**
   * 生成简单 C++ 代码
   */
  generateSimpleCPP(understanding) {
    const { type, coreFeatures } = understanding;
    
    let code = `/**
 * 自主生成的 C++ 程序
 * 类型：${type}
 * 功能：${coreFeatures.join(', ')}
 */

#include <iostream>
#include <string>
#include <vector>
`;

    if (type === 'game') {
      code += `#include <random>
#include <chrono>
`;
    }

    code += `
using namespace std;

`;

    // 类定义
    if (type === 'game') {
      code += `
/**
 * 游戏类
 */
class Game {
private:
    bool isRunning;
    int score;
    
public:
    Game() : isRunning(false), score(0) {
        cout << "游戏对象创建" << endl;
    }
    
    ~Game() {
        cout << "游戏对象销毁" << endl;
    }
    
    void initialize() {
        cout << "游戏初始化..." << endl;
        isRunning = true;
        score = 0;
    }
    
    void run() {
        if (!isRunning) {
            cout << "游戏未初始化" << endl;
            return;
        }
        
        cout << "游戏循环开始" << endl;
        
        // 游戏主循环
        while (isRunning) {
            handleInput();
            update();
            render();
            
            if (isGameOver()) {
                break;
            }
        }
        
        cout << "游戏结束！" << endl;
    }
    
    void handleInput() {
        // TODO: 实现输入处理
        cout << "等待输入..." << endl;
    }
    
    void update() {
        // TODO: 实现游戏逻辑更新
        cout << "更新游戏状态..." << endl;
    }
    
    void render() {
        // TODO: 实现渲染
        cout << "渲染画面..." << endl;
    }
    
    bool isGameOver() {
        // TODO: 实现结束条件
        return false;
    }
    
    void stop() {
        isRunning = false;
        cout << "游戏停止" << endl;
    }
};

`;
    }

    // 主函数
    code += `
/**
 * 主函数
 */
int main() {
    cout << "程序启动..." << endl;
    
`;

    if (type === 'game') {
      code += `    // 创建游戏
    Game game;
    
    // 初始化
    game.initialize();
    
    // 运行
    game.run();
`;
    } else {
      code += `    // TODO: 实现主逻辑
    cout << "执行主逻辑..." << endl;
`;
    }

    code += `
    cout << "程序结束" << endl;
    return 0;
}
`;

    return code;
  }

  /**
   * 生成虚幻引擎 C++ 代码
   */
  generateUnrealCPP(understanding, design) {
    const { coreFeatures } = understanding;
    
    // 生成头文件
    let header = `// ${design.className}.h
#pragma once

#include "CoreMinimal.h>
`;

    // 添加需要的头文件
    if (design.baseClass) {
      if (design.baseClass.includes('GameMode')) {
        header += `#include "GameFramework/GameModeBase.h"
`;
      } else if (design.baseClass.includes('Actor')) {
        header += `#include "GameFramework/Actor.h"
`;
      } else if (design.baseClass.includes('Component')) {
        header += `#include "Components/ActorComponent.h"
`;
      }
    }

    header += `#include "${design.className}.generated.h"

`;

    // UCLASS 宏和类定义
    header += `UCLASS()
class ${design.projectName}API A${design.className} : public A${design.baseClass}
{
	GENERATED_BODY()
	
public:
	// 构造函数
	A${design.className}();

protected:
	// 开始游戏
	virtual void BeginPlay() override;

public:	
	// 每帧调用
	virtual void Tick(float DeltaTime) override;

`;

    // 添加属性
    if (coreFeatures.includes('状态管理')) {
      header += `
	// 游戏状态
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game")
	int32 GameState;
	
	// 是否正在游戏
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game")
	bool bIsPlaying;
`;
    }

    // 添加函数
    if (coreFeatures.includes('玩家控制')) {
      header += `
	// 开始游戏函数
	UFUNCTION(BlueprintCallable, Category = "Game")
	void StartGame();
	
	// 结束游戏函数
	UFUNCTION(BlueprintCallable, Category = "Game")
	void EndGame();
`;
    }

    header += `};
`;

    // 生成 CPP 文件
    let cpp = `// ${design.className}.cpp

#include "${design.className}.h"
#include "Engine/World.h"
#include "GameFramework/PlayerController.h"

A${design.className}::A${design.className}()
{
	// 构造函数初始化
	PrimaryActorTick.bCanEverTick = true;
	
`;

    if (coreFeatures.includes('状态管理')) {
      cpp += `	GameState = 0;
	bIsPlaying = false;
`;
    }

    cpp += `}

void A${design.className}::BeginPlay()
{
	Super::BeginPlay();
	
	UE_LOG(LogTemp, Log, TEXT("${design.className} 开始游戏"));
}

void A${design.className}::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	
	// TODO: 实现每帧逻辑
}

`;

    if (coreFeatures.includes('玩家控制')) {
      cpp += `void A${design.className}::StartGame()
{
	bIsPlaying = true;
	GameState = 1;
	
	UE_LOG(LogTemp, Log, TEXT("游戏开始"));
}

void A${design.className}::EndGame()
{
	bIsPlaying = false;
	GameState = 0;
	
	UE_LOG(LogTemp, Log, TEXT("游戏结束"));
}

`;
    }

    return {
      header,
      cpp,
      className: design.className,
      baseClass: design.baseClass
    };
  }

  /**
   * 模块化策略
   */
  async modularStrategy(understanding, design, options) {
    const language = options.language || understanding.language || 'python';
    
    console.log(`\n📦 模块化策略 - 语言：${language}`);
    console.log(`   🔍 understanding.module: ${understanding.module || 'undefined'}`);
    console.log(`   🔍 understanding.filename: ${understanding.filename || 'undefined'}`);
    console.log(`   🔍 design.modules: ${design.modules?.length || 0} 个`);
    
    if (language === 'python') {
      return this.generateModularPython(understanding, design);
    } else if (language === 'ets' || language === 'harmonyos' || language === 'arkts') {
      console.log(`   🎯 调用 generateModularHarmonyOS，当前模块：${understanding.module}`);
      return this.generateModularHarmonyOS(understanding, design);
    } else if (language === 'typescript') {
      return this.generateModularTypeScript(understanding, design);
    } else if (language === 'javascript') {
      return this.generateModularJavaScript(understanding, design);
    } else if (language === 'cpp') {
      return this.generateModularCPP(understanding, design);
    }
    
    throw new Error(`不支持的语言：${language}`);
  }

  /**
   * 面向对象策略
   */
  async oopStrategy(understanding, design, options) {
    const language = options.language || 'python';
    
    if (language === 'python') {
      return this.generateOOPPython(understanding, design);
    }
    
    throw new Error(`不支持的语言：${language}`);
  }

  /**
   * 函数式策略
   */
  async functionalStrategy(understanding, design, options) {
    const language = options.language || 'python';
    
    if (language === 'python') {
      return this.generateFunctionalPython(understanding, design);
    }
    
    throw new Error(`不支持的语言：${language}`);
  }

  /**
   * 生成简单 Python 代码
   */
  generateSimplePython(understanding) {
    const { type, coreFeatures } = understanding;
    
    let code = `"""
自主生成的 Python 程序
类型：${type}
功能：${coreFeatures.join(', ')}
"""

`;
    
    // 添加导入
    if (coreFeatures.includes('数据处理') || type === 'game') {
      code += `import random\n`;
    }
    if (coreFeatures.includes('输入输出')) {
      code += `import sys\n`;
    }
    code += `\n`;
    
    // 主函数
    code += `def main():
    """主函数"""
    print("程序启动...")
    
`;
    
    // 根据类型添加逻辑
    if (type === 'game') {
      code += `    # 游戏初始化
    print("游戏初始化...")
    
    # 游戏循环
    while True:
        # 处理输入
        user_input = input("请输入：")
        
        # 处理逻辑
        result = process_input(user_input)
        
        # 显示结果
        print(f"结果：{result}")
        
        # 检查结束
        if is_game_over():
            break
    
    print("游戏结束！")

`;
    } else if (type === 'tool') {
      code += `    # 工具初始化
    print("工具初始化...")
    
    # 处理数据
    data = load_data()
    result = process_data(data)
    
    # 输出结果
    save_result(result)
    print("处理完成！")

`;
    } else {
      code += `    # 业务逻辑
    # TODO: 实现具体功能
    print("执行业务逻辑...")

`;
    }
    
    // 辅助函数
    code += `
def process_input(user_input):
    """处理输入"""
    # TODO: 实现处理逻辑
    return user_input


def is_game_over():
    """检查游戏是否结束"""
    # TODO: 实现结束条件
    return False


def load_data():
    """加载数据"""
    # TODO: 实现数据加载
    return []


def process_data(data):
    """处理数据"""
    # TODO: 实现数据处理
    return data


def save_result(result):
    """保存结果"""
    # TODO: 实现结果保存
    print(f"保存结果：{result}")


if __name__ == "__main__":
    main()
`;
    
    return code;
  }

  /**
   * 生成模块化 Python 代码
   */
  generateModularPython(understanding, design) {
    const { modules } = design;
    
    let code = `"""
模块化 Python 程序
自主生成
"""

`;
    
    // 生成每个模块
    for (const module of modules) {
      code += `
# ====================
# 模块：${module.name}
# 职责：${module.responsibility}
# ====================

class ${this.toClassName(module.name)}:
    """${module.name} 模块"""
    
    def __init__(self):
        """初始化"""
        pass
    
    def process(self, *args, **kwargs):
        """处理逻辑"""
        # TODO: 实现具体逻辑
        pass


`;
    }
    
    // 主程序
    code += `
# ====================
# 主程序
# ====================

def main():
    """主函数"""
    print("程序启动...")
    
    # 初始化模块
`;
    
    for (const module of modules) {
      if (module.name !== 'main') {
        code += `    ${module.name}_handler = ${this.toClassName(module.name)}()\n`;
      }
    }
    
    code += `
    # 运行主逻辑
    # TODO: 实现主流程
    
    print("程序运行完成！")


if __name__ == "__main__":
    main()
`;
    
    return code;
  }

  /**
   * 生成模块化 HarmonyOS/ArkTS 代码 - 增强版
   * 每个页面独立生成，包含完整的业务逻辑
   */
  async generateModularHarmonyOS(understanding, design) {
    const { modules } = design;
    const { requirement, projectName = 'HarmonyOS_App' } = understanding;
    const currentModule = understanding.module; // 当前模块名称
    
    // 添加调试日志
    console.log(`\n🏗️  generateModularHarmonyOS 调用:`);
    console.log(`   当前模块：${currentModule || 'undefined'}`);
    console.log(`   模块总数：${modules?.length || 0}`);
    console.log(`   需求：${requirement.substring(0, 50)}...`);
    console.log(`   understanding.filename: ${understanding.filename || 'undefined'}`);
    
    // 检测是否是智慧客房系统
    const isSmartRoom = requirement.includes('智慧客房') || requirement.includes('酒店') || 
                        requirement.includes('客房控制') || requirement.includes('空调') ||
                        requirement.includes('灯光控制') || requirement.includes('窗帘');
    
    if (isSmartRoom) {
      // 根据当前模块名称生成对应的页面
      const roomNumber = this.extractRoomNumber(requirement) || '2002';
      
      // 模块名称映射到页面生成方法
      const moduleMap = {
        'login': 'Login.ets',
        '登录': 'Login.ets',
        '登录模块': 'Login.ets',
        'home': 'Home.ets',
        '首页': 'Home.ets',
        '首页模块': 'Home.ets',
        'light': 'Light.ets',
        '灯光': 'Light.ets',
        '灯光控制模块': 'Light.ets',
        'curtain': 'Curtain.ets',
        '窗帘': 'Curtain.ets',
        '窗帘控制模块': 'Curtain.ets',
        'service': 'Service.ets',
        '服务': 'Service.ets',
        '服务控制模块': 'Service.ets'
      };
      
      // 确定当前应该生成哪个页面
      let targetPage = 'Login.ets'; // 默认
      let matched = false;
      
      if (currentModule) {
        console.log(`   🔍 正在匹配模块：${currentModule}`);
        for (const [moduleName, fileName] of Object.entries(moduleMap)) {
          if (currentModule.toLowerCase().includes(moduleName.toLowerCase())) {
            targetPage = fileName;
            matched = true;
            console.log(`   ✅ 匹配成功：${currentModule} -> ${fileName} (匹配关键词：${moduleName})`);
            break;
          }
        }
        
        if (!matched) {
          console.log(`   ⚠️  未找到匹配，使用默认值：Login.ets`);
        }
      } else {
        console.log(`   ⚠️  currentModule 为 undefined，使用默认值：Login.ets`);
      }
      
      // 生成对应的页面代码 - 使用 AI 真正生成，不是调用模板
      console.log(`   📝 生成页面：${targetPage}`);
      console.log(`   🤖 使用 AI 根据需求生成代码（参考模板结构）...`);
      
      const generatedCode = await this.generateHarmonyOSPageWithAI(
        targetPage,
        requirement,
        projectName,
        roomNumber,
        modules
      );
      
      console.log(`   ✅ AI 生成完成，代码行数：${generatedCode.split('\n').length}`);
      console.log(`   📄 前 5 行代码预览:`);
      generatedCode.split('\n').slice(0, 5).forEach((line, i) => {
        console.log(`      ${i + 1}: ${line.substring(0, 60)}`);
      });
      
      return generatedCode;
    }
    
    // 通用 HarmonyOS 应用 - 每个页面独立生成
    console.log(`   ⚠️  非智慧客房系统，使用通用生成`);
    return this.generateGenericHarmonyOSModular(understanding, design);
  }

  /**
   * 使用 AI 生成 HarmonyOS 页面代码（参考模板结构，但根据需求生成独特代码）
   */
  async generateHarmonyOSPageWithAI(filename, requirement, projectName, roomNumber, modules) {
    console.log(`\n🎨 AIHarmonyOSPageWithAI 调用:`);
    console.log(`   文件名：${filename}`);
    console.log(`   项目：${projectName}`);
    console.log(`   需求：${requirement.substring(0, 100)}...`);
    
    // 1. 加载参考模板（作为样例，不是直接使用）
    let templateCode = '';
    let templateDescription = '';
    
    switch (filename) {
      case 'Login.ets':
        templateCode = this.generateLoginPage(projectName, roomNumber);
        templateDescription = '登录页面模板 - 展示高质量的登录界面实现';
        break;
      case 'Home.ets':
        templateCode = this.generateHomePage(projectName, roomNumber);
        templateDescription = '首页模板 - 展示 MVVM 架构和状态管理';
        break;
      case 'Light.ets':
        templateCode = this.generateLightPage(projectName);
        templateDescription = '灯光控制页面模板 - 展示复杂状态管理和 UI 控制';
        break;
      case 'Curtain.ets':
        templateCode = this.generateCurtainPage(projectName);
        templateDescription = '窗帘控制页面模板 - 展示双设备协同控制';
        break;
      case 'Service.ets':
        templateCode = this.generateServicePage(projectName);
        templateDescription = '服务控制页面模板 - 展示对话框和紧急呼叫功能';
        break;
    }
    
    // 2. 使用 AI 参考模板生成新的代码
    const aiPrompt = `你是一个资深的 HarmonyOS 应用开发工程师。请根据用户需求和参考模板，生成一个独特的${filename}页面代码。

## 用户需求
${requirement}

## 项目信息
- 项目名称：${projectName}
- 房号：${roomNumber || '2002'}
- 模块总数：${modules?.length || 5}

## 参考模板（学习其结构和质量，不要直接复制）
${templateDescription}

参考代码片段（前 100 行）：
${templateCode.split('\n').slice(0, 100).join('\n')}

## 你的任务
**参考模板的代码结构、注释风格、状态管理方式**，但**根据用户需求生成独特的代码**。

### 代码要求
1. 使用 ArkTS 语言
2. 使用 V2 装饰器（@Observed, @Watch）
3. MVVM 架构模式
4. 详细的中文注释
5. 完整的生命周期方法（aboutToAppear, aboutToDisappear）
6. 实现真实的业务逻辑，不要 TODO 注释
7. 使用资源引用（$r('app.media.xxx')）
8. 包含错误处理和用户反馈
9. 代码行数：300-500 行

### 必须包含的内容
- 导入语句（router, promptAction, @kit.ArkUI 等）
- 数据模型定义（使用@Observed 装饰的类）
- 组件定义（@Entry, @Component）
- 状态管理（@State, @Prop, @Link, @Watch）
- 生命周期方法
- UI 构建（build 方法）
- 业务逻辑方法（至少 5 个方法）

### 注意事项
- 参考模板的代码质量，但不要复制模板内容
- 根据用户需求调整功能和 UI
- 确保代码可以编译运行
- 变量和方法名称要有意义

请生成完整的${filename}文件代码。只返回代码，不要其他内容。`;

    try {
      console.log(`   🤖 使用模型：qwen3:30b`);
      console.log(`   📝 AI 正在参考模板并生成新代码...`);
      
      const code = await openClawClient.chat('qwen3:30b', [
        {
          role: 'system',
          content: '你是一个资深的 HarmonyOS 应用开发工程师，擅长编写高质量、可维护的 ArkTS 代码。你会参考优秀代码示例，但会根据需求生成独特的实现。'
        },
        {
          role: 'user',
          content: aiPrompt
        }
      ], {
        temperature: 0.7,  // 保持一定创造性
        maxTokens: 8192,
        timeout: 600000    // 10 分钟超时
      }, 'complex_code');
      
      console.log(`   ✅ AI 生成完成`);
      
      // 验证生成的代码
      if (!code || code.length < 100) {
        console.log(`   ⚠️  生成的代码过短，使用模板作为后备`);
        return templateCode;
      }
      
      return code;
    } catch (error) {
      console.error(`   ❌ AI 生成失败：${error.message}`);
      console.log(`   ⚠️  使用模板代码作为后备`);
      return templateCode;
    }
  }

  /**
   * 生成通用 HarmonyOS 模块化应用（每个页面独立）
   */
  generateGenericHarmonyOSModular(understanding, design) {
    const { modules } = design;
    const projectName = understanding.projectName || 'HarmonyOS_App';
    
    // 返回所有页面的代码映射
    const pagesCode = [];
    
    for (const module of modules) {
      const pageCode = this.generateSingleHarmonyOSPage(module, projectName, modules);
      pagesCode.push({
        filename: `${module.file}`,
        code: pageCode
      });
    }
    
    // 返回第一个页面的代码（后续会改进为返回多个文件）
    return pagesCode.length > 0 ? pagesCode[0].code : '';
  }

  /**
   * 生成单个 HarmonyOS 页面
   */
  generateSingleHarmonyOSPage(module, projectName, allModules) {
    const className = this.toClassName(module.name);
    const isMainModule = module.name.toLowerCase().includes('main') || 
                         module.name.toLowerCase().includes('home') ||
                         module.name.toLowerCase().includes('index');
    
    let code = `/**
 * ${projectName}
 * 页面：${module.name}
 * 职责：${module.responsibility || '应用功能模块'}
 * 自主生成
 */

import router from '@ohos.router';
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct ${className} {
  @State message: string = 'Welcome to ${module.name}';

  build() {
    Column() {
      Text(this.message)
        .fontSize(28)
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: 30 })

      // ${module.name} 内容区域
      Column() {
        Text('这是${module.name}页面')
          .fontSize(18)
          .fontColor('#333333')
          .margin({ bottom: 20 })
        
        // TODO: 实现${module.name}具体功能
        Text('功能开发中...')
          .fontSize(14)
          .fontColor('#666666')
      }
      .width('100%')
      .padding(20)
      .backgroundColor('#F5F5F5')
      .borderRadius(10)

      // 页面导航
      if (${isMainModule ? 'false' : 'true'}) {
        Button('返回首页')
          .onClick(() => {
            router.replaceUrl({
              url: '/pages/Index'
            });
          })
          .margin({ top: 30 })
          .width('80%')
          .backgroundColor('#007DFF')
      }
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .padding(20)
  }
}
`;
    
    return code;
  }

  /**
   * 生成模块化 TypeScript 代码
   */
  generateModularTypeScript(understanding, design) {
    const { modules } = design;
    
    let code = `/**
 * 模块化 TypeScript 程序
 * 自主生成
 */

`;
    
    // 生成每个模块
    for (const module of modules) {
      code += `
// ====================
// 模块：${module.name}
// 职责：${module.responsibility}
// ====================

export class ${this.toClassName(module.name)} {
  private name: string = '${module.name}';

  constructor() {
    console.log(\`初始化 \${this.name} 模块\`);
  }

  process(...args: any[]): void {
    // TODO: 实现具体逻辑
    console.log(\`\${this.name} 模块处理中...\`);
  }
}

`;
    }
    
    // 主程序
    code += `
// ====================
// 主程序
// ====================

import { ${modules.filter(m => m.name !== 'main').map(m => this.toClassName(m.name)).join(', ')} } from './modules';

function main() {
  console.log('程序启动...');
  
  // 初始化模块
`;
    
    for (const module of modules) {
      if (module.name !== 'main') {
        code += `  const ${module.name}Handler = new ${this.toClassName(module.name)}();\n`;
      }
    }
    
    code += `
  // 运行主逻辑
  // TODO: 实现主流程
  
  console.log('程序运行完成！');
}

main();
`;
    
    return code;
  }

  /**
   * 生成模块化 JavaScript 代码
   */
  generateModularJavaScript(understanding, design) {
    const { modules } = design;
    
    let code = `/**
 * 模块化 JavaScript 程序
 * 自主生成
 */

`;
    
    // 生成每个模块
    for (const module of modules) {
      code += `
// ====================
// 模块：${module.name}
// 职责：${module.responsibility}
// ====================

class ${this.toClassName(module.name)} {
  constructor() {
    this.name = '${module.name}';
    console.log(\`初始化 \${this.name} 模块\`);
  }

  process(...args) {
    // TODO: 实现具体逻辑
    console.log(\`\${this.name} 模块处理中...\`);
  }
}

`;
    }
    
    // 主程序
    code += `
// ====================
// 主程序
// ====================

function main() {
  console.log('程序启动...');
  
  // 初始化模块
`;
    
    for (const module of modules) {
      if (module.name !== 'main') {
        code += `  const ${module.name}Handler = new ${this.toClassName(module.name)}();\n`;
      }
    }
    
    code += `
  // 运行主逻辑
  // TODO: 实现主流程
  
  console.log('程序运行完成！');
}

main();
`;
    
    return code;
  }

  /**
   * 生成模块化 C++ 代码
   */
  generateModularCPP(understanding, design) {
    const { modules } = design;
    
    let code = `/**
 * 模块化 C++ 程序
 * 自主生成
 */

#include <iostream>
#include <string>
#include <memory>

`;
    
    // 生成每个模块的类声明
    for (const module of modules) {
      code += `
// ====================
// 模块：${module.name}
// 职责：${module.responsibility}
// ====================

class ${this.toClassName(module.name)} {
public:
    ${this.toClassName(module.name)}() {
        std::cout << "初始化 ${module.name} 模块" << std::endl;
    }
    
    void process() {
        // TODO: 实现具体逻辑
        std::cout << "${module.name} 模块处理中..." << std::endl;
    }
};

`;
    }
    
    // 主程序
    code += `
// ====================
// 主程序
// ====================

int main() {
    std::cout << "程序启动..." << std::endl;
    
    // 初始化模块
`;
    
    for (const module of modules) {
      if (module.name !== 'main') {
        code += `    std::shared_ptr<${this.toClassName(module.name)}> ${module.name}Handler(new ${this.toClassName(module.name)}());\n`;
      }
    }
    
    code += `
    // 运行主逻辑
    // TODO: 实现主流程
    
    std::cout << "程序运行完成！" << std::endl;
    
    return 0;
}
`;
    
    return code;
  }

  /**
   * 生成面向对象 Python 代码
   */
  generateOOPPython(understanding, design) {
    const { type } = understanding;
    
    let code = `"""
面向对象 Python 程序
类型：${type}
自主生成
"""

from abc import ABC, abstractmethod
from typing import Any, Optional


`;
    
    // 基类
    code += `
class BaseComponent(ABC):
    """基础组件类"""
    
    def __init__(self, name: str):
        self.name = name
        self.initialized = False
    
    @abstractmethod
    def initialize(self) -> bool:
        """初始化"""
        pass
    
    @abstractmethod
    def process(self, data: Any) -> Any:
        """处理数据"""
        pass
    
    @abstractmethod
    def cleanup(self) -> None:
        """清理资源"""
        pass


`;
    
    // 具体组件
    if (type === 'game') {
      code += `
class GameComponent(BaseComponent):
    """游戏组件"""
    
    def __init__(self):
        super().__init__("Game")
        self.state = "idle"
        self.score = 0
    
    def initialize(self) -> bool:
        """初始化游戏"""
        print(f"{self.name} 初始化...")
        self.state = "running"
        self.initialized = True
        return True
    
    def process(self, data: Any) -> Any:
        """处理游戏逻辑"""
        if not self.initialized:
            raise RuntimeError("游戏未初始化")
        
        # 处理输入
        user_input = data
        result = self.handle_input(user_input)
        
        # 更新状态
        self.update_state(result)
        
        return result
    
    def handle_input(self, user_input: str) -> Any:
        """处理用户输入"""
        # TODO: 实现输入处理
        return user_input
    
    def update_state(self, result: Any) -> None:
        """更新游戏状态"""
        # TODO: 实现状态更新
        pass
    
    def cleanup(self) -> None:
        """清理游戏"""
        print(f"{self.name} 清理...")
        self.state = "stopped"


`;
    }
    
    // 管理器
    code += `
class SystemManager:
    """系统管理器"""
    
    def __init__(self):
        self.components = []
        self.running = False
    
    def add_component(self, component: BaseComponent) -> None:
        """添加组件"""
        self.components.append(component)
    
    def start(self) -> None:
        """启动系统"""
        print("系统启动...")
        
        # 初始化所有组件
        for component in self.components:
            component.initialize()
        
        self.running = True
        self.run()
    
    def run(self) -> None:
        """运行系统"""
        # TODO: 实现运行循环
        pass
    
    def stop(self) -> None:
        """停止系统"""
        print("系统停止...")
        
        # 清理所有组件
        for component in self.components:
            component.cleanup()
        
        self.running = False


`;
    
    // 主程序
    code += `

def main():
    """主函数"""
    # 创建系统
    system = SystemManager()
    
    # 添加组件
`;
    
    if (type === 'game') {
      code += `    game = GameComponent()
    system.add_component(game)
`;
    }
    
    code += `
    # 启动系统
    system.start()


if __name__ == "__main__":
    main()
`;
    
    return code;
  }

  /**
   * 生成函数式 Python 代码
   */
  generateFunctionalPython(understanding, design) {
    let code = `"""
函数式 Python 程序
自主生成
"""

from functools import reduce
from typing import List, Callable, Any


`;
    
    // 纯函数
    code += `
# ====================
# 纯函数定义
# ====================

def transform(data: Any) -> Any:
    """数据转换"""
    # TODO: 实现转换逻辑
    return data


def filter_data(data: List[Any], predicate: Callable[[Any], bool]) -> List[Any]:
    """过滤数据"""
    return list(filter(predicate, data))


def map_data(data: List[Any], mapper: Callable[[Any], Any]) -> List[Any]:
    """映射数据"""
    return list(map(mapper, data))


def reduce_data(data: List[Any], reducer: Callable[[Any, Any], Any], initial: Any) -> Any:
    """归约数据"""
    return reduce(reducer, data, initial)


`;
    
    // 函数组合
    code += `
# ====================
# 函数组合
# ====================

def compose(*functions: Callable) -> Callable:
    """函数组合"""
    def composed_func(x):
        for func in reversed(functions):
            x = func(x)
        return x
    return composed_func


def pipeline(data: Any, *operations: Callable) -> Any:
    """数据处理管道"""
    return reduce(lambda acc, op: op(acc), operations, data)


`;
    
    // 主程序
    code += `

# ====================
# 主程序
# ====================

def main():
    """主函数"""
    print("函数式程序启动...")
    
    # 示例数据
    data = [1, 2, 3, 4, 5]
    
    # 使用管道处理
    result = pipeline(
        data,
        lambda x: filter_data(x, lambda n: n > 2),
        lambda x: map_data(x, lambda n: n * 2),
        lambda x: reduce_data(x, lambda a, b: a + b, 0)
    )
    
    print(f"结果：{result}")
    
    # 使用函数组合
    process = compose(
        lambda x: x * 2,
        lambda x: x + 1,
        lambda x: x ** 2
    )
    
    result2 = process(5)
    print(f"组合函数结果：{result2}")


if __name__ == "__main__":
    main()
`;
    
    return code;
  }

  /**
   * 代码审查
   */
  review(code, understanding) {
    // 如果是虚幻引擎代码（对象形式）
    if (typeof code === 'object' && code.header && code.cpp) {
      return this.reviewUnrealCode(code, understanding);
    }
    
    const lines = code.split('\n');
    let quality = 100;
    const suggestions = [];
    
    // 检查代码长度
    if (lines.length > 500) {
      quality -= 10;
      suggestions.push('代码过长，建议拆分模块');
    }
    
    // 检查注释
    const commentLines = lines.filter(line => line.includes('#') || line.includes('"""') || line.includes('//') || line.includes('/*'));
    if (commentLines.length < lines.length * 0.1) {
      quality -= 15;
      suggestions.push('注释不足，建议增加文档字符串');
    }
    
    // 检查 TODO
    const todoCount = lines.filter(line => line.includes('TODO')).length;
    if (todoCount > 5) {
      quality -= 10;
      suggestions.push(`有 ${todoCount} 个 TODO 待实现`);
    }
    
    // 检查函数复杂度
    const functionCount = lines.filter(line => line.includes('def ') || line.includes('void ') || line.includes('int ') || line.includes('function ')).length;
    if (functionCount > 20) {
      quality -= 5;
      suggestions.push('函数过多，考虑简化结构');
    }
    
    // 基础质量分
    quality = Math.max(60, quality);
    
    return {
      quality,
      suggestions,
      metrics: {
        lines: lines.length,
        functions: functionCount,
        comments: commentLines.length,
        todos: todoCount
      }
    };
  }

  /**
   * 审查虚幻引擎代码
   */
  reviewUnrealCode(code, understanding) {
    const headerLines = code.header.split('\n');
    const cppLines = code.cpp.split('\n');
    const totalLines = headerLines.length + cppLines.length;
    
    let quality = 100;
    const suggestions = [];
    
    // 检查是否使用 UCLASS 宏
    if (!code.header.includes('UCLASS()')) {
      quality -= 20;
      suggestions.push('缺少 UCLASS 宏，虚幻引擎无法识别该类');
    }
    
    // 检查是否使用 GENERATED_BODY
    if (!code.header.includes('GENERATED_BODY()')) {
      quality -= 15;
      suggestions.push('缺少 GENERATED_BODY() 宏');
    }
    
    // 检查是否使用 UPROPERTY
    const hasUProperty = code.header.includes('UPROPERTY(');
    if (hasUProperty) {
      quality += 5; // 奖励使用 UPROPERTY
    }
    
    // 检查是否使用 UFUNCTION
    const hasUFunction = code.header.includes('UFUNCTION(');
    if (hasUFunction) {
      quality += 5; // 奖励使用 UFUNCTION
    }
    
    // 检查日志
    const hasLogging = code.cpp.includes('UE_LOG');
    if (hasLogging) {
      quality += 5; // 奖励使用日志
    } else {
      suggestions.push('建议添加 UE_LOG 用于调试');
    }
    
    // 检查代码长度
    if (totalLines > 300) {
      quality -= 5;
      suggestions.push('代码较长，考虑拆分到多个文件');
    }
    
    quality = Math.max(70, quality);
    
    return {
      quality,
      suggestions,
      metrics: {
        lines: totalLines,
        headerLines: headerLines.length,
        cppLines: cppLines.length,
        hasUProperty: hasUProperty,
        hasUFunction: hasUFunction,
        hasLogging: hasLogging
      }
    };
  }

  /**
   * 生成 HarmonyOS 应用代码
   */
  generateHarmonyOSApp(understanding) {
    const { type, coreFeatures, requirement } = understanding;
    
    // 检测是否是智慧客房系统
    const isSmartRoom = requirement.includes('智慧客房') || requirement.includes('酒店') || 
                        requirement.includes('客房控制') || requirement.includes('空调') ||
                        requirement.includes('灯光控制');
    
    if (isSmartRoom) {
      return this.generateSmartRoomSystem(understanding);
    }
    
    // 通用 HarmonyOS 应用
    return this.generateGenericHarmonyOSApp(understanding);
  }

  /**
   * 生成智慧客房系统代码 - 完整版
   * 包含所有 5 个页面：Login, Home, Light, Curtain, Service
   * 每个页面都是独立的 .ets 文件
   */
  generateSmartRoomSystem(understanding, design) {
    const { projectName = 'HarmonyOS_App', requirement } = understanding;
    
    // 根据需求提取房号等信息
    const roomNumber = this.extractRoomNumber(requirement) || '2002';
    
    // 生成所有页面代码
    const pages = {
      'Login.ets': this.generateLoginPage(projectName, roomNumber),
      'Home.ets': this.generateHomePage(projectName, roomNumber),
      'Light.ets': this.generateLightPage(projectName),
      'Curtain.ets': this.generateCurtainPage(projectName),
      'Service.ets': this.generateServicePage(projectName)
    };
    
    // 返回主页面代码（后续会改进为返回多个文件）
    return pages['Login.ets'];
  }

  /**
   * 提取房号
   */
  extractRoomNumber(requirement) {
    const match = requirement.match(/房号 (\d+)/);
    return match ? match[1] : null;
  }

  /**
   * 生成登录页面 - 根据需求文档定制（使用实际图片资源）
   */
  generateLoginPage(projectName, roomNumber) {
    return `/**
 * ${projectName} - 登录页面
 * 智慧客房系统 HarmonyOS 应用
 * MVVM 架构 | V2 状态管理 | Navigation 导航
 * 多设备适配：手机、平板、折叠屏
 * 图片资源：F:\\openclaw\\projects\\HarmonyOS\\HarmonyOS_Demo\\img\\media
 */

import router from '@ohos.router';
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct Login {
  // V2 状态管理装饰器
  @State roomNumber: string = '${roomNumber}';
  @State username: string = '';
  @State rememberMe: boolean = false;
  @State isLoading: boolean = false;

  // 生命周期
  aboutToAppear() {
    console.info('Login page aboutToAppear');
    this.loadSavedCredentials();
  }

  aboutToDisappear() {
    console.info('Login page aboutToDisappear');
  }

  // 加载保存的凭证
  loadSavedCredentials() {
    if (this.rememberMe) {
      // TODO: 从首选项加载保存的房号和用户名
      console.info('Loading saved credentials...');
    }
  }

  // 保存凭证
  saveCredentials() {
    if (this.rememberMe) {
      // TODO: 保存到首选项
      console.info('Saving credentials...');
    }
  }

  // 处理登录
  handleLogin() {
    if (!this.roomNumber || !this.username) {
      promptAction.showToast({
        message: '请输入房号和用户名',
        duration: 2000
      });
      return;
    }

    this.isLoading = true;
    
    // 模拟登录验证
    setTimeout(() => {
      this.isLoading = false;
      this.saveCredentials();
      
      promptAction.showToast({
        message: '登录成功，欢迎入住',
        duration: 1500
      });
      
      // 导航到首页
      router.replaceUrl({
        url: 'pages/Home',
        params: {
          roomNumber: this.roomNumber,
          username: this.username
        }
      });
    }, 1000);
  }

  build() {
    Column() {
      // 背景 - 虚化的酒店客房内景
      Stack() {
        // 背景图片 - 使用实际资源
        Image($r('app.media.bg_hotel_full'))
          .width('100%')
          .height('100%')
          .objectFit(ImageFit.Cover)
          .opacity(0.3)

        // 主内容
        Column() {
          // 顶部标题区域
          Column() {
            Text('广科•未来酒店')
              .fontSize(32)
              .fontWeight(FontWeight.Bold)
              .fontColor('#D4AF37') // 金色
              .margin({ bottom: 8 })

            Text('华为 ICT 学院专属智慧旅居体验')
              .fontSize(14)
              .fontColor('#CCCCCC')
              .margin({ top: 4 })
          }
          .width('100%')
          .padding({ top: 60, bottom: 40 })
          .alignItems(HorizontalAlign.Center)

          // 登录表单
          Column() {
            // 房号输入框
            Column() {
              Text('房号')
                .fontSize(14)
                .fontColor('#D4AF37')
                .margin({ bottom: 8 })
                .fontWeight(FontWeight.Medium)

              Row() {
                Image($r('app.media.icon_input_room'))
                  .width(24)
                  .height(24)
                  .margin({ right: 12 })
                
                TextInput({ 
                  placeholder: '请输入房号，例如：${roomNumber}',
                  text: this.roomNumber
                })
                  .onChange((value: string) => {
                    this.roomNumber = value;
                  })
                  .layoutWeight(1)
                  .backgroundColor('transparent')
              }
              .padding({ left: 16, right: 16, top: 14, bottom: 14 })
              .backgroundColor('rgba(212, 175, 55, 0.1)')
              .borderRadius(12)
              .border({
                width: 1,
                color: 'rgba(212, 175, 55, 0.3)'
              })
            }
            .width('85%')
            .margin({ bottom: 24 })

            // 用户名输入框
            Column() {
              Text('用户名')
                .fontSize(14)
                .fontColor('#D4AF37')
                .margin({ bottom: 8 })
                .fontWeight(FontWeight.Medium)

              Row() {
                Image($r('app.media.icon_input_user'))
                  .width(24)
                  .height(24)
                  .margin({ right: 12 })
                
                TextInput({ 
                  placeholder: '请输入用户名，例如：xiao',
                  text: this.username
                })
                  .onChange((value: string) => {
                    this.username = value;
                  })
                  .layoutWeight(1)
                  .backgroundColor('transparent')
              }
              .padding({ left: 16, right: 16, top: 14, bottom: 14 })
              .backgroundColor('rgba(212, 175, 55, 0.1)')
              .borderRadius(12)
              .border({
                width: 1,
                color: 'rgba(212, 175, 55, 0.3)'
              })
            }
            .width('85%')
            .margin({ bottom: 24 })

            // 记住我
            Row() {
              Checkbox({ name: 'remember', group: 'login' })
                .select(this.rememberMe)
                .onChange((isChecked: boolean) => {
                  this.rememberMe = isChecked;
                })
                .color('#D4AF37')
              
              Text('记住我的信息')
                .fontSize(14)
                .fontColor('#CCCCCC')
                .margin({ left: 8 })
            }
            .width('85%')
            .justify(FlexAlign.Start)
            .margin({ bottom: 40 })

            // 立即入住按钮
            Button(this.isLoading ? '登录中...' : '立即入住')
              .width('85%')
              .height(50)
              .fontSize(18)
              .fontWeight(FontWeight.Medium)
              .fontColor('#FFFFFF')
              .backgroundColor('#D4AF37') // 金色
              .enabled(!this.isLoading)
              .onClick(() => {
                this.handleLogin();
              })
              .shadow({
                radius: 16,
                color: 'rgba(212, 175, 55, 0.4)',
                offsetX: 0,
                offsetY: 4
              })
          }
          .alignItems(HorizontalAlign.Center)

          // 底部文案
          Column() {
            Text('重塑智慧旅居体验，让科技赋能每一次下榻')
              .fontSize(12)
              .fontColor('#999999')
              .margin({ bottom: 8 })

            Text('欢迎回家，尽享舒适之旅')
              .fontSize(12)
              .fontColor('#999999')
          }
          .width('100%')
          .position({ x: 0, y: 'calc(100% - 80px)' })
          .alignItems(HorizontalAlign.Center)
        }
        .width('100%')
        .height('100%')
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#1A1A1A') // 深色背景
  }
}

export default Login;
`;
  }

  /**
   * 生成首页页面
   */
  generateHomePage(projectName, roomNumber) {
    return `/**
 * ${projectName} - 首页
 * 智慧客房系统 HarmonyOS 应用
 * MVVM 架构 | V2 状态管理 | Navigation 导航
 */

import router from '@ohos.router';
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct Home {
  // 空调状态
  @State acEnabled: boolean = false;
  @State acTemperature: number = 26;
  @State acMode: string = '制冷';
  
  // 场景模式
  @State selectedScene: string = '';
  
  // 快捷服务
  @State dndMode: boolean = false;
  @State cleanMode: boolean = false;
  @State nightMode: boolean = false;

  // 当前导航
  @State currentTab: string = 'home';

  aboutToAppear() {
    console.info('Home page aboutToAppear');
    this.loadRoomStatus();
  }

  // 加载房间状态
  loadRoomStatus() {
    // TODO: 从服务器加载房间设备状态
    console.info('Loading room status...');
  }

  // 切换场景模式
  switchScene(scene: string) {
    this.selectedScene = scene;
    promptAction.showToast({
      message: \`已切换到\${scene}模式\`,
      duration: 1500
    });
  }

  // 切换快捷服务
  toggleService(service: string) {
    if (service === 'dnd') {
      this.dndMode = !this.dndMode;
    } else if (service === 'clean') {
      this.cleanMode = !this.cleanMode;
    } else if (service === 'night') {
      this.nightMode = !this.nightMode;
      if (this.nightMode) {
        this.allLightsOff();
      }
    }
  }

  // 关闭所有灯光
  allLightsOff() {
    promptAction.showToast({
      message: '已关闭所有灯光',
      duration: 1500
    });
  }

  // 导航到指定页面
  navigateTo(page: string) {
    router.pushUrl({
      url: \`pages/\${page}\`
    });
  }

  build() {
    Column() {
      // 头部区域
      Column() {
        Text('智慧客房')
          .fontSize(28)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333')
          .margin({ bottom: 8 })
        
        Text(\`欢迎回家，房号\${roomNumber}\`)
          .fontSize(16)
          .fontColor('#666666')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 20, bottom: 15 })
      .backgroundColor('#F5F7FA')

      Scroll() {
        Column() {
          // 空调控制模块
          Column() {
            Row() {
              Image($r('app.media.ac_icon'))
                .width(32)
                .height(32)
              
              Text('空调控制')
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
                .margin({ left: 12 })
              
              Blank()
              
              Toggle({ type: ToggleType.Switch, isOn: this.acEnabled })
                .selectedColor('#007DFF')
                .onChange((isOn: boolean) => {
                  this.acEnabled = isOn;
                })
            }
            .width('100%')
            .margin({ bottom: 20 })

            // 空调状态
            Row() {
              Column() {
                Text('当前温度')
                  .fontSize(12)
                  .fontColor('#999999')
                Text('28°C')
                  .fontSize(20)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#333333')
              }
              .alignItems(HorizontalAlign.Center)

              Column() {
                Text('设定温度')
                  .fontSize(12)
                  .fontColor('#999999')
                Text(\`\${this.acTemperature}°C\`)
                  .fontSize(20)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#007DFF')
              }
              .alignItems(HorizontalAlign.Center)
              .margin({ left: 30 })

              Blank()

              // 温度调节
              Row() {
                Button('-')
                  .width(36)
                  .height(36)
                  .fontSize(20)
                  .onClick(() => {
                    if (this.acTemperature > 16) {
                      this.acTemperature--;
                    }
                  })
                
                Button('+')
                  .width(36)
                  .height(36)
                  .fontSize(20)
                  .margin({ left: 10 })
                  .onClick(() => {
                    if (this.acTemperature < 30) {
                      this.acTemperature++;
                    }
                  })
              }
            }
            .width('100%')
            .padding(15)
            .backgroundColor('#F5F7FA')
            .borderRadius(12)

            // 场景模式
            Column() {
              Text('场景模式')
                .fontSize(16)
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 15 })
                .alignSelf(ItemAlign.Start)

              Grid() {
                Row() {
                  // 明亮模式
                  Column() {
                    Image($r('app.media.bright_icon'))
                      .width(40)
                      .height(40)
                    Text('明亮模式')
                      .fontSize(12)
                      .margin({ top: 8 })
                  }
                  .onClick(() => this.switchScene('bright'))

                  // 柔和模式
                  Column() {
                    Image($r('app.media.soft_icon'))
                      .width(40)
                      .height(40)
                    Text('柔和模式')
                      .fontSize(12)
                      .margin({ top: 8 })
                  }
                  .onClick(() => this.switchScene('soft'))
                }
                .width('100%')
                .justify(FlexAlign.SpaceEvenly)

                Row() {
                  // 阅读模式
                  Column() {
                    Image($r('app.media.read_icon'))
                      .width(40)
                      .height(40)
                    Text('阅读模式')
                      .fontSize(12)
                      .margin({ top: 8 })
                  }
                  .onClick(() => this.switchScene('read'))

                  // 温馨模式
                  Column() {
                    Image($r('app.media.warm_icon'))
                      .width(40)
                      .height(40)
                    Text('温馨模式')
                      .fontSize(12)
                      .margin({ top: 8 })
                  }
                  .onClick(() => this.switchScene('warm'))
                }
                .width('100%')
                .justify(FlexAlign.SpaceEvenly)
                .margin({ top: 15 })
              }
              .width('100%')
            }
            .width('100%')
            .padding(20)
            .backgroundColor('#FFFFFF')
            .borderRadius(12)
            .margin({ top: 15 })

            // 快捷服务
            Column() {
              Text('快捷服务')
                .fontSize(16)
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 15 })
                .alignSelf(ItemAlign.Start)

              Grid() {
                Row() {
                  // 请勿打扰
                  Column() {
                    Image($r('app.media.dnd_icon'))
                      .width(40)
                      .height(40)
                    Text('请勿打扰')
                      .fontSize(12)
                      .margin({ top: 8 })
                  }
                  .onClick(() => this.toggleService('dnd'))

                  // 清理房间
                  Column() {
                    Image($r('app.media.clean_icon'))
                      .width(40)
                      .height(40)
                    Text('清理房间')
                      .fontSize(12)
                      .margin({ top: 8 })
                  }
                  .onClick(() => this.toggleService('clean'))
                }
                .width('100%')
                .justify(FlexAlign.SpaceEvenly)

                Row() {
                  // 晚安模式
                  Column() {
                    Image($r('app.media.night_icon'))
                      .width(40)
                      .height(40)
                    Text('晚安模式')
                      .fontSize(12)
                      .margin({ top: 8 })
                  }
                  .onClick(() => this.toggleService('night'))
                }
                .width('100%')
                .justify(FlexAlign.Center)
                .margin({ top: 15 })
              }
              .width('100%')
            }
            .width('100%')
            .padding(20)
            .backgroundColor('#FFFFFF')
            .borderRadius(12)
            .margin({ top: 15 })
          }
          .width('100%')
          .padding(20)
        }
        .width('100%')
      }
      .layoutWeight(1)

      // 底部导航栏
      Row() {
        Column() {
          Image($r('app.media.home_tab_icon'))
            .width(24)
            .height(24)
          Text('首页')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .onClick(() => this.navigateTo('Home'))

        Column() {
          Image($r('app.media.light_tab_icon'))
            .width(24)
            .height(24)
          Text('灯光')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .onClick(() => this.navigateTo('Light'))

        Column() {
          Image($r('app.media.curtain_tab_icon'))
            .width(24)
            .height(24)
          Text('窗帘')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .onClick(() => this.navigateTo('Curtain'))

        Column() {
          Image($r('app.media.service_tab_icon'))
            .width(24)
            .height(24)
          Text('服务')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .onClick(() => this.navigateTo('Service'))
      }
      .width('100%')
      .height(60)
      .backgroundColor('#FFFFFF')
      .justify(FlexAlign.SpaceEvenly)
      .alignItems(VerticalAlign.Center)
      .shadow({
        radius: 8,
        color: 'rgba(0, 0, 0, 0.1)',
        offsetX: 0,
        offsetY: -2
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F7FA')
  }
}

export default Home;
`;
  }

  /**
   * 生成灯光控制页面
   */
  generateLightPage(projectName) {
    return `/**
 * ${projectName} - 灯光控制页面
 * 智慧客房系统 HarmonyOS 应用
 */

import router from '@ohos.router';
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct Light {
  @State masterSwitch: boolean = false;
  @State selectedScene: string = '';
  @State lights: Record<string, boolean> = {
    'washroom': false,
    'wardrobe': false,
    'floor': false,
    'bar': false,
    'desk': false,
    'right_read': false,
    'left_read': false,
    'fan': false,
    'hall': false
  };

  @State currentTab: string = 'light';

  // 切换总开关
  toggleMasterSwitch() {
    this.masterSwitch = !this.masterSwitch;
    const allOff = !this.masterSwitch;
    
    // 关闭/打开所有灯光
    Object.keys(this.lights).forEach(key => {
      this.lights[key] = !allOff;
    });
    
    promptAction.showToast({
      message: allOff ? '已关闭所有灯光' : '已打开所有灯光',
      duration: 1500
    });
  }

  // 切换场景模式
  switchScene(scene: string) {
    this.selectedScene = scene;
    promptAction.showToast({
      message: \`已切换到\${scene}模式\`,
      duration: 1500
    });
  }

  // 切换单个灯光
  toggleLight(key: string, name: string) {
    this.lights[key] = !this.lights[key];
    promptAction.showToast({
      message: \`\${name}已\${this.lights[key] ? '打开' : '关闭'}\`,
      duration: 1000
    });
  }

  // 导航
  navigateTo(page: string) {
    router.pushUrl({
      url: \`pages/\${page}\`
    });
  }

  build() {
    Column() {
      // 头部
      Text('灯光控制')
        .fontSize(28)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20, bottom: 25 })

      Scroll() {
        Column() {
          // 总开关
          Column() {
            Row() {
              Image(this.masterSwitch ? $r('app.media.power_on_icon') : $r('app.media.power_off_icon'))
                .width(60)
                .height(60)
            }
            .justify(FlexAlign.Center)
            
            Text('总开关')
              .fontSize(16)
              .fontColor('#666666')
              .margin({ top: 10 })
          }
          .onClick(() => this.toggleMasterSwitch())
          .padding(30)
          .backgroundColor('#F5F7FA')
          .borderRadius(16)
          .margin({ bottom: 25 })

          // 场景模式
          Column() {
            Text('场景模式')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .margin({ bottom: 20 })
              .alignSelf(ItemAlign.Start)

            Flex({ wrap: FlexWrap.Wrap }) {
              // 明亮模式
              Column() {
                Image($r('app.media.bright_icon'))
                  .width(45)
                  .height(45)
                Text('明亮模式')
                  .fontSize(12)
                  .margin({ top: 8 })
              }
              .onClick(() => this.switchScene('bright'))

              // 柔和模式
              Column() {
                Image($r('app.media.soft_icon'))
                  .width(45)
                  .height(45)
                Text('柔和模式')
                  .fontSize(12)
                  .margin({ top: 8 })
              }
              .onClick(() => this.switchScene('soft'))

              // 阅读模式
              Column() {
                Image($r('app.media.read_icon'))
                  .width(45)
                  .height(45)
                Text('阅读模式')
                  .fontSize(12)
                  .margin({ top: 8 })
              }
              .onClick(() => this.switchScene('read'))

              // 温馨模式
              Column() {
                Image($r('app.media.warm_icon'))
                  .width(45)
                  .height(45)
                Text('温馨模式')
                  .fontSize(12)
                  .margin({ top: 8 })
              }
              .onClick(() => this.switchScene('warm'))

              // 睡眠模式
              Column() {
                Image($r('app.media.sleep_icon'))
                  .width(45)
                  .height(45)
                Text('睡眠模式')
                  .fontSize(12)
                  .margin({ top: 8 })
              }
              .onClick(() => this.switchScene('sleep'))
            }
            .width('100%')
            .justify(FlexAlign.SpaceEvenly)
          }
          .padding(20)
          .backgroundColor('#FFFFFF')
          .borderRadius(12)
          .margin({ bottom: 20 })

          // 独立控制
          Column() {
            Text('独立控制')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .margin({ bottom: 20 })
              .alignSelf(ItemAlign.Start)

            // 灯光列表
            Column() {
              // 洗漱间
              Row() {
                Text('洗漱间')
                  .fontSize(16)
                
                Blank()
                
                Toggle({ type: ToggleType.Switch, isOn: this.lights['washroom'] })
                  .selectedColor('#007DFF')
                  .onChange(() => this.toggleLight('washroom', '洗漱间'))
              }
              .padding({ top: 15, bottom: 15 })

              // 衣柜间
              Row() {
                Text('衣柜间')
                  .fontSize(16)
                
                Blank()
                
                Toggle({ type: ToggleType.Switch, isOn: this.lights['wardrobe'] })
                  .selectedColor('#007DFF')
                  .onChange(() => this.toggleLight('wardrobe', '衣柜间'))
              }
              .padding({ top: 15, bottom: 15 })

              // 落地灯
              Row() {
                Text('落地灯')
                  .fontSize(16)
                
                Blank()
                
                Toggle({ type: ToggleType.Switch, isOn: this.lights['floor'] })
                  .selectedColor('#007DFF')
                  .onChange(() => this.toggleLight('floor', '落地灯'))
              }
              .padding({ top: 15, bottom: 15 })

              // 吧灯
              Row() {
                Text('吧灯')
                  .fontSize(16)
                
                Blank()
                
                Toggle({ type: ToggleType.Switch, isOn: this.lights['bar'] })
                  .selectedColor('#007DFF')
                  .onChange(() => this.toggleLight('bar', '吧灯'))
              }
              .padding({ top: 15, bottom: 15 })

              // 书桌灯
              Row() {
                Text('书桌灯')
                  .fontSize(16)
                
                Blank()
                
                Toggle({ type: ToggleType.Switch, isOn: this.lights['desk'] })
                  .selectedColor('#007DFF')
                  .onChange(() => this.toggleLight('desk', '书桌灯'))
              }
              .padding({ top: 15, bottom: 15 })

              // 右阅读灯
              Row() {
                Text('右阅读灯')
                  .fontSize(16)
                
                Blank()
                
                Toggle({ type: ToggleType.Switch, isOn: this.lights['right_read'] })
                  .selectedColor('#007DFF')
                  .onChange(() => this.toggleLight('right_read', '右阅读灯'))
              }
              .padding({ top: 15, bottom: 15 })

              // 左阅读灯
              Row() {
                Text('左阅读灯')
                  .fontSize(16)
                
                Blank()
                
                Toggle({ type: ToggleType.Switch, isOn: this.lights['left_read'] })
                  .selectedColor('#007DFF')
                  .onChange(() => this.toggleLight('left_read', '左阅读灯'))
              }
              .padding({ top: 15, bottom: 15 })

              // 排风扇
              Row() {
                Text('排风扇')
                  .fontSize(16)
                
                Blank()
                
                Toggle({ type: ToggleType.Switch, isOn: this.lights['fan'] })
                  .selectedColor('#007DFF')
                  .onChange(() => this.toggleLight('fan', '排风扇'))
              }
              .padding({ top: 15, bottom: 15 })

              // 廊灯
              Row() {
                Text('廊灯')
                  .fontSize(16)
                
                Blank()
                
                Toggle({ type: ToggleType.Switch, isOn: this.lights['hall'] })
                  .selectedColor('#007DFF')
                  .onChange(() => this.toggleLight('hall', '廊灯'))
              }
              .padding({ top: 15, bottom: 15 })
            }
            .width('100%')
          }
          .padding(20)
          .backgroundColor('#FFFFFF')
          .borderRadius(12)
        }
        .width('100%')
        .padding(20)
      }
      .layoutWeight(1)

      // 底部导航栏
      Row() {
        Column() {
          Image($r('app.media.home_tab_icon'))
            .width(24)
            .height(24)
          Text('首页')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .onClick(() => this.navigateTo('Home'))

        Column() {
          Image($r('app.media.light_tab_active_icon'))
            .width(24)
            .height(24)
          Text('灯光')
            .fontSize(12)
            .fontColor('#007DFF')
            .margin({ top: 4 })
        }

        Column() {
          Image($r('app.media.curtain_tab_icon'))
            .width(24)
            .height(24)
          Text('窗帘')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .onClick(() => this.navigateTo('Curtain'))

        Column() {
          Image($r('app.media.service_tab_icon'))
            .width(24)
            .height(24)
          Text('服务')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .onClick(() => this.navigateTo('Service'))
      }
      .width('100%')
      .height(60)
      .backgroundColor('#FFFFFF')
      .justify(FlexAlign.SpaceEvenly)
      .alignItems(VerticalAlign.Center)
      .shadow({
        radius: 8,
        color: 'rgba(0, 0, 0, 0.1)',
        offsetX: 0,
        offsetY: -2
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F7FA')
  }
}

export default Light;
`;
  }

  /**
   * 生成窗帘控制页面
   */
  generateCurtainPage(projectName) {
    return `/**
 * ${projectName} - 窗帘控制页面
 * 智慧客房系统 HarmonyOS 应用
 */

import router from '@ohos.router';
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct Curtain {
  @State curtainOpen: boolean = false;
  @State curtainClosing: boolean = false;
  @State curtainPaused: boolean = false;
  
  @State sheerOpen: boolean = false;
  @State sheerClosing: boolean = false;
  @State sheerPaused: boolean = false;

  @State currentTab: string = 'curtain';

  // 布帘控制
  controlCurtain(action: string) {
    if (action === 'toggle') {
      this.curtainOpen = !this.curtainOpen;
    } else if (action === 'close') {
      this.curtainClosing = true;
      this.curtainPaused = false;
    } else if (action === 'pause') {
      this.curtainPaused = true;
      this.curtainClosing = false;
    } else if (action === 'open') {
      this.curtainOpen = true;
      this.curtainClosing = false;
      this.curtainPaused = false;
    }
    
    promptAction.showToast({
      message: \`布帘\${action === 'close' ? '关闭' : action === 'open' ? '打开' : action === 'pause' ? '暂停' : '切换'}中\`,
      duration: 1500
    });
  }

  // 窗纱控制
  controlSheer(action: string) {
    if (action === 'toggle') {
      this.sheerOpen = !this.sheerOpen;
    } else if (action === 'close') {
      this.sheerClosing = true;
      this.sheerPaused = false;
    } else if (action === 'pause') {
      this.sheerPaused = true;
      this.sheerClosing = false;
    } else if (action === 'open') {
      this.sheerOpen = true;
      this.sheerClosing = false;
      this.sheerPaused = false;
    }
    
    promptAction.showToast({
      message: \`窗纱\${action === 'close' ? '关闭' : action === 'open' ? '打开' : action === 'pause' ? '暂停' : '切换'}中\`,
      duration: 1500
    });
  }

  // 全部打开
  openAll() {
    this.curtainOpen = true;
    this.sheerOpen = true;
    this.curtainClosing = false;
    this.sheerClosing = false;
    
    promptAction.showToast({
      message: '已全部打开',
      duration: 1500
    });
  }

  // 全部关闭
  closeAll() {
    this.curtainOpen = false;
    this.sheerOpen = false;
    this.curtainClosing = true;
    this.sheerClosing = true;
    
    promptAction.showToast({
      message: '已全部关闭',
      duration: 1500
    });
  }

  // 导航
  navigateTo(page: string) {
    router.pushUrl({
      url: \`pages/\${page}\`
    });
  }

  build() {
    Column() {
      // 头部
      Text('窗帘控制')
        .fontSize(28)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20, bottom: 25 })

      Scroll() {
        Column() {
          // 一键控制
          Row() {
            Button('全部打开')
              .width('45%')
              .height(50)
              .fontSize(16)
              .backgroundColor('#007DFF')
              .onClick(() => this.openAll())

            Button('全部关闭')
              .width('45%')
              .height(50)
              .fontSize(16)
              .backgroundColor('#FF6B6B')
              .onClick(() => this.closeAll())
          }
          .justify(FlexAlign.SpaceBetween)
          .margin({ bottom: 25 })

          // 布帘控制
          Column() {
            Row() {
              Text('布帘控制')
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
              
              Blank()
              
              Toggle({ type: ToggleType.Switch, isOn: this.curtainOpen })
                .selectedColor('#007DFF')
                .onChange((isOn: boolean) => {
                  this.curtainOpen = isOn;
                })
            }
            .width('100%')
            .margin({ bottom: 20 })

            // 状态显示
            Row() {
              Image(this.curtainOpen ? $r('app.media.curtain_open_icon') : $r('app.media.curtain_close_icon'))
                .width(80)
                .height(80)
            }
            .justify(FlexAlign.Center)
            .margin({ bottom: 25 })

            // 控制按钮
            Row() {
              Column() {
                Image($r('app.media.open_icon'))
                  .width(40)
                  .height(40)
                Text('打开')
                  .fontSize(12)
                  .margin({ top: 8 })
              }
              .onClick(() => this.controlCurtain('open'))

              Column() {
                Image($r('app.media.pause_icon'))
                  .width(40)
                  .height(40)
                Text('暂停')
                  .fontSize(12)
                  .margin({ top: 8 })
              }
              .onClick(() => this.controlCurtain('pause'))

              Column() {
                Image($r('app.media.close_icon'))
                  .width(40)
                  .height(40)
                Text('关闭')
                  .fontSize(12)
                  .margin({ top: 8 })
              }
              .onClick(() => this.controlCurtain('close'))
            }
            .width('100%')
            .justify(FlexAlign.SpaceEvenly)
          }
          .padding(20)
          .backgroundColor('#FFFFFF')
          .borderRadius(12)
          .margin({ bottom: 20 })

          // 窗纱控制
          Column() {
            Row() {
              Text('窗纱控制')
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
              
              Blank()
              
              Toggle({ type: ToggleType.Switch, isOn: this.sheerOpen })
                .selectedColor('#007DFF')
                .onChange((isOn: boolean) => {
                  this.sheerOpen = isOn;
                })
            }
            .width('100%')
            .margin({ bottom: 20 })

            // 状态显示
            Row() {
              Image(this.sheerOpen ? $r('app.media.sheer_open_icon') : $r('app.media.sheer_close_icon'))
                .width(80)
                .height(80)
            }
            .justify(FlexAlign.Center)
            .margin({ bottom: 25 })

            // 控制按钮
            Row() {
              Column() {
                Image($r('app.media.open_icon'))
                  .width(40)
                  .height(40)
                Text('打开')
                  .fontSize(12)
                  .margin({ top: 8 })
              }
              .onClick(() => this.controlSheer('open'))

              Column() {
                Image($r('app.media.pause_icon'))
                  .width(40)
                  .height(40)
                Text('暂停')
                  .fontSize(12)
                  .margin({ top: 8 })
              }
              .onClick(() => this.controlSheer('pause'))

              Column() {
                Image($r('app.media.close_icon'))
                  .width(40)
                  .height(40)
                Text('关闭')
                  .fontSize(12)
                  .margin({ top: 8 })
              }
              .onClick(() => this.controlSheer('close'))
            }
            .width('100%')
            .justify(FlexAlign.SpaceEvenly)
          }
          .padding(20)
          .backgroundColor('#FFFFFF')
          .borderRadius(12)
        }
        .width('100%')
        .padding(20)
      }
      .layoutWeight(1)

      // 底部导航栏
      Row() {
        Column() {
          Image($r('app.media.home_tab_icon'))
            .width(24)
            .height(24)
          Text('首页')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .onClick(() => this.navigateTo('Home'))

        Column() {
          Image($r('app.media.light_tab_icon'))
            .width(24)
            .height(24)
          Text('灯光')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .onClick(() => this.navigateTo('Light'))

        Column() {
          Image($r('app.media.curtain_tab_active_icon'))
            .width(24)
            .height(24)
          Text('窗帘')
            .fontSize(12)
            .fontColor('#007DFF')
            .margin({ top: 4 })
        }

        Column() {
          Image($r('app.media.service_tab_icon'))
            .width(24)
            .height(24)
          Text('服务')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .onClick(() => this.navigateTo('Service'))
      }
      .width('100%')
      .height(60)
      .backgroundColor('#FFFFFF')
      .justify(FlexAlign.SpaceEvenly)
      .alignItems(VerticalAlign.Center)
      .shadow({
        radius: 8,
        color: 'rgba(0, 0, 0, 0.1)',
        offsetX: 0,
        offsetY: -2
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F7FA')
  }
}

export default Curtain;
`;
  }

  /**
   * 生成服务控制页面
   */
  generateServicePage(projectName) {
    return `/**
 * ${projectName} - 服务控制页面
 * 智慧客房系统 HarmonyOS 应用
 */

import router from '@ohos.router';
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct Service {
  @State dndMode: boolean = false;
  @State cleanMode: boolean = false;
  @State currentTab: string = 'service';

  // 切换请勿打扰
  toggleDND() {
    this.dndMode = !this.dndMode;
    promptAction.showToast({
      message: this.dndMode ? '已开启请勿打扰' : '已关闭请勿打扰',
      duration: 1500
    });
  }

  // 切换清理房间
  toggleClean() {
    this.cleanMode = !this.cleanMode;
    promptAction.showToast({
      message: this.cleanMode ? '已通知清理房间' : '已取消清理房间',
      duration: 1500
    });
  }

  // SOS 紧急呼叫
  triggerSOS() {
    promptAction.showDialog({
      title: 'SOS 紧急呼叫',
      message: '确定要发送紧急呼叫吗？工作人员将立即赶到。',
      buttons: [{
        text: '取消',
        color: '#666666'
      }, {
        text: '确定',
        color: '#FF6B6B',
        onClick: () => {
          promptAction.showToast({
            message: '已发送紧急呼叫，工作人员正在赶来',
            duration: 3000
          });
        }
      }]
    });
  }

  // 退出登录
  logout() {
    promptAction.showDialog({
      title: '退出登录',
      message: '确定要退出登录吗？',
      buttons: [{
        text: '取消',
        color: '#666666'
      }, {
        text: '确定',
        color: '#007DFF',
        onClick: () => {
          promptAction.showToast({
            message: '已退出登录',
            duration: 1500
          });
          
          router.replaceUrl({
            url: 'pages/Login'
          });
        }
      }]
    });
  }

  // 导航
  navigateTo(page: string) {
    router.pushUrl({
      url: \`pages/\${page}\`
    });
  }

  build() {
    Column() {
      // 头部
      Text('服务控制')
        .fontSize(28)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20, bottom: 25 })

      Scroll() {
        Column() {
          // 客房模式
          Column() {
            Text('客房模式')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .margin({ bottom: 20 })
              .alignSelf(ItemAlign.Start)

            // 请勿打扰
            Row() {
              Row() {
                Image($r('app.media.dnd_icon'))
                  .width(32)
                  .height(32)
                Text('请勿打扰')
                  .fontSize(16)
                  .margin({ left: 12 })
              }
              
              Toggle({ type: ToggleType.Switch, isOn: this.dndMode })
                .selectedColor('#007DFF')
                .onChange((isOn: boolean) => {
                  this.dndMode = isOn;
                })
            }
            .width('100%')
            .padding({ top: 15, bottom: 15 })

            Divider()
              .color('#EEEEEE')

            // 清理房间
            Row() {
              Row() {
                Image($r('app.media.clean_icon'))
                  .width(32)
                  .height(32)
                Text('清理房间')
                  .fontSize(16)
                  .margin({ left: 12 })
              }
              
              Toggle({ type: ToggleType.Switch, isOn: this.cleanMode })
                .selectedColor('#007DFF')
                .onChange((isOn: boolean) => {
                  this.cleanMode = isOn;
                })
            }
            .width('100%')
            .padding({ top: 15, bottom: 15 })

            Divider()
              .color('#EEEEEE')

            // SOS 按钮
            Row() {
              Row() {
                Image($r('app.media.sos_icon'))
                  .width(32)
                  .height(32)
                Text('SOS')
                  .fontSize(16)
                  .margin({ left: 12 })
                  .fontColor('#FF6B6B')
              }
              
              Button('SOS')
                .width(80)
                .height(40)
                .fontSize(14)
                .backgroundColor('#FF6B6B')
                .onClick(() => {
                  this.triggerSOS();
                })
            }
            .width('100%')
            .padding({ top: 15, bottom: 15 })
          }
          .padding(20)
          .backgroundColor('#FFFFFF')
          .borderRadius(12)
          .margin({ bottom: 20 })

          // 退出登录按钮
          Button() {
            Row() {
              Image($r('app.media.logout_icon'))
                .width(24)
                .height(24)
              Text('退出登录')
                .fontSize(16)
                .margin({ left: 10 })
            }
          }
          .width('90%')
          .height(50)
          .fontSize(16)
          .fontColor('#FFFFFF')
          .backgroundColor('#FF6B6B')
          .onClick(() => {
            this.logout();
          })
          .margin({ top: 20, bottom: 20 })
          .shadow({
            radius: 8,
            color: 'rgba(255, 107, 107, 0.4)',
            offsetX: 0,
            offsetY: 4
          })
        }
        .width('100%')
        .padding(20)
      }
      .layoutWeight(1)

      // 底部导航栏
      Row() {
        Column() {
          Image($r('app.media.home_tab_icon'))
            .width(24)
            .height(24)
          Text('首页')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .onClick(() => this.navigateTo('Home'))

        Column() {
          Image($r('app.media.light_tab_icon'))
            .width(24)
            .height(24)
          Text('灯光')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .onClick(() => this.navigateTo('Light'))

        Column() {
          Image($r('app.media.curtain_tab_icon'))
            .width(24)
            .height(24)
          Text('窗帘')
            .fontSize(12)
            .margin({ top: 4 })
        }
        .onClick(() => this.navigateTo('Curtain'))

        Column() {
          Image($r('app.media.service_tab_active_icon'))
            .width(24)
            .height(24)
          Text('服务')
            .fontSize(12)
            .fontColor('#007DFF')
            .margin({ top: 4 })
        }
      }
      .width('100%')
      .height(60)
      .backgroundColor('#FFFFFF')
      .justify(FlexAlign.SpaceEvenly)
      .alignItems(VerticalAlign.Center)
      .shadow({
        radius: 8,
        color: 'rgba(0, 0, 0, 0.1)',
        offsetX: 0,
        offsetY: -2
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F7FA')
  }
}

export default Service;
`;
  }

  /**
   * 生成通用 HarmonyOS 应用
   */
  generateGenericHarmonyOSApp(understanding) {
    const { type, coreFeatures } = understanding;
    
    return `/**
 * HarmonyOS 应用
 * 类型：${type}
 * 功能：${coreFeatures.join(', ')}
 */

@Component
struct MainPage {
  @State message: string = 'Hello HarmonyOS';

  aboutToAppear() {
    console.info('MainPage aboutToAppear');
  }

  aboutToDisappear() {
    console.info('MainPage aboutToDisappear');
  }

  build() {
    Column() {
      Text(this.message)
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 50 })

      Button('点击我')
        .width('200')
        .height(50)
        .margin({ top: 30 })
        .onClick(() => {
          this.message = '按钮被点击了！';
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}

export default MainPage;
`;
  }

  /**
   * 生成 TypeScript 代码
   */
  async generateTypeScript(understanding) {
    const { type, coreFeatures } = understanding;
    
    return `/**
 * TypeScript 程序
 * 类型：${type}
 * 功能：${coreFeatures.join(', ')}
 */

class Application {
  private name: string;
  private initialized: boolean = false;

  constructor(name: string) {
    this.name = name;
    console.log(\`应用程序 \${name} 创建\`);
  }

  initialize(): void {
    console.log('应用程序初始化...');
    this.initialized = true;
  }

  run(): void {
    if (!this.initialized) {
      console.error('应用程序未初始化');
      return;
    }
    console.log('应用程序运行中...');
  }

  stop(): void {
    console.log('应用程序停止');
    this.initialized = false;
  }
}

// 主函数
function main() {
  const app = new Application('MyApp');
  app.initialize();
  app.run();
  app.stop();
}

main();
`;
  }

  /**
   * 生成文件名
   */
  generateFilename(understanding, language = 'typescript') {
    const extMap = {
      python: '.py',
      javascript: '.js',
      java: '.java',
      cpp: '.cpp',
      typescript: '.ts',
      ets: '.ets',
      harmonyos: '.ets',
      arkts: '.ets'
    };
    
    const ext = extMap[language] || '.txt';
    
    // 如果是 HarmonyOS 项目，使用更合适的文件名
    if (language === 'ets' || language === 'harmonyos' || language === 'arkts') {
      const name = understanding.type === 'harmonyos' ? 'Login' : (understanding.type || 'App');
      return `${name}.ets`;
    }
    
    const name = understanding.type || 'app';
    return `${name}_program${ext}`;
  }

  /**
   * 转换为类名
   */
  toClassName(str) {
    return str.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
}

// 导出
export default AutonomousProgrammer;
