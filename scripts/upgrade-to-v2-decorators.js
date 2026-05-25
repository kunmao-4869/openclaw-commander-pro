/**
 * 批量更新 .ets 文件，将 V1 装饰器升级为 V2 装饰器
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generatedDir = path.join(__dirname, '..', 'generated');

// V2 装饰器升级规则
const v2Upgrades = {
  // 添加 @Observed 装饰器的类定义
  'Light.ets': {
    addBefore: '@Entry',
    content: `// V2 装饰器：观察类
@Observed
class LightState {
  washroom: boolean = false;
  wardrobe: boolean = false;
  floor: boolean = false;
  bar: boolean = false;
  desk: boolean = false;
  right_read: boolean = false;
  left_read: boolean = false;
  fan: boolean = false;
  hall: boolean = false;
}

`
  }
};

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  let updated = false;
  
  console.log(`\n📄 处理：${fileName}`);
  
  // 替换复杂对象为@Observed 类
  if (fileName === 'Light.ets') {
    content = content.replace(
      /@State lights: Record<string, boolean> = \{[\s\S]*?\};/g,
      '@State lightState: LightState = new LightState(); // V2 方式处理复杂对象'
    );
    updated = true;
  }
  
  // 替换所有 this.lights 为 this.lightState
  if (content.includes('this.lights')) {
    content = content.replace(/this\.lights\[/g, 'this.lightState[');
    console.log('  ✓ 替换：this.lights → this.lightState');
    updated = true;
  }
  
  // 添加 V2 装饰器注释
  if (content.includes('@State') && !content.includes('V2 装饰器')) {
    content = content.replace(
      /(@State\s+\w+:\s+\w+)/g,
      '// V2 装饰器\n  $1'
    );
    console.log('  ✓ 添加：V2 装饰器注释');
    updated = true;
  }
  
  // 更新文件头注释
  if (fileName.endsWith('.ets') && !content.includes('MVVM 架构 | V2 状态管理')) {
    content = content.replace(
      /(\* 智慧客房系统 HarmonyOS 应用\n \*)/,
      '* 智慧客房系统 HarmonyOS 应用\n * MVVM 架构 | V2 状态管理 | Navigation 导航\n */'
    );
    console.log('  ✓ 更新：文件头注释');
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ 文件已更新：${fileName}`);
  } else {
    console.log(`⏭️  无需更新：${fileName}`);
  }
}

// 主函数
function main() {
  console.log('🔄 开始升级 V2 装饰器...\n');
  
  const files = [
    'Login.ets',
    'Home.ets',
    'Light.ets',
    'Curtain.ets',
    'Service.ets'
  ];
  
  for (const file of files) {
    const filePath = path.join(generatedDir, file);
    if (fs.existsSync(filePath)) {
      updateFile(filePath);
    } else {
      console.log(`❌ 文件不存在：${file}`);
    }
  }
  
  console.log('\n✅ V2 装饰器升级完成！');
}

main();
