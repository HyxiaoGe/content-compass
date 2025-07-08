// src/lib/scraper/content-cleaner.ts
export class ContentCleaner {
  private readonly AD_PATTERNS = [
    /advertisement/gi,
    /sponsored/gi,
    /\bad\s*(content|block|banner)\b/gi,
    /promo/gi,
    /banner/gi,
    /promotion/gi,
    /affiliate/gi
  ];

  private readonly NAVIGATION_PATTERNS = [
    /navigation/gi,
    /menu/gi,
    /header/gi,
    /footer/gi,
    /sidebar/gi,
    /breadcrumb/gi,
    /pagination/gi
  ];

  private readonly NOISE_PATTERNS = [
    /cookie\s+(policy|notice|consent)/gi,
    /terms\s+of\s+(service|use)/gi,
    /privacy\s+policy/gi,
    /subscribe\s+to\s+(our\s+)?newsletter/gi,
    /follow\s+us\s+on/gi,
    /share\s+(this\s+)?article/gi,
    /related\s+articles/gi,
    /you\s+might\s+also\s+like/gi,
    /read\s+more:?/gi,
    /continue\s+reading/gi,
    /comments?\s*\(\d+\)/gi,
    /\d+\s+comments?/gi,
    /sign\s+up\s+for/gi,
    /get\s+our\s+newsletter/gi,
    /download\s+our\s+app/gi
  ];

  private readonly STOP_WORDS = new Set([
    // 英文停用词
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'among', 'this', 'that',
    'these', 'those', 'is', 'was', 'are', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'shall', 'should', 'will',
    // 中文停用词
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一',
    '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有',
    '看', '好', '自己', '这', '那', '里', '就是', '还', '只', '下', '把'
  ]);

  cleanContent(rawContent: string): string {
    let cleaned = rawContent;

    // 移除多余的空白字符
    cleaned = this.cleanWhitespace(cleaned);

    // 移除常见的非内容元素
    cleaned = this.removeCommonNoise(cleaned);

    // 移除重复的句子
    cleaned = this.removeDuplicateSentences(cleaned);

    // 移除过短的段落
    cleaned = this.removeShortParagraphs(cleaned);

    // 最终清理
    cleaned = this.finalClean(cleaned);

    return cleaned.trim();
  }

  private cleanWhitespace(text: string): string {
    return text
      .replace(/\s+/g, ' ') // 多个空白字符替换为单个空格
      .replace(/\n\s*\n/g, '\n') // 多个换行符替换为单个换行符
      .replace(/\t+/g, ' ') // 制表符替换为空格
      .replace(/[\r\f\v]/g, ' ') // 其他空白字符替换为空格
      .trim();
  }

  private removeCommonNoise(text: string): string {
    let cleaned = text;
    
    // 移除常见的噪音模式
    for (const pattern of this.NOISE_PATTERNS) {
      cleaned = cleaned.replace(pattern, '');
    }

    // 移除广告相关文本
    for (const pattern of this.AD_PATTERNS) {
      cleaned = cleaned.replace(pattern, '');
    }

    // 移除导航相关文本
    for (const pattern of this.NAVIGATION_PATTERNS) {
      cleaned = cleaned.replace(pattern, '');
    }

    return cleaned;
  }

  private removeDuplicateSentences(text: string): string {
    // 按句子分割（支持中英文）
    const sentences = text.split(/[.!?。！？]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);

    // 去重但保持顺序
    const seenSentences = new Set<string>();
    const uniqueSentences: string[] = [];

    for (const sentence of sentences) {
      const normalized = sentence.toLowerCase().replace(/\s+/g, ' ');
      if (!seenSentences.has(normalized)) {
        seenSentences.add(normalized);
        uniqueSentences.push(sentence);
      }
    }

    return uniqueSentences.join('. ') + (uniqueSentences.length > 0 ? '.' : '');
  }

  private removeShortParagraphs(text: string): string {
    const paragraphs = text.split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    // 只保留长度超过30个字符的段落
    const filteredParagraphs = paragraphs.filter(p => p.length > 30);

    return filteredParagraphs.join('\n');
  }

  private finalClean(text: string): string {
    return text
      .replace(/\s{2,}/g, ' ') // 移除多余空格
      .replace(/\n{3,}/g, '\n\n') // 限制连续换行
      .replace(/[^\S\n]{2,}/g, ' ') // 移除非换行的多余空白
      .trim();
  }

  // 检测内容语言
  detectLanguage(text: string): string {
    const sample = text.substring(0, 1000);
    
    // 中文字符检测
    const chinesePattern = /[\u4e00-\u9fff]/g;
    const chineseMatches = sample.match(chinesePattern) || [];
    
    // 日文字符检测
    const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff]/g;
    const japaneseMatches = sample.match(japanesePattern) || [];
    
    // 韩文字符检测
    const koreanPattern = /[\uac00-\ud7af]/g;
    const koreanMatches = sample.match(koreanPattern) || [];
    
    // 阿拉伯文字符检测
    const arabicPattern = /[\u0600-\u06ff]/g;
    const arabicMatches = sample.match(arabicPattern) || [];

    // 俄文字符检测
    const russianPattern = /[\u0400-\u04ff]/g;
    const russianMatches = sample.match(russianPattern) || [];

    const totalChars = sample.length;
    
    if (chineseMatches.length / totalChars > 0.3) return 'zh';
    if (japaneseMatches.length / totalChars > 0.2) return 'ja';
    if (koreanMatches.length / totalChars > 0.2) return 'ko';
    if (arabicMatches.length / totalChars > 0.2) return 'ar';
    if (russianMatches.length / totalChars > 0.2) return 'ru';
    
    return 'en'; // 默认英语
  }

  // 提取关键信息
  extractKeyInfo(text: string): {
    summary: string;
    keywords: string[];
  } {
    const sentences = text.split(/[.!?。！？]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20);
    
    // 简单的摘要：取前3个最长的有意义句子
    const meaningfulSentences = sentences
      .filter(s => !this.isLowQualitySentence(s))
      .sort((a, b) => b.length - a.length)
      .slice(0, 3);

    const summary = meaningfulSentences.join('. ') + (meaningfulSentences.length > 0 ? '.' : '');

    // 提取关键词
    const keywords = this.extractKeywords(text);

    return { summary, keywords };
  }

  private isLowQualitySentence(sentence: string): boolean {
    const lowQualityPatterns = [
      /^(read more|continue reading|click here)/i,
      /^(advertisement|sponsored|promotion)/i,
      /^(share|follow|subscribe|download)/i,
      /^\d+\s*(comments?|replies?)/i,
      /^(source|via|by)\s*:/i
    ];

    return lowQualityPatterns.some(pattern => pattern.test(sentence.trim()));
  }

  extractKeywords(text: string): string[] {
    // 提取单词（支持中英文）
    const words = text.toLowerCase()
      .replace(/[^\w\u4e00-\u9fff\s]/g, ' ') // 保留字母、数字、中文和空格
      .split(/\s+/)
      .filter(word => word.length > 2);

    // 统计词频
    const wordCount: { [key: string]: number } = {};
    
    words.forEach(word => {
      if (!this.isStopWord(word) && this.isValidKeyword(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    // 提取高频关键词
    const keywords = Object.entries(wordCount)
      .filter(([_, count]) => count >= 2) // 至少出现2次
      .sort(([_, a], [__, b]) => b - a) // 按频率排序
      .slice(0, 15) // 最多15个关键词
      .map(([word, _]) => word);

    return keywords;
  }

  private isStopWord(word: string): boolean {
    return this.STOP_WORDS.has(word.toLowerCase());
  }

  private isValidKeyword(word: string): boolean {
    // 检查是否为有效关键词
    if (word.length < 3) return false;
    if (/^\d+$/.test(word)) return false; // 纯数字
    if (!/[\w\u4e00-\u9fff]/.test(word)) return false; // 必须包含字母或中文
    
    return true;
  }

  // 计算阅读时间（分钟）
  calculateReadingTime(text: string): number {
    const language = this.detectLanguage(text);
    let wordsPerMinute: number;

    switch (language) {
      case 'zh':
      case 'ja':
      case 'ko':
        // 中日韩文阅读速度（字符/分钟）
        wordsPerMinute = 300;
        break;
      case 'ar':
        // 阿拉伯文阅读速度
        wordsPerMinute = 180;
        break;
      default:
        // 英文及其他语言（词/分钟）
        wordsPerMinute = 200;
    }

    const wordCount = this.calculateWordCount(text, language);
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  // 计算字数
  calculateWordCount(text: string, language?: string): number {
    const detectedLanguage = language || this.detectLanguage(text);

    if (['zh', 'ja', 'ko'].includes(detectedLanguage)) {
      // 中日韩文按字符计算
      return text.replace(/\s/g, '').length;
    } else {
      // 其他语言按词计算
      return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
  }

  // 提取摘要（更智能的版本）
  generateSmartSummary(text: string, maxSentences: number = 3): string {
    const sentences = text.split(/[.!?。！？]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20);

    if (sentences.length <= maxSentences) {
      return sentences.join('. ') + '.';
    }

    // 计算句子重要性分数
    const scoredSentences = sentences.map((sentence, index) => {
      let score = 0;

      // 位置分数（开头和结尾的句子更重要）
      if (index === 0) score += 2;
      if (index === sentences.length - 1) score += 1;
      if (index < sentences.length * 0.3) score += 1;

      // 长度分数（适中长度的句子更重要）
      const length = sentence.length;
      if (length > 50 && length < 150) score += 1;

      // 关键词分数（包含更多关键词的句子更重要）
      const keywords = this.extractKeywords(text);
      const sentenceWords = sentence.toLowerCase().split(/\s+/);
      const keywordCount = sentenceWords.filter(word => keywords.includes(word)).length;
      score += keywordCount * 0.5;

      // 避免重复内容
      const normalizedSentence = sentence.toLowerCase().replace(/\s+/g, ' ');
      const isDuplicate = sentences.some((otherSentence, otherIndex) => {
        if (index === otherIndex) return false;
        const normalizedOther = otherSentence.toLowerCase().replace(/\s+/g, ' ');
        return this.calculateSimilarity(normalizedSentence, normalizedOther) > 0.8;
      });
      
      if (isDuplicate) score -= 2;

      return { sentence, score, index };
    });

    // 选择得分最高的句子
    const selectedSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSentences)
      .sort((a, b) => a.index - b.index) // 按原始顺序排列
      .map(item => item.sentence);

    return selectedSentences.join('. ') + '.';
  }

  // 计算句子相似度
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = new Set(str1.split(/\s+/));
    const words2 = new Set(str2.split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  // 清理HTML标签
  stripHtml(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }
}