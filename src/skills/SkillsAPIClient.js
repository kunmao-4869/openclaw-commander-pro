/**
 * Skills API 客户端
 * 在浏览器环境中通过 API 调用 Skills
 */

const API_BASE_URL = 'http://localhost:3003/api/skills';

/**
 * Skills API 客户端类
 */
export class SkillsAPIClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.loaded = false;
    this.status = null;
    this.cache = new Map();
  }

  /**
   * 加载 Skills（从 API）
   */
  async loadAllSkills() {
    try {
      console.log('[SkillsAPI] 正在从服务端加载 Skills...');
      
      const response = await fetch(`${this.baseUrl}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.status = await response.json();
      this.loaded = true;
      
      console.log(`[SkillsAPI] ✅ 加载成功：${this.status.totalSkills} 个 Skills`);
      return this.status;
    } catch (error) {
      console.error('[SkillsAPI] ❌ 加载失败:', error);
      throw error;
    }
  }

  /**
   * 获取分类列表
   */
  async getCategories() {
    const response = await fetch(`${this.baseUrl}/categories`);
    return await response.json();
  }

  /**
   * 按分类获取 Skills
   */
  async getSkillsByCategory(category) {
    const response = await fetch(`${this.baseUrl}/${category}`);
    return await response.json();
  }

  /**
   * 搜索 Skills
   */
  async searchSkills(keyword) {
    const response = await fetch(`${this.baseUrl}/search/${encodeURIComponent(keyword)}`);
    return await response.json();
  }

  /**
   * 获取 Skill 详情
   */
  async getSkillDetail(name) {
    const response = await fetch(`${this.baseUrl}/${encodeURIComponent(name)}/detail`);
    
    if (!response.ok) {
      throw new Error(`Skill "${name}" not found`);
    }
    
    return await response.json();
  }

  /**
   * 获取所有 Function Definitions（用于 OpenAI API）
   */
  async getAllFunctionDefinitions() {
    const response = await fetch(`${this.baseUrl}/all/function-definitions`);
    return await response.json();
  }

  /**
   * 获取单个 Skill 的 Function Definition
   */
  async getFunctionDefinition(name) {
    const response = await fetch(`${this.baseUrl}/${encodeURIComponent(name)}/function-definition`);
    return await response.json();
  }

  /**
   * 执行 Skill
   */
  async executeSkill(skillName, action, params = {}) {
    const response = await fetch(`${this.baseUrl}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        skillName,
        action,
        params
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to execute skill');
    }
    
    return await response.json();
  }

  /**
   * 获取加载状态
   */
  getStatus() {
    return this.status;
  }

  /**
   * 查找匹配的 Skills（客户端搜索）
   */
  async findMatchingSkills(keyword) {
    return await this.searchSkills(keyword);
  }
}

/**
 * 创建全局 API 客户端实例
 */
export const skillsAPIClient = new SkillsAPIClient();

/**
 * 便捷函数：加载并获取所有 function definitions
 */
export async function loadSkillsForLLM() {
  if (!skillsAPIClient.loaded) {
    await skillsAPIClient.loadAllSkills();
  }
  return await skillsAPIClient.getAllFunctionDefinitions();
}

/**
 * 便捷函数：查找匹配的 Skills
 */
export async function findMatchingSkills(keyword) {
  return await skillsAPIClient.searchSkills(keyword);
}

/**
 * React Hook: 使用 Skills API
 */
export function useSkills() {
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        await skillsAPIClient.loadAllSkills();
        setStatus(skillsAPIClient.getStatus());
        setSkills(await skillsAPIClient.getAllFunctionDefinitions());
        setLoaded(true);
      } catch (error) {
        console.error('Failed to load skills from API:', error);
      }
    }
    
    load();
  }, []);

  return {
    loaded,
    status,
    skills,
    search: (keyword) => skillsAPIClient.searchSkills(keyword),
    getDetail: (name) => skillsAPIClient.getSkillDetail(name),
    execute: (skillName, action, params) => skillsAPIClient.executeSkill(skillName, action, params)
  };
}

// 导出默认实例
export default skillsAPIClient;
