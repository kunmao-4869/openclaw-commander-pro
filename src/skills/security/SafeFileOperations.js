/**
 * 安全文件操作技能（服务端版本）
 * 注意：这些技能需要在 Node.js 环境中运行
 */

import { SecureSkill } from '../core/SecureSkill.js';

// 检测是否在 Node.js 环境
const isNode = typeof process !== 'undefined' && process.versions?.node;

// 动态导入 fs 模块（只在 Node.js 环境）
let fs, path;
if (isNode) {
  fs = await import('fs/promises');
  path = await import('path');
}

export class SafeFileReadSkill extends SecureSkill {
  constructor() {
    super({
      name: 'safe_read_file',
      description: '安全读取文件内容（只读，不修改）',
      category: '文件操作',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  validate(params) {
    if (!params.path) {
      return { valid: false, error: '缺少文件路径参数' };
    }

    if (!this.isPathSafe(params.path)) {
      return { valid: false, error: '不允许访问该路径' };
    }

    return { valid: true };
  }

  async execute(params) {
    if (!isNode) {
      throw new Error('文件操作需要在 Node.js 环境中运行');
    }

    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const filePath = path.default.resolve(params.path);
      
      // 检查文件是否存在
      await fs.default.access(filePath);
      
      // 读取文件
      const content = await fs.default.readFile(filePath, 'utf-8');
      
      // 限制文件大小（最多 1MB）
      if (content.length > 1024 * 1024) {
        throw new Error('文件过大，只支持读取 1MB 以内的文件');
      }

      this.log('read', { path: filePath }, { size: content.length });
      
      return {
        success: true,
        path: filePath,
        content,
        size: content.length,
        lines: content.split('\n').length,
      };
    } catch (error) {
      this.log('read_error', { path: params.path }, error.message);
      throw error;
    }
  }
}

export class SafeFileListSkill extends SecureSkill {
  constructor() {
    super({
      name: 'safe_list_directory',
      description: '安全列出目录内容（只读，不修改）',
      category: '文件操作',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  validate(params) {
    if (!params.path) {
      return { valid: false, error: '缺少目录路径参数' };
    }

    if (!this.isPathSafe(params.path)) {
      return { valid: false, error: '不允许访问该路径' };
    }

    return { valid: true };
  }

  async execute(params) {
    if (!isNode) {
      throw new Error('文件操作需要在 Node.js 环境中运行');
    }

    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const dirPath = path.default.resolve(params.path);
      
      // 检查目录是否存在
      await fs.default.access(dirPath);
      
      // 读取目录
      const entries = await fs.default.readdir(dirPath, { withFileTypes: true });
      
      const files = entries
        .filter(entry => entry.isFile())
        .map(entry => ({
          name: entry.name,
          type: 'file',
        }));
      
      const directories = entries
        .filter(entry => entry.isDirectory())
        .map(entry => ({
          name: entry.name,
          type: 'directory',
        }));

      this.log('list', { path: dirPath }, { 
        files: files.length, 
        directories: directories.length 
      });
      
      return {
        success: true,
        path: dirPath,
        files: [...files, ...directories],
        total: files.length + directories.length,
      };
    } catch (error) {
      this.log('list_error', { path: params.path }, error.message);
      throw error;
    }
  }
}

export class SafeFileSearchSkill extends SecureSkill {
  constructor() {
    super({
      name: 'safe_search_files',
      description: '安全搜索文件（只读，不修改）',
      category: '文件操作',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  validate(params) {
    if (!params.pattern) {
      return { valid: false, error: '缺少搜索模式参数' };
    }

    if (params.path && !this.isPathSafe(params.path)) {
      return { valid: false, error: '不允许访问该路径' };
    }

    return { valid: true };
  }

  async execute(params) {
    if (!isNode) {
      throw new Error('文件操作需要在 Node.js 环境中运行');
    }

    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const searchPath = params.path ? path.default.resolve(params.path) : process.cwd();
      const pattern = params.pattern;
      
      // 递归搜索目录
      const results = await this.searchRecursive(searchPath, pattern, 0);
      
      this.log('search', { path: searchPath, pattern }, { found: results.length });
      
      return {
        success: true,
        pattern,
        path: searchPath,
        results,
        total: results.length,
      };
    } catch (error) {
      this.log('search_error', params, error.message);
      throw error;
    }
  }

  async searchRecursive(dir, pattern, depth) {
    // 限制递归深度（最多 5 层）
    if (depth > 5) return [];
    
    try {
      const entries = await fs.default.readdir(dir, { withFileTypes: true });
      const results = [];
      
      for (const entry of entries) {
        // 跳过隐藏文件和 node_modules
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
          continue;
        }
        
        const fullPath = path.default.join(dir, entry.name);
        
        // 检查路径安全性
        if (!this.isPathSafe(fullPath)) {
          continue;
        }
        
        if (entry.isFile() && this.matchesPattern(entry.name, pattern)) {
          results.push({
            name: entry.name,
            path: fullPath,
            type: 'file',
          });
        } else if (entry.isDirectory()) {
          const subResults = await this.searchRecursive(fullPath, pattern, depth + 1);
          results.push(...subResults);
        }
      }
      
      return results;
    } catch {
      return [];
    }
  }

  matchesPattern(filename, pattern) {
    // 简单的通配符匹配
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$',
      'i'
    );
    return regex.test(filename);
  }
}
