/**
 * 安全系统信息查询技能
 * 只读操作，不修改系统设置
 */

import { SecureSkill } from '../core/SecureSkill.js';

export class SystemInfoSkill extends SecureSkill {
  constructor() {
    super({
      name: 'get_system_info',
      description: '获取系统信息（只读，不修改）',
      category: '系统信息',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  async execute(params) {
    // 检测是否在 Node.js 环境
    const isNode = typeof process !== 'undefined' && process.versions?.node;
    
    if (!isNode) {
      // 浏览器环境，返回有限信息
      return {
        success: true,
        info: {
          platform: 'browser',
          userAgent: navigator.userAgent,
          language: navigator.language,
          online: navigator.onLine,
          note: '浏览器环境，信息受限',
        },
      };
    }

    // Node.js 环境，获取完整信息
    const os = await import('os');
    
    try {
      const platform = process.platform;
      let info = {
        platform,
        arch: process.arch,
        nodeVersion: process.version,
        cpus: [],
        memory: {
          total: 0,
          free: 0,
        },
        uptime: 0,
      };

      // 获取 CPU 信息
      info.cpus = os.cpus().map(cpu => ({
        model: cpu.model,
        speed: cpu.speed,
        cores: os.cpus().length,
      }));

      // 获取内存信息
      info.memory.total = os.totalmem();
      info.memory.free = os.freemem();
      info.memory.used = info.memory.total - info.memory.free;

      // 获取运行时间
      info.uptime = os.uptime();

      this.log('get_system_info', {}, { platform, cpus: info.cpus.length });
      
      return {
        success: true,
        info: {
          ...info,
          memory: {
            total: `${Math.round(info.memory.total / 1024 / 1024 / 1024)} GB`,
            free: `${Math.round(info.memory.free / 1024 / 1024 / 1024)} GB`,
            used: `${Math.round(info.memory.used / 1024 / 1024 / 1024)} GB`,
            usage: `${Math.round((info.memory.used / info.memory.total) * 100)}%`,
          },
          uptime: `${Math.round(info.uptime / 3600)} 小时`,
        },
      };
    } catch (error) {
      this.log('get_system_info_error', {}, error.message);
      throw error;
    }
  }
}

export class ProcessListSkill extends SecureSkill {
  constructor() {
    super({
      name: 'list_processes',
      description: '列出进程信息（只读，不修改）',
      category: '系统信息',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  async execute(params) {
    const isNode = typeof process !== 'undefined' && process.versions?.node;
    
    if (!isNode) {
      return {
        success: true,
        processes: [],
        total: 0,
        note: '浏览器环境，无法获取进程信息',
      };
    }

    try {
      const platform = process.platform;
      let command;

      if (platform === 'win32') {
        command = 'tasklist /FO JSON';
      } else {
        command = 'ps aux | head -20';
      }

      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      const { stdout } = await execAsync(command, {
        maxBuffer: 1024 * 1024,
        timeout: 5000,
      });

      let processes = [];

      if (platform === 'win32') {
        const data = JSON.parse(stdout);
        processes = data.map(p => ({
          name: p['Image Name'],
          pid: p.PID,
          memory: p['Mem Usage'],
        }));
      } else {
        const lines = stdout.trim().split('\n').slice(1);
        processes = lines.map(line => {
          const parts = line.split(/\s+/);
          return {
            name: parts[10],
            pid: parseInt(parts[1]),
            cpu: parseFloat(parts[2]),
            memory: parseFloat(parts[3]),
          };
        });
      }

      this.log('list_processes', {}, { count: processes.length });
      
      return {
        success: true,
        processes: processes.slice(0, 20),
        total: processes.length,
      };
    } catch (error) {
      this.log('list_processes_error', {}, error.message);
      throw error;
    }
  }
}

export class NetworkInfoSkill extends SecureSkill {
  constructor() {
    super({
      name: 'get_network_info',
      description: '获取网络信息（只读，不修改）',
      category: '系统信息',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  async execute(params) {
    const isNode = typeof process !== 'undefined' && process.versions?.node;
    
    if (!isNode) {
      return {
        success: true,
        network: {
          online: navigator.onLine,
          userAgent: navigator.userAgent,
        },
        hostname: 'browser',
        note: '浏览器环境，信息受限',
      };
    }

    try {
      const os = await import('os');
      const interfaces = os.networkInterfaces();
      
      const networkInfo = {};
      
      for (const [name, addresses] of Object.entries(interfaces)) {
        networkInfo[name] = addresses
          .filter(addr => addr.family === 'IPv4')
          .map(addr => ({
            address: addr.address,
            netmask: addr.netmask,
          }));
      }

      this.log('get_network_info', {}, { interfaces: Object.keys(networkInfo).length });
      
      return {
        success: true,
        network: networkInfo,
        hostname: os.hostname(),
      };
    } catch (error) {
      this.log('get_network_info_error', {}, error.message);
      throw error;
    }
  }
}

export class PingTestSkill extends SecureSkill {
  constructor() {
    super({
      name: 'ping_test',
      description: 'Ping 测试（只读，不修改）',
      category: '网络工具',
      isSafe: true,
      requiresConfirmation: false,
      readOnly: true,
    });
  }

  validate(params) {
    if (!params.host) {
      return { valid: false, error: '缺少目标主机参数' };
    }

    // 防止命令注入
    if (!/^[\w.-]+$/.test(params.host)) {
      return { valid: false, error: '无效的主机名格式' };
    }

    return { valid: true };
  }

  async execute(params) {
    const isNode = typeof process !== 'undefined' && process.versions?.node;
    
    if (!isNode) {
      throw new Error('Ping 测试需要在 Node.js 环境中运行');
    }

    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const platform = process.platform;
      const command = platform === 'win32' 
        ? `ping -n 4 ${params.host}`
        : `ping -c 4 ${params.host}`;

      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      const { stdout, stderr } = await execAsync(command, {
        timeout: 10000,
        maxBuffer: 1024 * 1024,
      });

      if (stderr && !stdout) {
        throw new Error(stderr);
      }

      this.log('ping_test', { host: params.host }, { success: true });
      
      return {
        success: true,
        host: params.host,
        output: stdout,
      };
    } catch (error) {
      this.log('ping_test_error', params, error.message);
      throw error;
    }
  }
}
