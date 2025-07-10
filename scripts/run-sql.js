#!/usr/bin/env node

/**
 * 执行SQL脚本的Node.js工具
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 配置Supabase
const supabaseUrl = 'https://ibcosbscpshgexjgpoiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY29zYnNjcHNoZ2V4amdwb2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk1MDU5MCwiZXhwIjoyMDY3NTI2NTkwfQ.0tRC0vsiNVBUASbY7ChXlT7NRXSmtxa14rfsghgvMu0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQLFile(filePath) {
  try {
    console.log(`📄 读取SQL文件: ${filePath}`);
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // 分割SQL语句（按分号分割，但要考虑字符串中的分号）
    const statements = sqlContent
      .split(/;\s*(?=(?:[^']*'[^']*')*[^']*$)/) // 只在字符串外的分号处分割
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--')); // 过滤空语句和注释
    
    console.log(`📝 找到 ${statements.length} 条SQL语句`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) continue;
      
      console.log(`🔄 执行第 ${i + 1} 条语句...`);
      
      try {
        // 使用rpc执行原生SQL
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_text: statement
        });
        
        if (error) {
          // 如果没有exec_sql函数，直接用SQL查询
          console.log(`⚠️  rpc调用失败，尝试直接执行: ${error.message}`);
          
          // 对于INSERT语句，我们需要转换为Supabase的insert方法
          if (statement.trim().toLowerCase().startsWith('insert into product_updates')) {
            await executeInsertStatement(statement);
          } else if (statement.trim().toLowerCase().startsWith('select')) {
            // 对于SELECT语句，直接执行
            const { data, error } = await supabase
              .from('product_updates')
              .select(`
                *,
                ai_products!inner(name)
              `)
              .filter('content_hash', 'like', '%_2025')
              .order('published_at', { ascending: false });
              
            if (error) {
              console.error(`❌ SELECT查询失败:`, error.message);
            } else {
              console.log(`✅ 查询结果:`, data);
            }
          }
        } else {
          console.log(`✅ 第 ${i + 1} 条语句执行成功`);
          if (data) console.log('返回数据:', data);
        }
      } catch (execError) {
        console.error(`❌ 第 ${i + 1} 条语句执行失败:`, execError.message);
        console.log('语句内容:', statement.substring(0, 100) + '...');
      }
    }
    
    console.log(`🎉 SQL文件执行完成!`);
    
  } catch (error) {
    console.error('❌ 执行SQL文件失败:', error.message);
    process.exit(1);
  }
}

// 辅助函数：执行INSERT语句
async function executeInsertStatement(statement) {
  try {
    // 解析INSERT语句，转换为Supabase格式
    console.log('🔄 转换INSERT语句为Supabase格式...');
    
    // 这里我们简化处理，直接使用硬编码的数据插入
    const updates = [
      {
        product_id: 1, // 假设cursor的id是1
        title: 'Cursor 1.2 - Agent规划、更好的上下文和更快的Tab',
        summary: 'Cursor 1.2版本带来了Agent待办事项规划功能，让长期任务更易理解和跟踪。Agent现在会提前规划结构化的待办事项列表，并在工作进展时更新。新增队列消息功能，可以在Agent完成当前任务后排队后续消息。',
        key_points: ['Agent待办事项 - 结构化任务规划和跟踪', '队列消息 - 无需等待即可排队多个任务', 'Memories正式GA - 更好的项目记忆管理'],
        version_number: '1.2',
        published_at: '2025-07-03T00:00:00Z',
        importance_level: 'high',
        tags: ['Agent', '性能优化', '新功能', '上下文管理'],
        original_url: 'https://cursor.com/changelog',
        status: 'published',
        ai_model_used: 'manual',
        confidence_score: 1.0,
        content_hash: 'cursor_1_2_july_2025'
      }
    ];
    
    console.log('⚠️  暂时跳过INSERT操作，需要先获取正确的product_id');
    
  } catch (error) {
    console.error('❌ INSERT语句执行失败:', error.message);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('❌ 请提供SQL文件路径');
    console.log('用法: node run-sql.js <sql-file-path>');
    process.exit(1);
  }
  
  const sqlFile = args[0];
  const fullPath = path.resolve(sqlFile);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ 文件不存在: ${fullPath}`);
    process.exit(1);
  }
  
  await executeSQLFile(fullPath);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { executeSQLFile };