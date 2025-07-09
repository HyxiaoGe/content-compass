'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';

interface CrawlResult {
  success: boolean;
  productSlug: string;
  updatesFound: number;
  newUpdates: number;
  error?: string;
}

interface CrawlResponse {
  success: boolean;
  message: string;
  results: CrawlResult[];
  timestamp: string;
  executionTime: number;
}

const MVP_PRODUCTS = [
  { slug: 'openai', name: 'OpenAI' },
  { slug: 'github-copilot', name: 'GitHub Copilot' },
  { slug: 'cursor', name: 'Cursor' },
  { slug: 'claude', name: 'Claude' }
];

export default function CrawlerAdminPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CrawlResponse | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [force, setForce] = useState(false);

  const handleCrawl = async (products?: string[]) => {
    setLoading(true);
    setResults(null);

    try {
      let url = '/.netlify/functions/crawl-products';
      const params = new URLSearchParams();
      
      if (products && products.length > 0) {
        params.append('products', products.join(','));
      }
      
      if (force) {
        params.append('force', 'true');
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }

      console.log('🚀 调用爬取接口:', url);

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      setResults(data);
    } catch (error) {
      console.error('爬取失败:', error);
      setResults({
        success: false,
        message: error instanceof Error ? error.message : '爬取失败',
        results: [],
        timestamp: new Date().toISOString(),
        executionTime: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductToggle = (productSlug: string) => {
    setSelectedProducts(prev => 
      prev.includes(productSlug)
        ? prev.filter(p => p !== productSlug)
        : [...prev, productSlug]
    );
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🤖 爬取系统管理</h1>
        <p className="text-gray-600">
          管理和监控AI产品信息自动爬取系统
        </p>
      </div>

      {/* 控制面板 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>爬取控制</CardTitle>
          <CardDescription>
            选择要爬取的产品或全部爬取
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 产品选择 */}
            <div>
              <h3 className="text-sm font-medium mb-3">选择产品：</h3>
              <div className="flex flex-wrap gap-2">
                {MVP_PRODUCTS.map(product => (
                  <Badge
                    key={product.slug}
                    variant={selectedProducts.includes(product.slug) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleProductToggle(product.slug)}
                  >
                    {product.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 选项 */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="force"
                checked={force}
                onChange={(e) => setForce(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="force" className="text-sm text-gray-600">
                强制重新爬取（忽略缓存）
              </label>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleCrawl(selectedProducts)}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading && <Spinner className="w-4 h-4" />}
                {selectedProducts.length > 0 
                  ? `爬取选中产品 (${selectedProducts.length})`
                  : '爬取所有产品'
                }
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedProducts([]);
                  setForce(false);
                  setResults(null);
                }}
                disabled={loading}
              >
                重置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 结果展示 */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              爬取结果
              <Badge className={getStatusColor(results.success)}>
                {results.success ? '成功' : '失败'}
              </Badge>
            </CardTitle>
            <CardDescription>
              {results.message} • 执行时间: {formatDuration(results.executionTime)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 统计信息 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.results.filter(r => r.success).length}
                  </div>
                  <div className="text-sm text-blue-700">成功产品</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {results.results.reduce((sum, r) => sum + r.updatesFound, 0)}
                  </div>
                  <div className="text-sm text-green-700">发现更新</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {results.results.reduce((sum, r) => sum + r.newUpdates, 0)}
                  </div>
                  <div className="text-sm text-purple-700">新增更新</div>
                </div>
              </div>

              {/* 详细结果 */}
              <div className="space-y-3">
                <h3 className="font-medium">详细结果：</h3>
                {results.results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(result.success)}>
                        {result.success ? '✅' : '❌'}
                      </Badge>
                      <span className="font-medium">
                        {MVP_PRODUCTS.find(p => p.slug === result.productSlug)?.name || result.productSlug}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>发现: {result.updatesFound}</span>
                      <span>新增: {result.newUpdates}</span>
                      {result.error && (
                        <span className="text-red-600 max-w-xs truncate">
                          错误: {result.error}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 时间戳 */}
              <div className="text-xs text-gray-500 mt-4">
                执行时间: {new Date(results.timestamp).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 系统信息 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">系统信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>支持产品数:</strong> {MVP_PRODUCTS.length}
            </div>
            <div>
              <strong>爬取方式:</strong> Netlify Functions
            </div>
            <div>
              <strong>AI分析:</strong> OpenAI GPT-4o-mini
            </div>
            <div>
              <strong>数据存储:</strong> Supabase
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}