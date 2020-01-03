# fbi-project-kbone-vue

Web与小程序同构项目模板


## 依赖

- [fbi](https://github.com/AlloyTeam/fbi) `v3.0+`
- [node](https://nodejs.org/en/) `v8.0+`


## 使用

1. **添加模板**

   ```bash
   $ fbi add https://github.com/fbi-templates/fbi-project-kbone-vue.git
   ```

1. **创建项目**

   ```bash
   $ cd path/to/empty-folder
   $ fbi init -o kbone-vue
   ```

1. **查看可用任务**

   ```bash
   $ fbi ls
   ```

1. **运行任务**

   - 本地开发
     ```bash
     # 小程序
     $ fbi s

     # Web
     $ fbi s --web
     ```
   - 生产构建
     ```bash
     # 小程序
     $ fbi b

     # Web
     $ fbi b --web
     ```

## 任务说明

### `serve`

- 启动开发服务器
- 别名: `s`
- 参数:
  - `web` `{Boolean}` 是否web(默认为小程序)
  - `p/prod` `{Boolean}` (默认) 生产环境
  - `t/test` `{Boolean}` 测试环境
  - `port` `{Boolean}` 服务端口号(仅限web)
- 示例:
  - `fbi s`
  - `fbi s --web`
  - `fbi s --port=9999`
    > 指定服务端口号 (如果要使用 VScode 调试，请记得修改 `.vscode/launch.json`
    > 中的默认端口号 8888)

### `build`

- 生产构建
- 别名: `b`
- 参数:
  - `web` `{Boolean}` 是否web(默认为小程序)
  - `p/prod` `{Boolean}` (默认) 生产环境
  - `t/test` `{Boolean}` 测试环境
- 示例:
  - `fbi b`: 构建小程序到生产环境
  - `fbi b -t`: 构建小程序到测试环境
  - `fbi b --web`: 构建web到生产环境
  - `fbi b --web --test`: 构建web到测试环境

## 更新模板

1. 更新本地全局模板

   ```bash
   $ fbi up kbone-vue
   ```

1. 更新项目使用的模板版本

   ```bash
   $ fbi use [版本号]  # 版本号可通过 fbi ls store 查看
   ```

1.  更新配置文件或任务

   ```bash
   $ fbi init -o/-t    # 原配置文件和任务会备份在fbi-bak目录
   ```

## VSCode 断点调试

1. `fbi s --web`
2. 在 VSCode 内按 F5 快捷键

## 更多

- [官方模板](https://github.com/fbi-templates)
- [fbi 文档](https://neikvon.gitbooks.io/fbi/content/)

## [CHANGELOG](CHANGELOG.md)

## [MIT License](LICENSE)
