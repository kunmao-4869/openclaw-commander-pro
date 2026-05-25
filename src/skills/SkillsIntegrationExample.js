/**
 * Skills 集成示例
 * 展示如何在 App 中集成 Skills 文件夹加载器
 */

import { skillsLoader, loadSkillsForLLM, findMatchingSkills } from './skills/SkillsFolderLoader.js';

/**
 * AI 助手类 - 集成 Skills
 */
export class AIAssistantWithSkills {
  constructor() {
    this.skillsLoaded = false;
    this.skillDefinitions = [];
    this.currentSkills = new Map();
  }

  /**
   * 初始化：加载 Skills
   */
  async initializeSkills() {
    try {
      console.log('[AIAssistant] 正在加载 Skills...');
      
      // 加载所有 Skills
      await skillsLoader.loadAllSkills();
      
      // 获取 LLM 可用的 function definitions
      this.skillDefinitions = skillsLoader.getAllFunctionDefinitions();
      
      this.skillsLoaded = true;
      
      const status = skillsLoader.getStatus();
      console.log(`[AIAssistant] ✅ Skills 加载完成:`);
      console.log(`  - 总计：${status.totalSkills} 个 Skills`);
      console.log(`  - 分类：${status.categories.join(', ')}`);
      
      return true;
    } catch (error) {
      console.error('[AIAssistant] Skills 加载失败:', error);
      return false;
    }
  }

  /**
   * 获取发送给 LLM 的 tools/parameters
   */
  getToolsForLLM() {
    if (!this.skillsLoaded) {
      return [];
    }
    
    return this.skillDefinitions;
  }

  /**
   * 根据用户消息匹配 Skills
   */
  matchSkillsFromMessage(message) {
    const matchedSkills = [];
    
    // 提取关键词
    const keywords = this.extractKeywords(message);
    
    for (const keyword of keywords) {
      const skills = findMatchingSkills(keyword);
      matchedSkills.push(...skills);
    }
    
    // 去重
    const uniqueSkills = Array.from(
      new Map(matchedSkills.map(s => [s.name, s])).values()
    );
    
    return uniqueSkills;
  }

  /**
   * 提取消息中的关键词
   */
  extractKeywords(message) {
    // 简单的中文分词（实际应该用更好的分词库）
    const words = message.split(/[\s,，.。?!？！]+/);
    
    // 过滤掉太短的词
    return words
      .filter(w => w.length >= 2)
      .slice(0, 10); // 限制关键词数量
  }

  /**
   * 执行 Skill
   */
  async executeSkill(skillName, action, params) {
    const skill = skillsLoader.getSkillDetail(skillName);
    
    if (!skill) {
      throw new Error(`Skill 不存在：${skillName}`);
    }
    
    console.log(`[AIAssistant] 执行 Skill: ${skillName}`);
    console.log(`  操作：${action}`);
    console.log(`  参数：`, params);
    
    // 实际执行逻辑（需要调用后端 API 或本地脚本）
    // 这里只是示例
    return {
      success: true,
      message: `Skill "${skillName}" 执行完成`,
      data: {}
    };
  }

  /**
   * 处理用户消息（带 Skills）
   */
  async processMessage(message) {
    // 1. 匹配 Skills
    const matchedSkills = this.matchSkillsFromMessage(message);
    
    if (matchedSkills.length > 0) {
      console.log(`[AIAssistant] 匹配到 ${matchedSkills.length} 个 Skills:`);
      matchedSkills.forEach(s => console.log(`  - ${s.name}`));
      
      // 2. 构建带 Skills 的 prompt
      const prompt = this.buildPromptWithSkills(message, matchedSkills);
      
      // 3. 发送给 LLM（这里只是示例）
      const response = await this.sendToLLM(prompt);
      
      // 4. 如果 LLM 返回 tool_calls，执行对应的 Skills
      if (response.tool_calls) {
        for (const toolCall of response.tool_calls) {
          const result = await this.executeSkill(
            toolCall.function.name,
            toolCall.function.arguments.action,
            toolCall.function.arguments
          );
          
          // 5. 将执行结果返回给 LLM
          response.content += `\n\n执行结果：${JSON.stringify(result)}`;
        }
      }
      
      return response;
    }
    
    // 没有匹配 Skills，正常对话
    return this.sendToLLM(message);
  }

  /**
   * 构建带 Skills 的 prompt
   */
  buildPromptWithSkills(message, matchedSkills) {
    const skillsContext = matchedSkills.map(skill => {
      return `
## ${skill.name}
- 描述：${skill.description}
- 分类：${skill.category}
- 优先级：${skill.priority}
- 可用操作：${skill.getAvailableActions().join(', ')}
      `.trim();
    }).join('\n\n');
    
    return `
你是一个智能助手，可以使用以下 Skills 来帮助用户：

${skillsContext}

用户消息：${message}

如果需要使用某个 Skill，请返回 tool_calls 格式。
    `.trim();
  }

  /**
   * 发送到 LLM（示例）
   */
  async sendToLLM(prompt) {
    // 实际应该调用 OpenAI API 或其他 LLM
    console.log('[AIAssistant] 发送到 LLM:', prompt.substring(0, 100) + '...');
    
    // 模拟响应
    return {
      content: '这是一个示例响应',
      tool_calls: []
    };
  }

  /**
   * 获取 Skills 状态
   */
  getStatus() {
    return {
      loaded: this.skillsLoaded,
      totalSkills: this.skillDefinitions.length,
      categories: skillsLoader.getCategories()
    };
  }
}

/**
 * React Hook: 使用 Skills
 */
export function useSkills() {
  const [loaded, setLoaded] = useState(false);
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        await skillsLoader.loadAllSkills();
        setSkills(skillsLoader.getAllFunctionDefinitions());
        setCategories(skillsLoader.getCategories());
        setLoaded(true);
      } catch (error) {
        console.error('Failed to load skills:', error);
      }
    }
    
    load();
  }, []);

  return {
    loaded,
    skills,
    categories,
    findMatching: (keyword) => skillsLoader.findSkillsByKeyword(keyword),
    getDetail: (name) => skillsLoader.getSkillDetail(name)
  };
}

// 导出单例
export const aiAssistant = new AIAssistantWithSkills();
