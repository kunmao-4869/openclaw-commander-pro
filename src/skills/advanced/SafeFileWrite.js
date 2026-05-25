/**
 * 安全文件写入技能
 * 在受控环境下创建和修改文件
 * 注意：此技能只能在 Node.js 环境（服务端）运行
 */

import { SecureSkill } from '../core/SecureSkill.js';

// 检测是否在 Node.js 环境
const isNode = typeof process !== 'undefined' && process.versions?.node;

// 动态导入 fs 和 path 模块（只在 Node.js 环境）
let fs, path;
if (isNode) {
  fs = await import('fs/promises');
  path = await import('path');
}

// 允许写入的目录白名单
const ALLOWED_DIRECTORIES = isNode ? [
  path.resolve('./projects'),
  path.resolve('./temp'),
  path.resolve('./output'),
] : [];

// 检查路径是否安全
function isPathSafe(filePath) {
  if (!isNode) return false;
  
  // 如果是相对路径，先转换为绝对路径（相对于当前工作目录）
  const resolvedPath = path.isAbsolute(filePath) 
    ? path.resolve(filePath)
    : path.resolve(process.cwd(), filePath);
  
  // 检查是否在允许的目录内
  for (const allowedDir of ALLOWED_DIRECTORIES) {
    if (resolvedPath.startsWith(allowedDir)) {
      return true;
    }
  }
  
  return false;
}

export class SafeFileWriteSkill extends SecureSkill {
  constructor() {
    super({
      name: 'safe_write_file',
      description: '安全写入文件（需要确认，限制目录）',
      category: '文件操作',
      isSafe: true,
      requiresConfirmation: true, // 必须用户确认
      readOnly: false,
      // 参数说明和提示
      paramHints: {
        path: {
          label: '文件路径',
          placeholder: 'output.md 或 F:\\openclaw\\commander-pro\\projects\\output.md',
          description: '支持相对路径（自动保存到 projects 目录）或绝对路径，推荐使用 .md 格式',
          examples: [
            'UE5teaching.md',
            'docs/learning-notes.md',
            'F:\\openclaw\\commander-pro\\projects\\output.md'
          ]
        },
        content: {
          label: '文件内容',
          placeholder: '要写入的内容，支持使用 ${变量名} 引用前一个技能的输出',
          description: '可以是纯文本、Markdown、代码等，支持模板变量',
          templateVariables: [
            { name: 'learn_webpage.learningDoc', description: '学习网页技能生成的完整学习文档' },
            { name: 'learn_webpage.content', description: '学习网页技能提取的原始网页内容' },
            { name: 'learn_webpage.summary', description: '学习网页技能的内容摘要' },
            { name: 'web_search.results', description: '网络搜索技能的搜索结果数组' },
            { name: 'searchResults', description: '搜索结果的快捷访问（等同于 web_search.results）' },
            { name: 'lastResult', description: '前一个技能的完整返回对象' }
          ],
          examples: [
            '${learn_webpage.learningDoc}',
            '${searchResults}',
            '# 我的笔记\n\n这是我自己写的内容',
            'console.log("Hello World");'
          ]
        },
        encoding: {
          label: '文件编码',
          placeholder: 'utf-8',
          description: '文件编码格式，默认 utf-8',
          examples: ['utf-8', 'ascii', 'base64']
        }
      }
    });
  }

  validate(params) {
    // 支持 path 或 filePath 参数名
    let filePath = params.path || params.filePath;
    
    if (!filePath) {
      return { valid: false, error: '缺少文件路径' };
    }

    if (!params.content) {
      return { valid: false, error: '缺少文件内容' };
    }

    // 如果是相对路径，先转换为 projects 目录下的路径再验证
    if (!path.isAbsolute(filePath)) {
      filePath = path.join(ALLOWED_DIRECTORIES[0], filePath);
    }

    // 检查路径安全性
    if (!isPathSafe(filePath)) {
      return { 
        valid: false, 
        error: `不允许写入该路径，只允许写入：${ALLOWED_DIRECTORIES.join(', ')}` 
      };
    }

    // 检查文件类型（防止写入可执行文件）
    const ext = path.extname(filePath).toLowerCase();
    const dangerousExts = ['.exe', '.bat', '.cmd', '.sh', '.ps1'];
    if (dangerousExts.includes(ext)) {
      return { valid: false, error: '不允许写入可执行文件' };
    }

    return { valid: true };
  }

  async execute(params) {
    if (!isNode) {
      throw new Error('safe_write_file 技能只能在 Node.js 环境（服务端）运行');
    }

    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      // 支持 path 或 filePath 参数名
      let filePath = params.path || params.filePath;
      const content = params.content;
      const encoding = params.encoding || 'utf-8';

      // 如果是相对路径，自动添加到 projects 目录
      if (!path.isAbsolute(filePath)) {
        filePath = path.join(ALLOWED_DIRECTORIES[0], filePath);
      }
      
      // 使用 process.cwd() 确保路径解析正确
      filePath = path.resolve(process.cwd(), filePath);

      // 确保目录存在
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      // 写入文件
      await fs.writeFile(filePath, content, { encoding });

      // 获取文件信息
      const stats = await fs.stat(filePath);

      this.log('write_file', { path: filePath }, {
        size: stats.size,
        encoding
      });

      return {
        success: true,
        path: filePath,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    } catch (error) {
      this.log('write_file_error', params, error.message);
      throw error;
    }
  }
}

/**
 * 批量创建项目文件
 */
export class CreateProjectFilesSkill extends SecureSkill {
  constructor() {
    super({
      name: 'create_project_files',
      description: '批量创建项目文件（从项目配置）',
      category: '文件操作',
      isSafe: true,
      requiresConfirmation: true,
      readOnly: false,
    });
  }

  validate(params) {
    if (!params.projectConfig) {
      return { valid: false, error: '需要项目配置' };
    }

    if (!params.projectConfig.files || !Array.isArray(params.projectConfig.files)) {
      return { valid: false, error: '项目配置必须包含 files 数组' };
    }

    return { valid: true };
  }

  async execute(params) {
    if (!isNode) {
      throw new Error('create_project_files 技能只能在 Node.js 环境（服务端）运行');
    }

    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const { projectConfig, basePath = './projects' } = params;
    const results = [];
    let successCount = 0;
    let failCount = 0;

    const writeSkill = new SafeFileWriteSkill();

    for (const file of projectConfig.files) {
      try {
        const filePath = path.join(basePath, file.path);
        
        console.log(`  创建文件：${file.path}`);
        
        const result = await writeSkill.execute({
          path: filePath,
          content: file.content,
          encoding: file.encoding || 'utf-8'
        });

        results.push({
          path: file.path,
          success: true,
          result
        });
        successCount++;
      } catch (error) {
        console.error(`  创建文件失败：${file.path}`, error.message);
        results.push({
          path: file.path,
          success: false,
          error: error.message
        });
        failCount++;
      }
    }

    return {
      success: failCount === 0,
      total: projectConfig.files.length,
      successCount,
      failCount,
      results,
      projectConfig
    };
  }
}

// 导出单例
export const safeFileWriteSkill = new SafeFileWriteSkill();
export const createProjectFilesSkill = new CreateProjectFilesSkill();
