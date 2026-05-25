/**
 * Skills API 路由
 * 在服务端加载 Skills 并提供给前端
 */

import express from 'express';
import { skillsLoader } from '../../src/skills/SkillsFolderLoader.js';

const router = express.Router();

// 缓存加载的 Skills
let skillsCache = null;
let loadingPromise = null;

/**
 * 确保 Skills 已加载
 */
async function ensureSkillsLoaded() {
  if (skillsCache) {
    return skillsCache;
  }
  
  if (!loadingPromise) {
    loadingPromise = skillsLoader.loadAllSkills()
      .then(() => {
        skillsCache = skillsLoader.getStatus();
        console.log('[Skills API] ✅ Skills 加载完成:', skillsCache);
        return skillsCache;
      })
      .catch(error => {
        console.error('[Skills API] ❌ Skills 加载失败:', error);
        loadingPromise = null;
        throw error;
      });
  }
  
  return loadingPromise;
}

/**
 * GET /api/skills
 * 获取 Skills 状态
 */
router.get('/', async (req, res) => {
  try {
    const status = await ensureSkillsLoaded();
    res.json(status);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load skills',
      message: error.message
    });
  }
});

/**
 * GET /api/skills/categories
 * 获取所有分类
 */
router.get('/categories', async (req, res) => {
  try {
    await ensureSkillsLoaded();
    const categories = skillsLoader.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get categories',
      message: error.message
    });
  }
});

/**
 * GET /api/skills/:category
 * 获取某个分类的 Skills
 */
router.get('/:category', async (req, res) => {
  try {
    await ensureSkillsLoaded();
    const skills = skillsLoader.getSkillsByCategory(req.params.category);
    res.json(skills);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get skills by category',
      message: error.message
    });
  }
});

/**
 * GET /api/skills/search/:keyword
 * 根据关键词搜索 Skills
 */
router.get('/search/:keyword', async (req, res) => {
  try {
    await ensureSkillsLoaded();
    const matched = skillsLoader.findSkillsByKeyword(req.params.keyword);
    res.json(matched.map(skill => ({
      name: skill.name,
      description: skill.description,
      category: skill.category,
      priority: skill.priority,
      triggerKeywords: skill.triggerKeywords
    })));
  } catch (error) {
    res.status(500).json({
      error: 'Failed to search skills',
      message: error.message
    });
  }
});

/**
 * GET /api/skills/:name/detail
 * 获取 Skill 详情
 */
router.get('/:name/detail', async (req, res) => {
  try {
    await ensureSkillsLoaded();
    const skill = skillsLoader.getSkillDetail(req.params.name);
    
    if (!skill) {
      return res.status(404).json({
        error: 'Skill not found',
        message: `Skill "${req.params.name}" not found`
      });
    }
    
    res.json({
      name: skill.name,
      description: skill.description,
      category: skill.category,
      priority: skill.priority,
      triggerKeywords: skill.triggerKeywords,
      examples: skill.examples
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get skill detail',
      message: error.message
    });
  }
});

/**
 * GET /api/skills/:name/function-definition
 * 获取 Skill 的 LLM Function Definition
 */
router.get('/:name/function-definition', async (req, res) => {
  try {
    await ensureSkillsLoaded();
    const skill = skillsLoader.getSkillDetail(req.params.name);
    
    if (!skill) {
      return res.status(404).json({
        error: 'Skill not found'
      });
    }
    
    const funcDef = skill.toFunctionDefinition();
    res.json(funcDef);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get function definition',
      message: error.message
    });
  }
});

/**
 * GET /api/skills/all/function-definitions
 * 获取所有 Skills 的 Function Definitions（用于 OpenAI API）
 */
router.get('/all/function-definitions', async (req, res) => {
  try {
    await ensureSkillsLoaded();
    const definitions = skillsLoader.getAllFunctionDefinitions();
    res.json(definitions);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get function definitions',
      message: error.message
    });
  }
});

/**
 * POST /api/skills/execute
 * 执行 Skill（使用 SkillExecutor）
 */
router.post('/execute', async (req, res) => {
  try {
    const { skillName, action, params } = req.body;
    
    if (!skillName) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'skillName is required'
      });
    }
    
    // 使用 SkillExecutor 执行技能
    const { skillExecutor } = await import('../../src/skills/core/SkillExecutor.js');
    
    if (!skillExecutor.hasSkill(skillName)) {
      return res.status(404).json({
        error: 'Skill not found',
        message: `Skill "${skillName}" is not registered in SkillExecutor`
      });
    }
    
    console.log('[Skills API] 🚀 使用 SkillExecutor 执行技能:', {
      skillName,
      action,
      params
    });
    
    const result = await skillExecutor.execute(skillName, params || {});
    
    res.json({
      success: true,
      message: `Skill "${skillName}" executed successfully`,
      result
    });
  } catch (error) {
    console.error('[Skills API] ❌ 执行失败:', error);
    res.status(500).json({
      error: 'Failed to execute skill',
      message: error.message,
      skillName: req.body?.skillName
    });
  }
});

export default router;
