/**
 * 鼠标和键盘控制技能
 * 模拟鼠标移动、点击和键盘输入
 */

import { SecureSkill } from '../core/SecureSkill.js';

const LOCAL_SERVICE_URL = 'http://localhost:3003';

/**
 * 鼠标移动技能
 */
export class MouseMoveSkill extends SecureSkill {
  constructor() {
    super({
      name: 'mouse_move',
      description: '移动鼠标到指定坐标并可选择点击',
      category: '自动化控制',
      isSafe: true,
      requiresConfirmation: true,
      readOnly: false,
    });
  }

  validate(params) {
    if (params.x === undefined || params.y === undefined) {
      return { valid: false, error: '需要提供 X 和 Y 坐标' };
    }

    if (typeof params.x !== 'number' || typeof params.y !== 'number') {
      return { valid: false, error: '坐标必须是数字' };
    }

    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      // 先移动鼠标
      const moveResponse = await fetch(`${LOCAL_SERVICE_URL}/api/ui/mouse/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          x: params.x,
          y: params.y,
        }),
      });

      if (!moveResponse.ok) {
        const error = await moveResponse.json();
        throw new Error(error.message || '鼠标移动失败');
      }

      // 如果需要点击，再执行点击
      let clickResult = null;
      if (params.click && params.click !== 'none') {
        const clickResponse = await fetch(`${LOCAL_SERVICE_URL}/api/ui/mouse/click`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            button: params.click, // 'left' | 'right' | 'middle'
          }),
        });

        if (clickResponse.ok) {
          clickResult = await clickResponse.json();
        }
      }

      this.log('mouse_move', { x: params.x, y: params.y, click: params.click });
      
      return {
        success: true,
        message: `鼠标已移动到 (${params.x}, ${params.y})${params.click !== 'none' ? ` 并执行${params.click}键点击` : ''}`,
        position: { x: params.x, y: params.y },
        click: params.click,
        clickResult
      };
    } catch (error) {
      this.log('mouse_move_error', params, error.message);
      throw error;
    }
  }
}

/**
 * 键盘输入技能
 */
export class KeyboardInputSkill extends SecureSkill {
  constructor() {
    super({
      name: 'keyboard_input',
      description: '模拟键盘输入文本',
      category: '自动化控制',
      isSafe: true,
      requiresConfirmation: true,
      readOnly: false,
    });
  }

  validate(params) {
    if (!params.text) {
      return { valid: false, error: '需要提供输入文本' };
    }

    if (typeof params.text !== 'string') {
      return { valid: false, error: '文本必须是字符串' };
    }

    return { valid: true };
  }

  async execute(params) {
    const validation = this.validate(params);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const response = await fetch(`${LOCAL_SERVICE_URL}/api/ui/keyboard/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: params.text,
          delay: params.delay || 50,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '键盘输入失败');
      }

      const result = await response.json();
      
      this.log('keyboard_input', { text: params.text, delay: params.delay });
      
      return {
        success: true,
        message: `已输入文本："${params.text}"`,
        text: params.text,
        length: params.text.length,
        delay: params.delay,
        ...result
      };
    } catch (error) {
      this.log('keyboard_input_error', params, error.message);
      throw error;
    }
  }
}
