/**
 * 批量更新生成的 .ets 文件中的图片引用
 * 使用实际的图片资源路径
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generatedDir = path.join(__dirname, 'generated');
const imageMappings = {
  // 首页图片映射
  'app.media.ac_icon': 'app.media.home_icon_airconditioner',
  'app.media.bright_icon': 'app.media.home_icon_bright',
  'app.media.soft_icon': 'app.media.home_icon_soft',
  'app.media.read_icon': 'app.media.home_icon_read',
  'app.media.warm_icon': 'app.media.home_icon_warm',
  'app.media.sleep_icon': 'app.media.light_icon_sleep_mode',
  'app.media.dnd_icon': 'app.media.home_icon_undisturb',
  'app.media.clean_icon': 'app.media.home_icon_clear',
  'app.media.night_icon': 'app.media.home_icon_night_left',
  'app.media.home_tab_icon': 'app.media.tabs_icon_home_select',
  'app.media.light_tab_icon': 'app.media.tabs_icon_light_unselect',
  'app.media.light_tab_active_icon': 'app.media.tabs_icon_light_select',
  'app.media.curtain_tab_icon': 'app.media.tabs_icon_curtain_unselect',
  'app.media.curtain_tab_active_icon': 'app.media.tabs_icon_curtain_select',
  'app.media.service_tab_icon': 'app.media.tabs_icon_service_unselect',
  'app.media.service_tab_active_icon': 'app.media.tabs_icon_service_select',
  
  // 灯光页面图片映射
  'app.media.power_on_icon': 'app.media.light_toggle_on',
  'app.media.power_off_icon': 'app.media.light_toggle_off',
  'app.media.washroom_icon': 'app.media.light_icon_washroom',
  'app.media.wardrobe_icon': 'app.media.light_icon_wardrobe',
  'app.media.floor_icon': 'app.media.light_icon_floor',
  'app.media.bar_icon': 'app.media.light_icon_bar_lamp',
  'app.media.desk_icon': 'app.media.light_icon_right_left_desk_read',
  'app.media.fan_icon': 'app.media.light_icon_exhaust_fan',
  'app.media.hall_icon': 'app.media.light_icon_corrid_lights',
  
  // 窗帘页面图片映射
  'app.media.curtain_open_icon': 'app.media.curtain_icon_open',
  'app.media.curtain_close_icon': 'app.media.curtain_icon_close',
  'app.media.sheer_open_icon': 'app.media.curtain_icon_window_screening_left_part',
  'app.media.sheer_close_icon': 'app.media.curtain_icon_window_screening_left_part_closed',
  'app.media.open_icon': 'app.media.curtain_icon_open',
  'app.media.pause_icon': 'app.media.curtain_icon_pause',
  'app.media.close_icon': 'app.media.curtain_icon_close',
  
  // 服务页面图片映射
  'app.media.sos_icon': 'app.media.service_btn_sos_bg',
  'app.media.logout_icon': 'app.media.service_btn_logout',
};

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let updated = false;
  
  for (const [oldImage, newImage] of Object.entries(imageMappings)) {
    if (content.includes(oldImage)) {
      content = content.replace(new RegExp(oldImage.replace('.', '\\.'), 'g'), newImage);
      updated = true;
      console.log(`  ✓ 替换图片：${oldImage} -> ${newImage}`);
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ 文件已更新：${path.basename(filePath)}`);
  } else {
    console.log(`⏭️  无需更新：${path.basename(filePath)}`);
  }
}

// 主函数
function main() {
  console.log('🔄 开始更新图片资源引用...\n');
  
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
      console.log(`📄 处理：${file}`);
      updateFile(filePath);
      console.log('');
    } else {
      console.log(`❌ 文件不存在：${file}`);
    }
  }
  
  console.log('✅ 图片资源更新完成！');
}

main();
