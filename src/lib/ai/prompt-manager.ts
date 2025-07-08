// src/lib/ai/prompt-manager.ts
import type { 
  PromptTemplate, 
  PromptLibrary, 
  PromptCategory, 
  SummaryType,
  PromptVariable,
  PromptExample 
} from '@/types/ai';

export class PromptManager {
  private library: PromptLibrary;

  constructor() {
    this.library = this.initializeDefaultLibrary();
  }

  private initializeDefaultLibrary(): PromptLibrary {
    const defaultTemplates: Record<SummaryType, string> = {
      brief: 'brief-summary',
      standard: 'standard-summary', 
      detailed: 'detailed-summary',
      'bullet-points': 'bullet-points-summary',
      'key-insights': 'key-insights-summary',
      executive: 'executive-summary',
      technical: 'technical-summary',
      academic: 'academic-summary'
    };

    const templates: Record<string, PromptTemplate> = {
      'brief-summary': {
        id: 'brief-summary',
        name: '简短摘要',
        description: '生成1-2句话的简洁摘要，突出核心信息',
        type: 'brief',
        language: 'auto',
        systemPrompt: `你是一个专业的内容摘要专家。请用1-2句话简洁地总结内容的核心信息。
要求：
- 突出最重要的信息
- 语言简洁明了
- 避免冗余表达
- 保持客观中性`,
        userPromptTemplate: '请为以下内容生成简短摘要：\n\n{{content}}',
        variables: [
          {
            name: 'content',
            type: 'string',
            description: '需要摘要的原始内容',
            required: true
          }
        ],
        tags: ['简短', '核心', '快速'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      'standard-summary': {
        id: 'standard-summary',
        name: '标准摘要',
        description: '生成标准的段落摘要，全面覆盖主要内容',
        type: 'standard',
        language: 'auto',
        systemPrompt: `你是一个专业的内容摘要专家。请生成一个标准的摘要段落，全面覆盖内容的主要信息。
要求：
- 控制在100-200字
- 涵盖主要观点和结论
- 逻辑清晰，表达准确
- 保持原文的核心观点`,
        userPromptTemplate: '请为以下内容生成标准摘要：\n\n{{content}}',
        variables: [
          {
            name: 'content',
            type: 'string',
            description: '需要摘要的原始内容',
            required: true
          }
        ],
        tags: ['标准', '全面', '平衡'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      'detailed-summary': {
        id: 'detailed-summary',
        name: '详细摘要',
        description: '生成详细的多段落摘要，深入分析内容',
        type: 'detailed',
        language: 'auto',
        systemPrompt: `你是一个专业的内容分析师。请生成详细的摘要，可以分为多个段落，深入分析内容的各个方面。
要求：
- 详细分析主要观点
- 包含背景信息和上下文
- 分析影响和意义
- 结构清晰，层次分明
- 保持客观分析`,
        userPromptTemplate: '请为以下内容生成详细摘要：\n\n{{content}}\n\n重点关注：{{focus_areas}}',
        variables: [
          {
            name: 'content',
            type: 'string',
            description: '需要摘要的原始内容',
            required: true
          },
          {
            name: 'focus_areas',
            type: 'string',
            description: '重点关注的领域',
            required: false,
            defaultValue: '主要观点、关键发现、影响分析'
          }
        ],
        tags: ['详细', '深入', '分析'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      'bullet-points-summary': {
        id: 'bullet-points-summary',
        name: '要点列表摘要',
        description: '以要点列表形式总结内容的关键信息',
        type: 'bullet-points',
        language: 'auto',
        systemPrompt: `你是一个专业的信息整理专家。请以清晰的要点列表形式总结内容。
要求：
- 每个要点简洁明了
- 突出关键信息和发现
- 逻辑顺序排列
- 3-8个要点为宜
- 使用统一的格式`,
        userPromptTemplate: `请为以下内容生成要点列表摘要：

{{content}}

请按以下格式输出：
• [要点1]
• [要点2]
• [要点3]
...`,
        variables: [
          {
            name: 'content',
            type: 'string',
            description: '需要摘要的原始内容',
            required: true
          }
        ],
        tags: ['要点', '列表', '结构化'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      'key-insights-summary': {
        id: 'key-insights-summary',
        name: '关键洞察摘要',
        description: '提取内容中的关键洞察和重要发现',
        type: 'key-insights',
        language: 'auto',
        systemPrompt: `你是一个专业的洞察分析师。请重点提取内容中的关键洞察、重要发现和有价值的观点。
要求：
- 识别独特的见解和发现
- 突出趋势和模式
- 分析因果关系
- 提供前瞻性思考
- 注重实用价值`,
        userPromptTemplate: `请分析以下内容，提取关键洞察：

{{content}}

请重点关注：
- 重要发现和结论
- 趋势和变化
- 潜在影响
- 实际应用价值`,
        variables: [
          {
            name: 'content',
            type: 'string',
            description: '需要分析的原始内容',
            required: true
          }
        ],
        tags: ['洞察', '发现', '分析', '价值'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      'executive-summary': {
        id: 'executive-summary',
        name: '执行摘要',
        description: '面向决策者的执行摘要，重点关注决策相关信息',
        type: 'executive',
        language: 'auto',
        systemPrompt: `你是一个专业的商业分析师。请生成面向高级管理者的执行摘要，重点关注决策相关的信息。
要求：
- 突出关键决策点
- 包含风险和机会分析
- 提供明确的建议
- 关注商业影响
- 语言简洁有力`,
        userPromptTemplate: `请为以下内容生成执行摘要：

{{content}}

请包含：
1. 核心发现
2. 关键风险和机会
3. 建议行动
4. 预期影响`,
        variables: [
          {
            name: 'content',
            type: 'string',
            description: '需要摘要的原始内容',
            required: true
          }
        ],
        tags: ['执行', '决策', '商业', '管理'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      'technical-summary': {
        id: 'technical-summary',
        name: '技术摘要',
        description: '重点关注技术细节、方法和实现的摘要',
        type: 'technical',
        language: 'auto',
        systemPrompt: `你是一个专业的技术分析师。请生成技术摘要，重点关注技术细节、实现方法和技术影响。
要求：
- 突出技术创新点
- 详细描述技术方法
- 分析技术优势和局限
- 评估实现难度
- 保持技术准确性`,
        userPromptTemplate: `请为以下技术内容生成摘要：

{{content}}

请重点关注：
- 技术方案和架构
- 实现方法和细节
- 性能和优化
- 技术挑战和解决方案`,
        variables: [
          {
            name: 'content',
            type: 'string',
            description: '需要摘要的技术内容',
            required: true
          }
        ],
        tags: ['技术', '方法', '实现', '架构'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      'academic-summary': {
        id: 'academic-summary',
        name: '学术摘要',
        description: '重点关注研究方法、发现和结论的学术摘要',
        type: 'academic',
        language: 'auto',
        systemPrompt: `你是一个专业的学术研究分析师。请生成学术摘要，重点关注研究方法、重要发现和学术结论。
要求：
- 明确研究目标和方法
- 突出重要发现
- 分析研究意义
- 评估研究局限性
- 保持学术严谨性`,
        userPromptTemplate: `请为以下学术内容生成摘要：

{{content}}

请包含：
1. 研究背景和目标
2. 研究方法和数据
3. 主要发现和结果
4. 结论和学术意义
5. 研究局限性（如有）`,
        variables: [
          {
            name: 'content',
            type: 'string',
            description: '需要摘要的学术内容',
            required: true
          }
        ],
        tags: ['学术', '研究', '方法', '发现'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    const categories: PromptCategory[] = [
      {
        id: 'general',
        name: '通用摘要',
        description: '适用于各种类型内容的通用摘要模板',
        templates: ['brief-summary', 'standard-summary', 'detailed-summary', 'bullet-points-summary']
      },
      {
        id: 'business',
        name: '商业分析',
        description: '面向商业决策和管理的摘要模板',
        templates: ['executive-summary', 'key-insights-summary']
      },
      {
        id: 'technical',
        name: '技术文档',
        description: '适用于技术文档和开发内容的摘要模板',
        templates: ['technical-summary']
      },
      {
        id: 'academic',
        name: '学术研究',
        description: '适用于学术论文和研究报告的摘要模板',
        templates: ['academic-summary']
      }
    ];

    return {
      templates,
      categories,
      defaultTemplates
    };
  }

  // 获取模板
  getTemplate(templateId: string): PromptTemplate | null {
    return this.library.templates[templateId] || null;
  }

  // 获取所有模板
  getAllTemplates(): PromptTemplate[] {
    return Object.values(this.library.templates);
  }

  // 根据类型获取默认模板
  getDefaultTemplate(summaryType: SummaryType): PromptTemplate | null {
    const templateId = this.library.defaultTemplates[summaryType];
    return templateId ? this.getTemplate(templateId) : null;
  }

  // 获取分类
  getCategories(): PromptCategory[] {
    return this.library.categories;
  }

  // 根据分类获取模板
  getTemplatesByCategory(categoryId: string): PromptTemplate[] {
    const category = this.library.categories.find(c => c.id === categoryId);
    if (!category) return [];
    
    return category.templates
      .map(id => this.library.templates[id])
      .filter(Boolean);
  }

  // 根据标签搜索模板
  searchTemplatesByTag(tag: string): PromptTemplate[] {
    return Object.values(this.library.templates)
      .filter(template => template.tags.includes(tag));
  }

  // 构建完整的提示词
  buildPrompt(
    templateId: string, 
    variables: Record<string, any>,
    options: {
      language?: string;
      includeExamples?: boolean;
    } = {}
  ): { systemPrompt: string; userPrompt: string } | null {
    
    const template = this.getTemplate(templateId);
    if (!template) return null;

    // 验证必需变量
    const missingVariables = template.variables
      .filter(v => v.required && !(v.name in variables))
      .map(v => v.name);

    if (missingVariables.length > 0) {
      throw new Error(`缺少必需变量: ${missingVariables.join(', ')}`);
    }

    // 合并默认值
    const mergedVariables = { ...variables };
    template.variables.forEach(variable => {
      if (!(variable.name in mergedVariables) && variable.defaultValue !== undefined) {
        mergedVariables[variable.name] = variable.defaultValue;
      }
    });

    // 替换变量
    let systemPrompt = template.systemPrompt;
    let userPrompt = template.userPromptTemplate;

    // 语言调整
    if (options.language && options.language !== 'auto') {
      const languageInstructions = {
        zh: '\n\n请用中文回复。',
        en: '\n\nPlease respond in English.',
        ja: '\n\n日本語で回答してください。',
        ko: '\n\n한국어로 답변해 주세요.',
        es: '\n\nPor favor responde en español.',
        fr: '\n\nVeuillez répondre en français.',
        de: '\n\nBitte antworten Sie auf Deutsch.'
      };
      
      systemPrompt += languageInstructions[options.language as keyof typeof languageInstructions] || '';
    }

    // 添加示例（如果需要且存在）
    if (options.includeExamples && template.examples && template.examples.length > 0) {
      systemPrompt += '\n\n示例：\n';
      template.examples.forEach((example, index) => {
        systemPrompt += `\n示例 ${index + 1}:\n输入: ${example.input}\n输出: ${example.expectedOutput}\n`;
      });
    }

    // 替换用户提示词中的变量
    for (const [key, value] of Object.entries(mergedVariables)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      userPrompt = userPrompt.replace(placeholder, String(value));
    }

    return { systemPrompt, userPrompt };
  }

  // 添加自定义模板
  addTemplate(template: Omit<PromptTemplate, 'createdAt' | 'updatedAt'>): void {
    const now = new Date().toISOString();
    this.library.templates[template.id] = {
      ...template,
      createdAt: now,
      updatedAt: now
    };
  }

  // 更新模板
  updateTemplate(templateId: string, updates: Partial<PromptTemplate>): boolean {
    const template = this.library.templates[templateId];
    if (!template) return false;

    this.library.templates[templateId] = {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return true;
  }

  // 删除模板
  deleteTemplate(templateId: string): boolean {
    if (this.library.templates[templateId]) {
      delete this.library.templates[templateId];
      return true;
    }
    return false;
  }

  // 验证模板变量
  validateTemplateVariables(template: PromptTemplate, variables: Record<string, any>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    template.variables.forEach(variable => {
      const value = variables[variable.name];

      // 检查必需变量
      if (variable.required && (value === undefined || value === null || value === '')) {
        errors.push(`变量 "${variable.name}" 是必需的`);
        return;
      }

      // 跳过未提供的可选变量
      if (value === undefined || value === null) return;

      // 类型验证
      if (variable.type === 'number' && typeof value !== 'number') {
        errors.push(`变量 "${variable.name}" 应该是数字类型`);
      }

      if (variable.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`变量 "${variable.name}" 应该是布尔类型`);
      }

      if (variable.type === 'array' && !Array.isArray(value)) {
        errors.push(`变量 "${variable.name}" 应该是数组类型`);
      }

      // 验证规则
      if (variable.validation) {
        const validation = variable.validation;

        if (typeof value === 'string' || typeof value === 'number') {
          if (validation.min !== undefined && value < validation.min) {
            errors.push(`变量 "${variable.name}" 不能小于 ${validation.min}`);
          }

          if (validation.max !== undefined && value > validation.max) {
            errors.push(`变量 "${variable.name}" 不能大于 ${validation.max}`);
          }
        }

        if (typeof value === 'string' && validation.pattern) {
          const regex = new RegExp(validation.pattern);
          if (!regex.test(value)) {
            errors.push(`变量 "${variable.name}" 格式不正确`);
          }
        }

        if (validation.enum && !validation.enum.includes(value)) {
          errors.push(`变量 "${variable.name}" 必须是以下值之一: ${validation.enum.join(', ')}`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // 获取模板统计
  getTemplateStats(): {
    totalTemplates: number;
    templatesByType: Record<string, number>;
    templatesByCategory: Record<string, number>;
  } {
    const templates = Object.values(this.library.templates);
    
    const templatesByType: Record<string, number> = {};
    const templatesByCategory: Record<string, number> = {};

    templates.forEach(template => {
      templatesByType[template.type] = (templatesByType[template.type] || 0) + 1;
    });

    this.library.categories.forEach(category => {
      templatesByCategory[category.id] = category.templates.length;
    });

    return {
      totalTemplates: templates.length,
      templatesByType,
      templatesByCategory
    };
  }
}

// 导出单例实例
export const promptManager = new PromptManager();