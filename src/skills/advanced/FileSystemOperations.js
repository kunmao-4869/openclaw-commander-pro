/**
 * 高级文件系统操作技能
 * 提供全面的文件和目录操作功能
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

// 允许操作的目录白名单
const ALLOWED_DIRECTORIES = isNode ? [
  path.resolve('./projects'),
  path.resolve('./temp'),
  path.resolve('./output'),
] : [];

// 检查路径是否安全
function isPathSafe(filePath) {
  if (!isNode) return false;
  const resolvedPath = path.resolve(filePath);
  
  // 检查是否在允许的目录内
  for (const allowedDir of ALLOWED_DIRECTORIES) {
    if (resolvedPath.startsWith(allowedDir)) {
      return true;
    }
  }
  
  return false;
}

// 检查文件类型（防止写入可执行文件）
function isSafeFileType(filePath) {
  if (!isNode) return false;
  const ext = path.extname(filePath).toLowerCase();
  const dangerousExts = ['.exe', '.bat', '.cmd', '.sh', '.ps1'];
  return !dangerousExts.includes(ext);
}

/**
 * 高级文件系统操作技能
 */
export class FileSystemOperationsSkill extends SecureSkill {
  constructor() {
    super({
      name: 'file_system_operations',
      description: '高级文件系统操作（读写、复制、移动、删除等）',
      category: '文件操作',
      isSafe: true,
      requiresConfirmation: true,
      readOnly: false,
    });
  }

  validate(params) {
    // 检查操作类型
    const operation = params.operation;
    if (!operation) {
      return { valid: false, error: '缺少操作类型' };
    }

    const validOperations = ['read', 'write', 'append', 'delete', 'copy', 'move', 'mkdir', 'list'];
    if (!validOperations.includes(operation)) {
      return { valid: false, error: `无效的操作类型，支持：${validOperations.join(', ')}` };
    }

    // 检查路径参数
    if (['read', 'write', 'append', 'delete', 'copy', 'move'].includes(operation)) {
      const filePath = params.path || params.filePath;
      if (!filePath) {
        return { valid: false, error: '缺少文件路径' };
      }

      // 检查路径安全性
      if (!isPathSafe(filePath)) {
        return { 
          valid: false, 
          error: `不允许操作该路径，只允许操作：${ALLOWED_DIRECTORIES.join(', ')}` 
        };
      }

      // 写入操作额外检查
      if (['write', 'append'].includes(operation)) {
        if (!params.content && operation !== 'append') {
          return { valid: false, error: '缺少文件内容' };
        }

        if (!isSafeFileType(filePath)) {
          return { valid: false, error: '不允许操作可执行文件' };
        }
      }

      // 复制和移动操作额外检查
      if (['copy', 'move'].includes(operation)) {
        const destPath = params.destination || params.destPath;
        if (!destPath) {
          return { valid: false, error: '缺少目标路径' };
        }

        if (!isPathSafe(destPath)) {
          return { 
            valid: false, 
            error: `不允许操作目标路径，只允许操作：${ALLOWED_DIRECTORIES.join(', ')}` 
          };
        }
      }
    }

    // 目录操作检查
    if (['mkdir', 'list'].includes(operation)) {
      const dirPath = params.path || params.dirPath;
      if (!dirPath) {
        return { valid: false, error: '缺少目录路径' };
      }

      if (!isPathSafe(dirPath)) {
        return { 
          valid: false, 
          error: `不允许操作该路径，只允许操作：${ALLOWED_DIRECTORIES.join(', ')}` 
        };
      }
    }

    return { valid: true };
  }

  async execute(params) {
    if (!isNode) {
      throw new Error('file_system_operations 技能只能在 Node.js 环境（服务端）运行');
    }

    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const operation = params.operation;
      let result;

      switch (operation) {
        case 'read': {
          const filePath = params.path || params.filePath;
          const encoding = params.encoding || 'utf-8';
          
          const content = await fs.readFile(filePath, { encoding });
          const stats = await fs.stat(filePath);

          this.log('file_read', { path: filePath }, {
            size: stats.size,
            encoding
          });

          result = {
            success: true,
            operation: 'read',
            path: filePath,
            content,
            size: stats.size,
            modified: stats.mtime
          };
          break;
        }

        case 'write': {
          let filePath = params.path || params.filePath;
          const content = params.content;
          const encoding = params.encoding || 'utf-8';

          // 如果是相对路径，自动添加到 projects 目录
          if (!path.isAbsolute(filePath)) {
            filePath = path.join(ALLOWED_DIRECTORIES[0], filePath);
          }
          
          filePath = path.resolve(filePath);

          // 确保目录存在
          const dir = path.dirname(filePath);
          await fs.mkdir(dir, { recursive: true });

          // 写入文件
          await fs.writeFile(filePath, content, { encoding });

          // 获取文件信息
          const stats = await fs.stat(filePath);

          this.log('file_write', { path: filePath }, {
            size: stats.size,
            encoding
          });

          result = {
            success: true,
            operation: 'write',
            path: filePath,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          };
          break;
        }

        case 'append': {
          let filePath = params.path || params.filePath;
          const content = params.content || '';
          const encoding = params.encoding || 'utf-8';

          // 如果是相对路径，自动添加到 projects 目录
          if (!path.isAbsolute(filePath)) {
            filePath = path.join(ALLOWED_DIRECTORIES[0], filePath);
          }
          
          filePath = path.resolve(filePath);

          // 确保目录存在
          const dir = path.dirname(filePath);
          await fs.mkdir(dir, { recursive: true });

          // 追加内容
          await fs.appendFile(filePath, content, { encoding });

          // 获取文件信息
          const stats = await fs.stat(filePath);

          this.log('file_append', { path: filePath }, {
            size: stats.size,
            encoding
          });

          result = {
            success: true,
            operation: 'append',
            path: filePath,
            size: stats.size,
            modified: stats.mtime
          };
          break;
        }

        case 'delete': {
          const filePath = params.path || params.filePath;
          
          // 检查文件是否存在
          const stats = await fs.stat(filePath);
          if (!stats.isFile()) {
            throw new Error('指定路径不是文件');
          }

          // 删除文件
          await fs.unlink(filePath);

          this.log('file_delete', { path: filePath });

          result = {
            success: true,
            operation: 'delete',
            path: filePath,
            message: '文件删除成功'
          };
          break;
        }

        case 'copy': {
          const srcPath = params.path || params.filePath;
          const destPath = params.destination || params.destPath;

          // 确保目标目录存在
          const destDir = path.dirname(destPath);
          await fs.mkdir(destDir, { recursive: true });

          // 复制文件
          await fs.copyFile(srcPath, destPath);

          // 获取目标文件信息
          const stats = await fs.stat(destPath);

          this.log('file_copy', { source: srcPath, destination: destPath });

          result = {
            success: true,
            operation: 'copy',
            source: srcPath,
            destination: destPath,
            size: stats.size,
            modified: stats.mtime
          };
          break;
        }

        case 'move': {
          const srcPath = params.path || params.filePath;
          const destPath = params.destination || params.destPath;

          // 确保目标目录存在
          const destDir = path.dirname(destPath);
          await fs.mkdir(destDir, { recursive: true });

          // 移动文件
          await fs.rename(srcPath, destPath);

          // 获取目标文件信息
          const stats = await fs.stat(destPath);

          this.log('file_move', { source: srcPath, destination: destPath });

          result = {
            success: true,
            operation: 'move',
            source: srcPath,
            destination: destPath,
            size: stats.size,
            modified: stats.mtime
          };
          break;
        }

        case 'mkdir': {
          let dirPath = params.path || params.dirPath;

          // 如果是相对路径，自动添加到 projects 目录
          if (!path.isAbsolute(dirPath)) {
            dirPath = path.join(ALLOWED_DIRECTORIES[0], dirPath);
          }
          
          dirPath = path.resolve(dirPath);

          // 创建目录
          await fs.mkdir(dirPath, { recursive: true });

          this.log('directory_create', { path: dirPath });

          result = {
            success: true,
            operation: 'mkdir',
            path: dirPath,
            message: '目录创建成功'
          };
          break;
        }

        case 'list': {
          const dirPath = params.path || params.dirPath;
          const type = params.type || 'all';
          
          // 读取目录
          const entries = await fs.readdir(dirPath, { withFileTypes: true });
          
          const result = {
            success: true,
            operation: 'list',
            path: dirPath,
            directories: [],
            files: []
          };
          
          // 过滤和分类条目
          for (const entry of entries) {
            // 跳过隐藏文件和 node_modules
            if (entry.name.startsWith('.') || entry.name === 'node_modules') {
              continue;
            }
            
            const item = {
              name: entry.name,
              path: path.join(dirPath, entry.name)
            };
            
            if (entry.isDirectory() && (type === 'all' || type === 'directories')) {
              result.directories.push(item);
            } else if (entry.isFile() && (type === 'all' || type === 'files')) {
              result.files.push(item);
            }
          }

          this.log('directory_list', { path: dirPath, type });

          return result;
        }

        default:
          throw new Error(`不支持的操作类型：${operation}`);
      }

      return result;
    } catch (error) {
      this.log('file_operation_error', params, error.message);
      throw error;
    }
  }
}

/**
 * 批量文件操作技能
 */
export class BatchFileOperationsSkill extends SecureSkill {
  constructor() {
    super({
      name: 'batch_file_operations',
      description: '批量文件操作（从操作列表）',
      category: '文件操作',
      isSafe: true,
      requiresConfirmation: true,
      readOnly: false,
    });
  }

  validate(params) {
    if (!params.operations || !Array.isArray(params.operations)) {
      return { valid: false, error: '需要操作列表' };
    }

    return { valid: true };
  }

  async execute(params) {
    if (!isNode) {
      throw new Error('batch_file_operations 技能只能在 Node.js 环境（服务端）运行');
    }

    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const { operations } = params;
    const results = [];
    let successCount = 0;
    let failCount = 0;

    const fileSkill = new FileSystemOperationsSkill();

    for (const operation of operations) {
      try {
        console.log(`  执行操作：${operation.operation} - ${operation.path || operation.filePath}`);
        
        const result = await fileSkill.execute(operation);

        results.push({
          operation: operation.operation,
          path: operation.path || operation.filePath,
          success: true,
          result
        });
        successCount++;
      } catch (error) {
        console.error(`  操作失败：${operation.operation} - ${operation.path || operation.filePath}`, error.message);
        results.push({
          operation: operation.operation,
          path: operation.path || operation.filePath,
          success: false,
          error: error.message
        });
        failCount++;
      }
    }

    return {
      success: failCount === 0,
      total: operations.length,
      successCount,
      failCount,
      results
    };
  }
}

// 导出单例
export const fileSystemOperationsSkill = new FileSystemOperationsSkill();
export const batchFileOperationsSkill = new BatchFileOperationsSkill();
