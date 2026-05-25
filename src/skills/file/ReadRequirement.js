/**
 * 需求文档读取技能
 * 专门用于读取项目需求文档
 */

import { SecureSkill } from '../core/SecureSkill.js';

// 检测是否在 Node.js 环境
const isNode = typeof process !== 'undefined' && process.versions?.node;

let fs;
if (isNode) {
  fs = await import('fs/promises');
}

export class ReadRequirementSkill extends SecureSkill {
  constructor() {
    super({
      name: 'read_requirement',
      description: '读取项目需求文档（支持 Markdown 文件）',
      category: '文件操作',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  validate(params) {
    // 支持多种参数命名格式（path, filePath, file_path）
    if (!params.path && !params.filePath && !params.file_path) {
      return { valid: false, error: '缺少文件路径参数' };
    }

    let filePath = params.path || params.filePath || params.file_path;
    
    // 移除路径中的多余空格
    filePath = filePath.trim();
    
    // 检查是否是 Markdown 文件
    if (!filePath.endsWith('.md')) {
      return { valid: false, error: '只支持读取 .md 格式的需求文档' };
    }

    // 检查路径是否包含 projects 目录
    if (!filePath.includes('projects')) {
      return { valid: false, error: '只能读取 projects 目录下的需求文档' };
    }

    // 更新路径（移除空格后的）
    if (params.path) params.path = filePath;
    if (params.filePath) params.filePath = filePath;
    if (params.file_path) params.file_path = filePath;

    return { valid: true };
  }

  async execute(params) {
    if (!isNode) {
      console.error('[ReadRequirement] 错误：此技能需要在 Node.js 环境中运行');
      console.error('[ReadRequirement] process:', typeof process);
      console.error('[ReadRequirement] process.versions:', process?.versions);
      throw new Error('此技能需要在 Node.js 环境中运行，当前环境：' + (isNode ? 'Node.js' : 'Browser'));
    }

    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      // 支持多种参数命名格式
      const originalPath = params.path || params.filePath || params.file_path;
      console.log(`[ReadRequirement] 尝试读取文件：${originalPath}`);
      
      // 直接使用路径字符串（Node.js 在 Windows 上支持中文路径）
      const content = await fs.readFile(originalPath, 'utf-8');
      
      // 限制文件大小（最多 500KB）
      if (content.length > 512 * 1024) {
        throw new Error('文件过大，只支持读取 500KB 以内的需求文档');
      }

      // 提取文档标题（第一行）
      const firstLine = content.split('\n')[0];
      const title = firstLine.startsWith('#') ? firstLine.replace(/^#+\s*/, '') : '未命名需求';

      this.log('read', { path: originalPath }, { 
        size: content.length,
        lines: content.split('\n').length,
        title 
      });
      
      return {
        success: true,
        path: originalPath,
        content,
        title,
        size: content.length,
        lines: content.split('\n').length,
        encoding: 'utf-8'
      };
    } catch (error) {
      this.log('read_error', { path: params.path || params.filePath || params.file_path }, error.message);
      throw error;
    }
  }
}
