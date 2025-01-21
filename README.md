<h1 align="center">
  <a href="https://github.com/dashpresshq/dashpress">
    <img src="https://dashpress.io/assets/banner/1.png" alt="Logo" >
  </a>
</h1>

<div align="center">

[![Project license](https://img.shields.io/github/license/dashpresshq/dashpress.svg)](LICENSE)
[![Pull Requests welcome](https://img.shields.io/badge/PRs-welcome-23bc42.svg)](https://github.com/dashpresshq/dashpress/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
<img src="https://img.shields.io/npm/v/dashpress" />
<img src="https://img.shields.io/github/languages/top/dashpresshq/dashpress" />


[![Maintainability](https://api.codeclimate.com/v1/badges/23516bfbcca7557d80a5/maintainability)](https://codeclimate.com/github/dashpresshq/dashpress/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/23516bfbcca7557d80a5/test_coverage)](https://codeclimate.com/github/dashpresshq/dashpress/test_coverage)
<img src="https://img.shields.io/codeclimate/tech-debt/dashpresshq/dashpress" />
![GitHub CI](https://github.com/dashpresshq/dashpress/actions/workflows/release.yml/badge.svg)

</div>

<div align="center">
  <a href="https://demo.dashpress.io" target="_blank">在线演示</a>
  ·
  <a href="https://discord.gg/aV6DxwXhzN" target="_blank">加入社区</a>
</div>

---

## 关于
Dashpress 是一个管理应用生成器，可以帮助你快速高效地将数据库模式转换为时尚、可定制且高性能的管理仪表板。

### 核心特性

- 🚀 **快速部署**: 零代码配置，快速将数据库转化为管理后台
- 🎨 **可定制界面**: 支持自定义主题、布局和组件
- 🔒 **安全可靠**: 内置角色权限管理和数据加密
- 📊 **数据可视化**: 强大的图表和仪表盘功能
- 🌐 **多语言支持**: 内置国际化框架
- 🔌 **扩展性强**: 支持插件系统和自定义集成

### 快速开始

1. 安装
```bash
npm install dashpress
```

2. 配置环境变量
创建 .env 文件并配置以下必要参数：
```env
CONFIG_ADAPTOR=json-file
CREDENTIALS_ENCRYPTION_KEY=your_encryption_key
AUTH_TOKEN_KEY=your_auth_key
```

3. 启动应用
```bash
npm run dev
```

### 配置说明

#### 数据源配置
- `CONFIG_ADAPTOR`: 配置存储适配器类型
- `CONFIG_ADAPTOR_CONNECTION_STRING`: 配置存储连接字符串
- `CACHE_ADAPTOR`: 缓存适配器类型
- `CACHE_ADAPTOR_CONNECTION_STRING`: 缓存连接字符串

#### 安全配置
- `CREDENTIALS_ENCRYPTION_KEY`: 凭证加密密钥
- `AUTH_TOKEN_KEY`: 认证令牌密钥

### 主要功能

1. **数据管理**
- 自动生成 CRUD 操作界面
- 支持复杂查询和过滤
- 数据导入导出
- 批量操作支持

2. **用户管理**
- 用户认证和授权
- 角色权限管理
- 访问控制列表
- 用户活动日志

3. **仪表盘**
- 可视化图表
- 自定义小部件
- 实时数据更新
- 拖拽式布局

4. **系统设置**
- 主题定制
- 国际化配置
- 系统备份
- 性能监控

### API 使用

#### REST API
```typescript
// 示例：获取数据列表
GET /api/data/:entity

// 示例：创建新记录
POST /api/data/:entity

// 示例：更新记录
PUT /api/data/:entity/:id

// 示例：删除记录
DELETE /api/data/:entity/:id
```

### 开发指南

1. **项目结构**
```
src/
  ├── backend/        # 后端服务
  ├── frontend/       # 前端应用
  ├── shared/         # 共享模块
  └── bin/           # CLI 工具
```

2. **开发命令**
```bash
# 开发模式
npm run dev

# 构建应用
npm run build

# 运行测试
npm run test

# 代码检查
npm run lint
```

### 常见问题

1. **如何自定义主题？**
通过修改 `src/styles/themes.css` 文件来自定义主题样式。

2. **如何添加新的数据源？**
在 `src/backend/data` 目录下添加新的数据源适配器。

3. **如何扩展现有功能？**
通过插件系统或直接修改源码来扩展功能。

### 贡献指南

欢迎提交 Pull Request 或提出 Issue。详细信息请参考 [贡献指南](docs/CONTRIBUTING.md)。

### 许可证

本项目采用 GPL-3.0 许可证。详见 [LICENSE](LICENSE) 文件。
