/**
 * 测试运行器
 * 用于运行所有测试套件
 */

import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 运行单个测试文件
 */
async function runTestFile(testFile) {
  return new Promise((resolve, reject) => {
    console.log(`\n🧪 运行测试: ${testFile}`);

    const testProcess = exec(
      `node ${testFile}`,
      { cwd: __dirname },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ 测试失败: ${testFile}`);
          console.error(stderr);
          reject(error);
        } else {
          console.log(`✅ 测试通过: ${testFile}`);
          console.log(stdout);
          resolve(stdout);
        }
      }
    );

    // 设置超时
    setTimeout(() => {
      testProcess.kill();
      reject(new Error(`测试超时: ${testFile}`));
    }, 30000); // 30 秒超时
  });
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  const testFiles = [
    'workflow-integration.test.js',
    'performance.test.js'
  ];

  console.log('🚀 开始运行测试套件...');
  console.log(`总共 ${testFiles.length} 个测试文件`);

  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  for (const testFile of testFiles) {
    try {
      await runTestFile(testFile);
      results.passed++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        file: testFile,
        error: error.message
      });
    }
  }

  // 输出测试报告
  console.log('\n' + '='.repeat(50));
  console.log('📊 测试报告');
  console.log('='.repeat(50));
  console.log(`✅ 通过: ${results.passed}`);
  console.log(`❌ 失败: ${results.failed}`);
  console.log(`📈 成功率: ${((results.passed / testFiles.length) * 100).toFixed(1)}%`);

  if (results.errors.length > 0) {
    console.log('\n❌ 失败的测试:');
    results.errors.forEach(err => {
      console.log(`  - ${err.file}: ${err.error}`);
    });
  }

  console.log('='.repeat(50));

  // 返回退出码
  process.exit(results.failed > 0 ? 1 : 0);
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(error => {
    console.error('❌ 测试运行失败:', error);
    process.exit(1);
  });
}

export { runAllTests, runTestFile };
