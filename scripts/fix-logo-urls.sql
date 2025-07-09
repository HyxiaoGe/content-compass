-- 修复无法访问的Logo URL
-- 更新DeepSeek和Midjourney的图标为可访问的替代图标

-- 更新 DeepSeek Logo
UPDATE ai_products 
SET logo_url = 'https://framerusercontent.com/images/kHOmXtWKp7eJl5l9XP2sjmyAYqk.png'
WHERE slug = 'deepseek';

-- 更新 Midjourney Logo  
UPDATE ai_products 
SET logo_url = 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/midjourney.png'
WHERE slug = 'midjourney';

-- 验证更新结果
SELECT name, slug, logo_url 
FROM ai_products 
WHERE slug IN ('deepseek', 'midjourney');