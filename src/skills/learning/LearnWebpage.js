/**
 * 网页内容提取与学习技能
 * 读取指定 URL 的网页内容，提取关键信息并生成学习总结
 */

import { SecureSkill } from '../core/SecureSkill.js';

// 检测是否在 Node.js 环境
const isNode = typeof process !== 'undefined' && process.versions?.node;

export class LearnWebpageSkill extends SecureSkill {
  constructor() {
    super({
      name: 'learn_webpage',
      description: '学习网页内容（提取、总结、生成文档）',
      category: '学习工具',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  validate(params) {
    if (!params.url) {
      return { valid: false, error: '缺少网页 URL' };
    }

    try {
      new URL(params.url);
    } catch (error) {
      return { valid: false, error: 'URL 格式不正确' };
    }

    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const url = params.url;
      const options = params.options || {};
      
      console.log(`📚 开始学习网页：${url}`);

      // 获取原始 HTML（用于提取代码块）
      let rawHtml = '';
      try {
        const response = await fetch('http://localhost:3003/api/browser/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, timeout: options.timeout || 30000, returnHtml: true })
        });
        console.log('📡 后端响应状态:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('📦 后端返回数据:', {
            hasHtml: !!data.html,
            htmlLength: data.html?.length || 0,
            hasText: !!data.text,
            textLength: data.text?.length || 0
          });
          if (data.html) rawHtml = data.html;
        }
      } catch (e) {
        console.warn('无法获取原始 HTML，使用备用方案', e.message);
      }

      // 提取网页内容
      const content = await this.extractWebpageContent(url, options);
      
      // 提取代码块
      console.log('🔍 开始提取代码块，HTML 长度:', rawHtml.length);
      const codeBlocks = rawHtml ? this.extractCodeBlocks(rawHtml) : [];
      console.log('✅ 代码块提取完成，数量:', codeBlocks.length);
      
      // 分析和总结内容
      const summary = this.analyzeAndSummarize(content, options);
      
      // 生成学习文档（包含代码）
      const learningDoc = this.generateLearningDoc(url, content, summary, codeBlocks, options);

      this.log('learn_webpage', { url }, {
        contentLength: content.length,
        codeBlocksCount: codeBlocks.length,
        summaryLength: summary.length
      });

      return {
        success: true,
        url,
        content,
        summary,
        codeBlocks,
        learningDoc,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.log('learn_webpage_error', params, error.message);
      throw error;
    }
  }

  /**
   * 提取网页内容
   */
  async extractWebpageContent(url, options = {}) {
    try {
      // 优先使用后端服务（避免 CORS 问题）
      const response = await fetch('http://localhost:3003/api/browser/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          timeout: options.timeout || 30000
        })
      });

      if (!response.ok) {
        throw new Error(`后端服务返回错误：${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.text || data.content || '';
      } else {
        throw new Error(data.error || '提取失败');
      }
    } catch (error) {
      console.warn(`后端服务访问失败，尝试直接访问：${error.message}`);
      
      // 备用方案：直接访问（可能会遇到 CORS 问题）
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (!response.ok) {
          throw new Error(`网页返回错误：${response.status}`);
        }
        
        const html = await response.text();
        return this.parseHTML(html, url);
      } catch (directError) {
        // 最终备用方案：返回错误信息
        return `无法访问该网页：${error.message}\n\n建议：\n1. 检查网络连接\n2. 确认 URL 是否正确\n3. 某些网站可能阻止了自动化访问\n4. 确保后端服务已启动（http://localhost:3003）`;
      }
    }
  }

  /**
   * 解析 HTML 内容（保留代码块）
   */
  parseHTML(html, url) {
    // 1. 首先提取并保存所有代码块
    const codeBlocks = [];
    let codeBlockIndex = 0;
    
    // 提取 <pre><code> 代码块
    html = html.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (match, code) => {
      // 清理代码内容
      let cleanCode = code
        .replace(/<[^>]+>/g, '')  // 去除 HTML 标签
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
      
      // 保存代码块
      codeBlocks.push(cleanCode);
      
      // 用占位符替换，稍后恢复
      return `\n\n[CODE_BLOCK_${codeBlockIndex++}]\n${cleanCode}\n[/CODE_BLOCK_${codeBlockIndex-1}]\n\n`;
    });
    
    // 2. 去除 script 和 style
    html = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // 3. 将其他 HTML 标签转换为空格
    html = html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // 4. 限制长度
    if (html.length > 100000) {
      html = html.substring(0, 100000) + '...（内容过长，已截断）';
    }
    
    return html;
  }
  
  /**
   * 提取代码块（返回结构化数据，包含功能描述）
   */
  extractCodeBlocks(html) {
    const codeBlocks = [];
    let index = 0;
    
    // 方法 1: 提取 <pre><code> 代码块（标准格式）
    const preRegex = /<pre[^>]*>([\s\S]*?)<\/pre>/gi;
    let match;
    
    while ((match = preRegex.exec(html)) !== null) {
      const code = match[1]
        .replace(/<[^>]+>/g, '')  // 去除 HTML 标签
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .trim();
      
      // 跳过空代码块
      if (code.length < 10) continue;
      
      // 查找代码块前面的 H2 和 P 标签（功能描述）
      const preContent = html.substring(0, match.index);
      const description = this.extractCodeDescription(preContent);
      
      // 尝试检测代码语言
      const fullMatch = match[0];
      let language = 'unknown';
      
      const langPatterns = [
        /language-([^"'\s]+)/i,
        /class="[^"]*\b(cpp|c\+\+|csharp|python|javascript|js|html|css)\b/i,
        /data-language="([^"]+)"/i
      ];
      
      for (const pattern of langPatterns) {
        const langMatch = fullMatch.match(pattern);
        if (langMatch) {
          language = langMatch[1].toLowerCase();
          // 标准化语言名称
          if (language === 'c++' || language === 'cpp') language = 'cpp';
          if (language === 'c#') language = 'csharp';
          if (language === 'js') language = 'javascript';
          break;
        }
      }
      
      codeBlocks.push({
        index,
        language,
        code,
        length: code.split('\n').length,
        description  // 添加功能描述
      });
      index++;
    }
    
    // 方法 2: 提取 Epic Games 特殊格式（highlight.js + 表格）
    console.log('🔍 提取标准代码块后，当前数量:', codeBlocks.length);
    if (codeBlocks.length === 0 || index < 5) {
      console.log('🔍 尝试提取 Epic Games 特殊格式的代码块...');
      
      // 查找 <code class="language-xxx"> 标签
      const codeRegex = /<code[^>]*class="[^"]*language-([^"]+)[^"]*"[^>]*>([\s\S]*?)<\/code>/gi;
      let codeMatch;
      
      while ((codeMatch = codeRegex.exec(html)) !== null) {
        let code = codeMatch[2]
          .replace(/<[^>]+>/g, '')  // 去除 HTML 标签
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ')
          .replace(/\n\s+/g, '\n')  // 移除行首空格
          .trim();
        
        // 跳过空代码块
        if (code.length < 10) continue;
        
        // 查找代码块前面的描述
        const preContent = html.substring(0, codeMatch.index);
        const description = this.extractCodeDescription(preContent);
        
        const language = codeMatch[1].toLowerCase();
        
        codeBlocks.push({
          index: codeBlocks.length,
          language: language === 'c++' || language === 'cpp' ? 'cpp' : language,
          code,
          length: code.split('\n').length,
          description  // 添加功能描述
        });
      }
    }
    
    // 方法 3: 如果仍然没有找到，尝试提取有代码特征的文本块
    if (codeBlocks.length === 0) {
      console.log('🔍 未找到代码标签，尝试提取代码样式的文本块...');
      
      // 查找包含代码特征的段落（如大括号、分号、关键字等）
      const codeLikePatterns = [
        /class\s+\w+.*\{[\s\S]{50,2000}\}/gi,  // 类定义
        /(?:public|private|protected):[\s\S]{50,1000}/gi,  // 访问修饰符
        /(?:virtual|override|const)\s+\w+/gi,  // C++ 关键字
        /(?:void|int|float|bool|auto)\s+\w+\s*\(/gi,  // 函数声明
        /GENERATED_BODY\(\)/gi,  // Unreal 宏
        /UCLASS\(\)/gi  // Unreal 宏
      ];
      
      for (const pattern of codeLikePatterns) {
        const matches = html.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const code = match
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/&nbsp;/g, ' ')
              .replace(/<[^>]+>/g, '')
              .trim();
            
            if (code.length > 20) {
              codeBlocks.push({
                index: codeBlocks.length,
                language: 'cpp',  // 默认假设为 C++
                code,
                length: code.split('\n').length,
                description: ''  // 没有描述
              });
            }
          });
        }
      }
    }
    
    console.log(`📊 提取到 ${codeBlocks.length} 个代码块`);
    return codeBlocks;
  }
  
  /**
   * 提取代码块的功能描述
   * 查找最后一个 H2 标签及其后的第一个 P 标签，以及代码块上方的 P 标签
   */
  extractCodeDescription(preContent) {
    let description = '';
    
    // 1. 查找最后一个 H2 标签
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    const h2Matches = [...preContent.matchAll(h2Regex)];
    
    if (h2Matches.length > 0) {
      const lastH2 = h2Matches[h2Matches.length - 1];
      const h2Text = lastH2[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
      
      description = h2Text;
      
      // 2. 查找 H2 后的第一个 P 标签
      const h2Index = lastH2.index;
      const afterH2 = preContent.substring(h2Index + lastH2[0].length);
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      const pMatch = pRegex.exec(afterH2);
      
      if (pMatch) {
        const pText = pMatch[1]
          .replace(/<[^>]+>/g, '')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ')
          .trim();
        
        // 只取前 200 个字符，避免太长
        if (pText.length > 0 && pText.length < 300) {
          description += ' - ' + pText;
        }
      }
    } else {
      // 如果没有 H2，查找最近的 P 标签（代码块上方）
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      const pMatches = [...preContent.matchAll(pRegex)];
      
      if (pMatches.length > 0) {
        // 取最后一个 P 标签
        const lastP = pMatches[pMatches.length - 1];
        const pText = lastP[1]
          .replace(/<[^>]+>/g, '')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ')
          .trim();
        
        if (pText.length > 0 && pText.length < 300) {
          description = pText;
        }
      }
    }
    
    return description;
  }

  /**
   * 分析和总结内容
   */
  analyzeAndSummarize(content, options = {}) {
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // 提取关键信息
    const keyPoints = [];
    const sections = [];
    let currentSection = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // 检测章节标题（假设标题较短且没有句号）
      if (trimmed.length < 100 && !trimmed.endsWith('.') && !trimmed.endsWith('。')) {
        if (currentSection) {
          sections.push({
            title: currentSection,
            preview: keyPoints.slice(-3).join(' ')
          });
        }
        currentSection = trimmed;
      }
      
      // 提取关键点（包含重要关键词的句子）
      const importantKeywords = [
        '重要', '关键', '注意', '必须', '应该', '可以', '能够',
        'function', 'class', 'interface', 'component', 'API',
        '教程', '指南', '示例', '代码', '使用', '方法'
      ];
      
      if (importantKeywords.some(keyword => 
        trimmed.toLowerCase().includes(keyword.toLowerCase())
      ) && trimmed.length > 20 && trimmed.length < 500) {
        keyPoints.push(trimmed);
      }
    }

    // 生成总结
    const summary = {
      totalLength: content.length,
      totalLines: lines.length,
      keyPointsCount: keyPoints.length,
      sections: sections.slice(0, 20), // 最多 20 个章节
      keyPoints: keyPoints.slice(0, 30), // 最多 30 个关键点
      overview: content.substring(0, 500) + '...'
    };

    return summary;
  }

  /**
   * 生成学习文档（精简版：只保留代码和功能说明）
   */
  generateLearningDoc(url, content, summary, codeBlocks = [], options = {}) {
    const docTitle = options.title || `代码示例：${new URL(url).pathname.split('/').pop()}`;
    
    let doc = `# ${docTitle}\n\n`;
    doc += `> 来源：${url}\n`;
    doc += `> 提取时间：${new Date().toLocaleString('zh-CN')}\n\n`;
    doc += `---\n\n`;

    // 只保留代码块和简要说明
    if (codeBlocks.length > 0) {
      codeBlocks.forEach((block, index) => {
        // 优先使用提取的描述，如果没有则推断功能
        let codeTitle = block.description || this.inferCodeFunction(block, content);
        
        // 如果描述太长，截断
        if (codeTitle.length > 150) {
          codeTitle = codeTitle.substring(0, 150) + '...';
        }
        
        doc += `## ${codeTitle || '代码示例'} ${index + 1}\n\n`;
        if (block.language !== 'unknown') {
          doc += `**语言**: ${block.language}\n\n`;
        }
        doc += `\`\`\`${block.language !== 'unknown' ? block.language : ''}\n`;
        doc += block.code;
        doc += `\n\`\`\`\n\n`;
      });
    } else {
      doc += `> 未找到代码块\n\n`;
    }

    return doc;
  }
  
  /**
   * 推断代码功能（基于代码内容和上下文）
   */
  inferCodeFunction(codeBlock, fullContent) {
    const code = codeBlock.code;
    const codeLower = code.toLowerCase();
    
    // 1. 检查是否是版权声明
    if (code.includes('Copyright Epic Games')) {
      return '版权声明格式';
    }
    
    // 2. 检查类定义
    if (codeLower.includes('class') && (codeLower.includes('public') || code.includes(':'))) {
      if (code.includes('UCLASS()')) {
        if (code.includes('AActor')) return '定义 Actor 类（虚幻对象）';
        if (code.includes('UObject')) return '定义 UObject 类';
        if (code.includes('UActorComponent')) return '定义 Actor 组件类';
        return '定义虚幻类';
      }
      if (code.includes('AActor')) return '定义 Actor 类';
      if (code.includes('UObject')) return '定义 UObject 类';
      if (code.includes('UActorComponent')) return '定义组件类';
      if (code.includes('SWidget')) return '定义 Slate 控件类';
      if (code.includes('struct')) return '定义结构体';
      return '定义 C++ 类';
    }
    
    // 3. 检查函数实现
    if (code.includes('::') && (code.includes('void') || code.includes('int') || code.includes('bool'))) {
      const match = code.match(/(\w+)::(\w+)\s*\(/);
      if (match) return `实现成员函数：${match[2]}()`;
    }
    
    // 4. 检查函数声明
    if (codeLower.includes('void') || codeLower.includes('bool') || codeLower.includes('int')) {
      const funcMatch = code.match(/(?:virtual\s+)?(?:void|int|bool|float|auto|F\w+|U\w+|A\w+)\s+(\w+)\s*\(/);
      if (funcMatch && funcMatch[1]) {
        const funcName = funcMatch[1];
        if (funcName.startsWith('Get')) return `获取函数：${funcName}()`;
        if (funcName.startsWith('Set')) return `设置函数：${funcName}()`;
        if (funcName.startsWith('Is')) return `判断函数：${funcName}()`;
        if (funcName.startsWith('Add')) return `添加函数：${funcName}()`;
        if (funcName === 'BeginPlay' || funcName === 'Tick') return `生命周期函数：${funcName}()`;
        return `函数声明：${funcName}()`;
      }
    }
    
    // 5. 检查宏定义
    if (code.includes('#define')) {
      return '宏定义';
    }
    
    // 6. 检查枚举
    if (codeLower.includes('enum')) {
      if (code.includes('UENUM()')) return '定义虚幻枚举';
      return '定义枚举类型';
    }
    
    // 7. 检查模板
    if (code.includes('template')) {
      return '模板类定义';
    }
    
    // 8. 检查 typedef
    if (codeLower.includes('typedef')) {
      return '类型定义';
    }
    
    // 9. 检查循环
    if (code.includes('for') || code.includes('while')) {
      if (code.includes('CreateIterator()')) return '迭代器循环（旧样式）';
      if (code.includes(':') && code.includes('TPair')) return '范围 for 循环';
      return '循环语句';
    }
    
    // 10. 检查条件判断
    if (code.includes('if') && code.includes('else')) {
      return '条件判断语句';
    }
    if (code.includes('switch') && code.includes('case')) {
      return 'Switch 语句';
    }
    
    // 11. 检查注释示例
    if (code.includes('错误示范') || code.includes('正确示范')) {
      return '编码规范示例';
    }
    
    // 12. 检查变量命名示例
    if (code.includes('b') && code.includes('FName') && code.includes('FString')) {
      return '变量命名规范示例';
    }
    
    // 13. 检查常量定义
    if (code.includes('const') && (code.includes('=') || code.includes('TEXT('))) {
      return '常量定义';
    }
    
    // 14. 检查第三方代码引用
    if (code.includes('@third party code')) {
      return '第三方代码引用';
    }
    
    // 15. 检查文件路径示例
    if (code.includes('/') && code.includes('PlatformMemory.cpp')) {
      return '文件路径示例';
    }
    
    // 默认
    return '代码示例';
  }
}

/**
 * 批量学习多个网页技能
 */
export class BatchLearnWebpagesSkill extends SecureSkill {
  constructor() {
    super({
      name: 'batch_learn_webpages',
      description: '批量学习多个网页（从 URL 列表）',
      category: '学习工具',
      isSafe: true,
      requiresConfirmation: true,
      readOnly: true,
    });
  }

  validate(params) {
    if (!params.urls || !Array.isArray(params.urls)) {
      return { valid: false, error: '需要提供 URL 列表' };
    }

    if (params.urls.length === 0) {
      return { valid: false, error: 'URL 列表不能为空' };
    }

    if (params.urls.length > 20) {
      return { valid: false, error: '最多支持同时学习 20 个网页' };
    }

    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const { urls, options = {} } = params;
    const results = [];
    let successCount = 0;
    let failCount = 0;

    const learnSkill = new LearnWebpageSkill();

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`📚 学习 ${i + 1}/${urls.length}: ${url}`);
      
      try {
        const result = await learnSkill.execute({ url, options });
        
        results.push({
          url,
          success: true,
          result
        });
        successCount++;
      } catch (error) {
        console.error(`❌ 学习失败：${url}`, error.message);
        results.push({
          url,
          success: false,
          error: error.message
        });
        failCount++;
      }
    }

    return {
      success: failCount === 0,
      total: urls.length,
      successCount,
      failCount,
      results
    };
  }
}

// 导出单例
export const learnWebpageSkill = new LearnWebpageSkill();
export const batchLearnWebpagesSkill = new BatchLearnWebpagesSkill();
