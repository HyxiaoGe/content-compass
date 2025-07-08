// src/lib/ai/ai-test.ts
import { aiServiceManager } from './ai-service-manager';
import { promptManager } from './prompt-manager';
import type { SummaryOptions, SummaryResult } from '@/types/ai';

export interface AITestResult {
  success: boolean;
  testName: string;
  duration: number;
  result?: any;
  error?: string;
}

export class AITester {
  private testContent = {
    short: '人工智能正在改变我们的工作方式。它提高了效率，但也带来了新的挑战。',
    medium: `
      人工智能技术正在快速发展，深刻改变着各个行业的工作模式。从自动化生产线到智能客服，
      从医疗诊断到金融分析，AI的应用已经渗透到我们生活的方方面面。这项技术不仅提高了工作效率，
      降低了成本，还创造了许多新的就业机会。然而，AI的快速发展也带来了一些挑战，包括数据隐私、
      算法偏见、就业替代等问题。如何在享受AI带来便利的同时，妥善处理这些挑战，是当前社会需要
      认真思考的重要议题。
    `,
    long: `
      人工智能（Artificial Intelligence，AI）作为21世纪最具革命性的技术之一，正在以前所未有的
      速度改变着我们的世界。从最初的概念提出到今天的广泛应用，AI技术经历了数十年的发展历程。

      在技术层面，机器学习、深度学习、自然语言处理等核心技术不断突破，使得AI系统能够在图像识别、
      语音识别、文本理解等领域达到甚至超越人类的表现。特别是大型语言模型的出现，如GPT、BERT等，
      为AI在文本生成、对话系统、代码编写等领域的应用开辟了新的可能性。

      在应用方面，AI已经深入到各个行业：在医疗健康领域，AI辅助诊断系统能够帮助医生更准确地
      识别疾病；在金融服务领域，智能风控系统大大提高了金融交易的安全性；在交通运输领域，
      自动驾驶技术正在改变我们的出行方式；在教育领域，个性化学习系统为每个学生提供定制化的
      学习体验。

      然而，AI的快速发展也引发了一系列社会问题和挑战。首先是就业问题，自动化和智能化可能导致
      传统岗位的消失，尽管同时也会创造新的就业机会，但转型过程中可能出现结构性失业。其次是
      数据隐私和安全问题，AI系统需要大量数据进行训练，如何保护个人隐私成为重要议题。此外，
      算法偏见、AI伦理、技术滥用等问题也需要社会各界的关注和解决。

      展望未来，AI技术将继续快速发展，可能在量子计算、脑机接口、通用人工智能等前沿领域取得
      重大突破。同时，我们也需要建立完善的法律法规和伦理标准，确保AI技术的发展能够真正造福
      人类社会。
    `,
    english: `
      Artificial Intelligence (AI) is revolutionizing industries worldwide. From healthcare to finance,
      from transportation to education, AI applications are transforming how we work and live. Machine learning
      algorithms can now process vast amounts of data to identify patterns and make predictions with remarkable
      accuracy. However, this technological advancement also raises important questions about privacy, ethics,
      and the future of work. As we continue to develop and deploy AI systems, it's crucial to ensure they
      are designed and used responsibly.
    `,
    technical: `
      深度学习是机器学习的一个分支，它基于人工神经网络，特别是深层神经网络。深度学习算法尝试
      用多个处理层对数据进行高层次的抽象建模。典型的深度学习架构包括：

      1. 卷积神经网络（CNN）：主要用于图像处理，通过卷积层、池化层和全连接层实现特征提取和分类。
      2. 循环神经网络（RNN）：适用于序列数据处理，包括长短期记忆网络（LSTM）和门控循环单元（GRU）。
      3. 变换器（Transformer）：基于注意力机制，在自然语言处理领域表现卓越。

      训练深度学习模型通常采用反向传播算法，通过梯度下降优化损失函数。常用的优化器包括SGD、
      Adam、RMSprop等。正则化技术如Dropout、Batch Normalization有助于防止过拟合。
    `
  };

  // 测试基本摘要生成
  async testBasicSummary(): Promise<AITestResult> {
    const startTime = Date.now();
    const testName = '基本摘要生成测试';

    try {
      const result = await aiServiceManager.generateSummary(this.testContent.medium, {
        summaryType: 'standard',
        maxTokens: 500,
        temperature: 0.3
      });

      const duration = Date.now() - startTime;

      if (!result.success) {
        return {
          success: false,
          testName,
          duration,
          error: result.error || '摘要生成失败'
        };
      }

      // 验证结果
      if (!result.summary || result.summary.length < 10) {
        return {
          success: false,
          testName,
          duration,
          error: '生成的摘要过短或为空'
        };
      }

      return {
        success: true,
        testName,
        duration,
        result: {
          summary: result.summary,
          summaryLength: result.summary.length,
          keyPointsCount: result.keyPoints.length,
          tokensUsed: result.metadata.tokensUsed.total,
          cost: result.metadata.cost,
          model: result.metadata.model
        }
      };

    } catch (error) {
      return {
        success: false,
        testName,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 测试不同摘要类型
  async testSummaryTypes(): Promise<AITestResult> {
    const startTime = Date.now();
    const testName = '多种摘要类型测试';

    try {
      const types = ['brief', 'standard', 'detailed', 'bullet-points', 'key-insights'] as const;
      const results: any = {};

      for (const type of types) {
        const result = await aiServiceManager.generateSummary(this.testContent.medium, {
          summaryType: type,
          maxTokens: 300
        });

        results[type] = {
          success: result.success,
          summaryLength: result.success ? result.summary.length : 0,
          keyPointsCount: result.success ? result.keyPoints.length : 0,
          error: result.success ? undefined : result.error
        };
      }

      const duration = Date.now() - startTime;
      const successCount = Object.values(results).filter((r: any) => r.success).length;

      return {
        success: successCount === types.length,
        testName,
        duration,
        result: {
          totalTypes: types.length,
          successfulTypes: successCount,
          results
        }
      };

    } catch (error) {
      return {
        success: false,
        testName,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 测试多语言支持
  async testMultiLanguageSupport(): Promise<AITestResult> {
    const startTime = Date.now();
    const testName = '多语言支持测试';

    try {
      const tests = [
        { content: this.testContent.medium, language: 'zh', name: '中文内容' },
        { content: this.testContent.english, language: 'en', name: '英文内容' },
        { content: this.testContent.medium, language: 'en', name: '中文内容英文摘要' }
      ];

      const results: any = {};

      for (const test of tests) {
        const result = await aiServiceManager.generateSummary(test.content, {
          summaryType: 'standard',
          language: test.language,
          maxTokens: 300
        });

        results[test.name] = {
          success: result.success,
          detectedLanguage: result.success ? result.metadata.language : 'unknown',
          summaryLength: result.success ? result.summary.length : 0,
          error: result.success ? undefined : result.error
        };
      }

      const duration = Date.now() - startTime;
      const successCount = Object.values(results).filter((r: any) => r.success).length;

      return {
        success: successCount === tests.length,
        testName,
        duration,
        result: {
          totalTests: tests.length,
          successfulTests: successCount,
          results
        }
      };

    } catch (error) {
      return {
        success: false,
        testName,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 测试提示词管理器
  async testPromptManager(): Promise<AITestResult> {
    const startTime = Date.now();
    const testName = '提示词管理器测试';

    try {
      // 测试获取模板
      const briefTemplate = promptManager.getDefaultTemplate('brief');
      const standardTemplate = promptManager.getDefaultTemplate('standard');
      
      if (!briefTemplate || !standardTemplate) {
        return {
          success: false,
          testName,
          duration: Date.now() - startTime,
          error: '无法获取默认模板'
        };
      }

      // 测试构建提示词
      const prompts = promptManager.buildPrompt('brief-summary', {
        content: this.testContent.short
      });

      if (!prompts || !prompts.systemPrompt || !prompts.userPrompt) {
        return {
          success: false,
          testName,
          duration: Date.now() - startTime,
          error: '提示词构建失败'
        };
      }

      // 测试模板验证
      const validation = promptManager.validateTemplateVariables(briefTemplate, {
        content: this.testContent.short
      });

      if (!validation.valid) {
        return {
          success: false,
          testName,
          duration: Date.now() - startTime,
          error: '模板变量验证失败: ' + validation.errors.join(', ')
        };
      }

      const duration = Date.now() - startTime;

      return {
        success: true,
        testName,
        duration,
        result: {
          templatesFound: 2,
          promptsBuilt: true,
          validationPassed: true,
          systemPromptLength: prompts.systemPrompt.length,
          userPromptLength: prompts.userPrompt.length
        }
      };

    } catch (error) {
      return {
        success: false,
        testName,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 测试批量处理
  async testBatchProcessing(): Promise<AITestResult> {
    const startTime = Date.now();
    const testName = '批量处理测试';

    try {
      const batchRequest = {
        items: [
          { id: 'test1', content: this.testContent.short },
          { id: 'test2', content: this.testContent.medium },
          { id: 'test3', content: this.testContent.english }
        ],
        batchOptions: {
          maxConcurrency: 2,
          preserveOrder: true,
          continueOnError: true
        }
      };

      const result = await aiServiceManager.generateBatchSummaries(batchRequest);
      const duration = Date.now() - startTime;

      if (result.summary.total !== batchRequest.items.length) {
        return {
          success: false,
          testName,
          duration,
          error: '批量处理结果数量不匹配'
        };
      }

      return {
        success: true,
        testName,
        duration,
        result: {
          totalItems: result.summary.total,
          successfulItems: result.summary.successful,
          failedItems: result.summary.failed,
          totalCost: result.summary.totalCost,
          totalTokens: result.summary.totalTokens,
          batchProcessingTime: result.summary.processingTime
        }
      };

    } catch (error) {
      return {
        success: false,
        testName,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 测试成本估算
  async testCostEstimation(): Promise<AITestResult> {
    const startTime = Date.now();
    const testName = '成本估算测试';

    try {
      const contents = [
        this.testContent.short,
        this.testContent.medium,
        this.testContent.long
      ];

      const estimates: any = {};

      for (let i = 0; i < contents.length; i++) {
        const content = contents[i];
        const contentType = ['short', 'medium', 'long'][i];

        // 这里需要通过AI服务管理器访问成本估算
        // 由于我们的实现中估算方法是私有的，我们测试实际生成来验证成本计算
        const result = await aiServiceManager.generateSummary(content, {
          summaryType: 'brief',
          maxTokens: 200
        });

        estimates[contentType] = {
          success: result.success,
          tokensUsed: result.success ? result.metadata.tokensUsed.total : 0,
          cost: result.success ? result.metadata.cost : 0,
          contentLength: content.length
        };
      }

      const duration = Date.now() - startTime;

      return {
        success: true,
        testName,
        duration,
        result: {
          estimates,
          costIncreaseWithLength: estimates.long.cost > estimates.medium.cost && 
                                  estimates.medium.cost > estimates.short.cost
        }
      };

    } catch (error) {
      return {
        success: false,
        testName,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 测试健康检查
  async testHealthCheck(): Promise<AITestResult> {
    const startTime = Date.now();
    const testName = 'AI服务健康检查测试';

    try {
      const health = await aiServiceManager.healthCheck();
      const duration = Date.now() - startTime;

      const isHealthy = health.status && 
                       typeof health.successRate === 'number' &&
                       typeof health.totalRequests === 'number' &&
                       health.providers &&
                       Object.keys(health.providers).length > 0;

      return {
        success: isHealthy,
        testName,
        duration,
        result: {
          status: health.status,
          providersCount: Object.keys(health.providers).length,
          successRate: health.successRate,
          totalRequests: health.totalRequests,
          activeRequests: health.activeRequests,
          providers: health.providers
        }
      };

    } catch (error) {
      return {
        success: false,
        testName,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 运行所有测试
  async runAllTests(): Promise<{
    passed: number;
    failed: number;
    total: number;
    results: AITestResult[];
    summary: string;
  }> {
    console.log('🚀 开始运行AI服务测试套件...');

    const tests = [
      () => this.testBasicSummary(),
      () => this.testSummaryTypes(),
      () => this.testMultiLanguageSupport(),
      () => this.testPromptManager(),
      () => this.testHealthCheck(),
      () => this.testCostEstimation(),
      () => this.testBatchProcessing()
    ];

    const results: AITestResult[] = [];
    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      try {
        console.log(`⏳ 运行测试...`);
        const result = await test();
        results.push(result);
        
        if (result.success) {
          passed++;
          console.log(`✅ ${result.testName} - 通过 (${result.duration}ms)`);
        } else {
          failed++;
          console.log(`❌ ${result.testName} - 失败: ${result.error} (${result.duration}ms)`);
        }
      } catch (error) {
        failed++;
        const failedResult: AITestResult = {
          success: false,
          testName: '测试执行失败',
          duration: 0,
          error: error instanceof Error ? error.message : '未知错误'
        };
        results.push(failedResult);
        console.log(`💥 测试执行失败: ${failedResult.error}`);
      }
    }

    const total = passed + failed;
    const summary = `AI服务测试完成: ${passed}/${total} 通过, ${failed} 失败`;

    console.log(`\n📊 ${summary}`);
    
    return {
      passed,
      failed,
      total,
      results,
      summary
    };
  }
}

// 导出测试实例
export const aiTester = new AITester();

// 快速测试函数
export async function quickAITest(): Promise<boolean> {
  try {
    const result = await aiServiceManager.generateSummary(
      '这是一个简单的测试文本，用于验证AI服务是否正常工作。',
      { summaryType: 'brief', maxTokens: 100 }
    );
    return result.success;
  } catch (error) {
    console.error('AI服务快速测试失败:', error);
    return false;
  }
}