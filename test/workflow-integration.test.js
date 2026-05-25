/**
 * 工作流与技能集成测试
 * 测试工作流引擎是否能正确调用技能管理器
 */

import { workflowEngine, WorkflowBuilder } from '../src/workflow/WorkflowEngine.js';
import { skillManager } from '../src/skills/core/SkillManager.js';

describe('Workflow Engine Integration', () => {
  beforeAll(() => {
    // 注入技能管理器
    workflowEngine.skillManager = skillManager;
  });

  test('should register workflow with skill calls', async () => {
    // 创建一个简单的工作流
    const workflow = new WorkflowBuilder('test_workflow', '测试工作流')
      .withDescription('测试工作流与技能的集成')
      .addAction('系统信息', 'system_info', {})
      .addAction('等待', null, { duration: 100 })
      .build();

    // 注册工作流
    workflowEngine.registerWorkflow(workflow);

    // 执行工作流
    const result = await workflowEngine.executeWorkflow('test_workflow');

    expect(result.success).toBe(true);
    expect(result.stepsExecuted).toBe(2);
    expect(result.outputs).toBeDefined();
  });

  test('should handle skill execution errors gracefully', async () => {
    // 创建一个包含错误技能的工作流
    const workflow = new WorkflowBuilder('error_workflow', '错误处理测试')
      .addAction('无效技能', 'invalid_skill_name', {})
      .build();

    workflowEngine.registerWorkflow(workflow);

    // 执行工作流，应该不会抛出异常，而是记录错误
    const result = await workflowEngine.executeWorkflow('error_workflow').catch(() => ({
      success: false,
      error: 'Workflow execution failed'
    }));

    expect(result.success).toBe(false);
  });

  test('should pass outputs between skill calls', async () => {
    // 创建一个工作流，步骤之间传递数据
    const workflow = new WorkflowBuilder('data_flow_workflow', '数据流测试')
      .addAction('获取当前目录', 'system_info', {})
      .addAction('处理数据', async (params, context) => {
        // 访问上一步的输出
        const previousOutput = context.outputs['action_'];
        return {
          processed: true,
          originalData: previousOutput
        };
      })
      .build();

    workflowEngine.registerWorkflow(workflow);

    const result = await workflowEngine.executeWorkflow('data_flow_workflow');

    expect(result.success).toBe(true);
    expect(result.stepsExecuted).toBe(2);
  });
});

describe('Skill Manager Integration', () => {
  test('should execute skill through workflow engine', async () => {
    const skillName = 'system_info';
    const params = {};

    // 直接通过工作流引擎执行技能
    const result = await workflowEngine.executeSkill(skillName, params);

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  test('should handle skill not found error', async () => {
    const skillName = 'non_existent_skill';
    const params = {};

    const result = await workflowEngine.executeSkill(skillName, params);

    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
