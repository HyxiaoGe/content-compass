'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'

const footerLinks = {
  product: [
    { name: '功能特性', href: '#features' },
    { name: '价格方案', href: '/pricing' },
    { name: 'API 文档', href: '/api' },
    { name: '更新日志', href: '/changelog' },
  ],
  resources: [
    { name: '帮助文档', href: '/docs' },
    { name: '使用指南', href: '/guide' },
    { name: '最佳实践', href: '/best-practices' },
    { name: '社区论坛', href: '/community' },
  ],
  support: [
    { name: '联系我们', href: '/contact' },
    { name: '技术支持', href: '/support' },
    { name: '系统状态', href: '/status' },
    { name: '报告问题', href: '/report' },
  ],
  company: [
    { name: '关于我们', href: '/about' },
    { name: '加入我们', href: '/careers' },
    { name: '媒体资料', href: '/press' },
    { name: '合作伙伴', href: '/partners' },
  ],
  legal: [
    { name: '隐私政策', href: '/privacy' },
    { name: '服务条款', href: '/terms' },
    { name: '使用协议', href: '/agreement' },
    { name: 'Cookie 政策', href: '/cookies' },
  ],
}

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/contentcompass' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/contentcompass' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/contentcompass' },
  { name: 'Email', icon: Mail, href: 'mailto:hello@contentcompass.ai' },
]

export function FooterSection() {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            top: '20%',
            right: '10%',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* 主要内容区域 */}
        <motion.div 
          className="py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* 品牌信息 */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ContentCompass
                </span>
              </div>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                智能网页内容解析平台，让信息获取更高效。使用最先进的 AI 技术，为您提供专业的内容处理解决方案。
              </p>
              
              {/* 社交媒体链接 */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* 链接部分 */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-gray-200">产品</h3>
                  <ul className="space-y-3">
                    {footerLinks.product.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href} 
                          className="text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 text-gray-200">资源</h3>
                  <ul className="space-y-3">
                    {footerLinks.resources.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href} 
                          className="text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 text-gray-200">支持</h3>
                  <ul className="space-y-3">
                    {footerLinks.support.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href} 
                          className="text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 text-gray-200">公司</h3>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href} 
                          className="text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 text-gray-200">法律</h3>
                  <ul className="space-y-3">
                    {footerLinks.legal.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href} 
                          className="text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 底部版权信息 */}
        <motion.div 
          className="border-t border-gray-800 py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <span>&copy; 2024 ContentCompass. 保留所有权利。</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400">
              <span>使用</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>构建于中国</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}