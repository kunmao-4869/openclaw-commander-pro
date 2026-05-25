/**
 * Skills 集成测试脚本
 * 测试 Skills 加载器的所有功能
 */

import { skillsLoader, findMatchingSkills } from './src/skills/SkillsFolderLoader.js'

async function runTests() {
  console.log('🧪 开始 Skills 集成测试...\n')
  
  let passed = 0
  let failed = 0
  
  // 测试 1: 加载所有 Skills
  try {
    console.log('📦 测试 1: 加载所有 Skills')
    await skillsLoader.loadAllSkills()
    const status = skillsLoader.getStatus()
    
    console.log(`  ✅ 加载成功`)
    console.log(`     - 总计：${status.totalSkills} 个 Skills`)
    console.log(`     - 分类：${status.categories.length} 个`)
    console.log(`     - 分类列表：${status.categories.join(', ')}`)
    passed++
  } catch (error) {
    console.log(`  ❌ 加载失败:`, error.message)
    failed++
  }
  
  console.log()
  
  // 测试 2: 获取分类列表
  try {
    console.log('📂 测试 2: 获取分类列表')
    const categories = skillsLoader.getCategories()
    console.log(`  ✅ 分类列表:`, categories)
    passed++
  } catch (error) {
    console.log(`  ❌ 获取分类失败:`, error.message)
    failed++
  }
  
  console.log()
  
  // 测试 3: 按分类获取 Skills
  try {
    console.log('🔍 测试 3: 按分类获取 Skills')
    for (const category of ['general', 'programming', 'security']) {
      const skills = skillsLoader.getSkillsByCategory(category)
      if (skills.length > 0) {
        console.log(`  ✅ ${category}: ${skills.length} 个 Skills`)
      }
    }
    passed++
  } catch (error) {
    console.log(`  ❌ 按分类获取失败:`, error.message)
    failed++
  }
  
  console.log()
  
  // 测试 4: 关键词匹配
  try {
    console.log('🎯 测试 4: 关键词匹配')
    
    const testCases = [
      { keyword: 'AI 味', expected: 'humanizer' },
      { keyword: 'PDF', expected: 'pdf' },
      { keyword: '代码审查', expected: 'code' },
      { keyword: '搜索', expected: 'search' }
    ]
    
    for (const testCase of testCases) {
      const matched = findMatchingSkills(testCase.keyword)
      if (matched.length > 0) {
        console.log(`  ✅ "${testCase.keyword}" → ${matched.length} 个匹配`)
        matched.forEach(s => console.log(`     - ${s.name}`))
      } else {
        console.log(`  ⚠️ "${testCase.keyword}" → 无匹配`)
      }
    }
    passed++
  } catch (error) {
    console.log(`  ❌ 关键词匹配失败:`, error.message)
    failed++
  }
  
  console.log()
  
  // 测试 5: 获取 Skill 详情
  try {
    console.log('📋 测试 5: 获取 Skill 详情')
    const allSkills = skillsLoader.skills
    const firstSkillName = Array.from(allSkills.keys())[0]
    
    if (firstSkillName) {
      const skill = skillsLoader.getSkillDetail(firstSkillName)
      console.log(`  ✅ Skill: ${skill.name}`)
      console.log(`     - 描述：${skill.description.substring(0, 50)}...`)
      console.log(`     - 分类：${skill.category}`)
      console.log(`     - 优先级：${skill.priority}`)
      console.log(`     - 关键词：${skill.triggerKeywords.slice(0, 3).join(', ')}`)
    }
    passed++
  } catch (error) {
    console.log(`  ❌ 获取详情失败:`, error.message)
    failed++
  }
  
  console.log()
  
  // 测试 6: 转换为 LLM Function Definition
  try {
    console.log('🔄 测试 6: 转换为 LLM Function Definition')
    const allSkills = skillsLoader.skills
    const firstSkillName = Array.from(allSkills.keys())[0]
    
    if (firstSkillName) {
      const skill = skillsLoader.getSkillDetail(firstSkillName)
      const funcDef = skill.toFunctionDefinition()
      
      console.log(`  ✅ 转换成功`)
      console.log(`     - name: ${funcDef.function.name}`)
      console.log(`     - description: ${funcDef.function.description.substring(0, 50)}...`)
      console.log(`     - parameters: ${JSON.stringify(funcDef.function.parameters.type)}`)
    }
    passed++
  } catch (error) {
    console.log(`  ❌ 转换失败:`, error.message)
    failed++
  }
  
  console.log()
  
  // 测试 7: 获取所有 Function Definitions
  try {
    console.log('📦 测试 7: 获取所有 Function Definitions')
    const definitions = skillsLoader.getAllFunctionDefinitions()
    
    console.log(`  ✅ 获取成功：${definitions.length} 个`)
    console.log(`     - 前 3 个:`)
    definitions.slice(0, 3).forEach(def => {
      console.log(`       • ${def.function.name}: ${def.function.description.substring(0, 40)}...`)
    })
    passed++
  } catch (error) {
    console.log(`  ❌ 获取失败:`, error.message)
    failed++
  }
  
  console.log()
  console.log('='.repeat(50))
  console.log(`测试结果：✅ 通过 ${passed} 个 | ❌ 失败 ${failed} 个`)
  console.log('='.repeat(50))
  
  if (failed === 0) {
    console.log('\n🎉 所有测试通过！Skills 已就绪！')
  } else {
    console.log(`\n⚠️ 有 ${failed} 个测试失败，请检查`)
  }
  
  return failed === 0
}

// 运行测试
runTests().then(success => {
  process.exit(success ? 0 : 1)
}).catch(error => {
  console.error('测试执行失败:', error)
  process.exit(1)
})
