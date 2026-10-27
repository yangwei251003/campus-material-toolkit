# 早期文档与网页生成器

这里保留工具箱的一套早期实现：`build_docx.js` 和 `build_html.js`。它们使用共同输入结构，把复盘、计划、执行数据组织成带目录、表格、分节的 DOCX 与长网页。与后期脚本没有相同文件 SHA，也没有相同的完整 AST 结构；存在通用排版模式，**没有充分历史证据断言它们是后期版本的直接祖先**，因此独立保留。

原来的三个 `content/*.js` 只有数据导出，没有函数或依赖；它们是业务输入，包含文案、预算与人员信息，**未作为三个原创工具公开**。公开的 `.synthetic.json` 是按照所需字段结构新造的测试数据，字符串均为 Synthetic example、数字均为 1；配套 JS 只是读取这些合成文件的入口。原数据保存在本地私有审计副本中。

## 快速运行

在主仓库根目录安装原有 Node 依赖（需要 Node.js，包含 `docx@9.6.1`）：

```powershell
npm ci
node workflows/early-document-builders/build_html.js --synthetic-demo --output .runtime/early-docs
node workflows/early-document-builders/build_docx.js --synthetic-demo --output .runtime/early-docs
```

使用新空目录。输出为 `synthetic-plan.html` 和 `synthetic-report.docx`，可以用浏览器或兼容 DOCX 的软件打开。`npm ci` 的完整新环境安装未在这个增补阶段再次联网核验；本机实际生成使用了现有第一方运行环境中的同版本 docx 9.6.1。

直接运行不带参数会在读取内容模块前退出。两个程序只使用仓库内的合成模块，不读取原业务目录，不需要 Office 自动化或联网下载。网页保留了原有直接插入受信任内容的方式，**不提供对任意外部 HTML 的安全清洗能力**；不要把未审查的用户输入交给它并公开托管。

## 保留与适配

- 完整保留两程序的布局与计算控制代码、函数和主要控制结构。
- 业务文字、作者字段和输出位置改成合成占位与显式目录。
- 合成长网页增加显眼的合成说明和小屏表格折行样式，避免英文占位词撑出手机屏幕。
- 原预算预备率作为输入参数分离，演示固定使用明确虚构的 10%，不公开原比例或实际金额。
- 源模板中的静态指标、日期与数量文案也改为 EXAMPLE，不把历史目标数字作为真实业务情况展示。
- 不包含原预算、照片、Logo、二维码、人员名单或原商业文稿；不能还原原交付物，不能据此删除原目录。

## 实测范围

已在 Windows、Node.js 24 和 docx 9.6.1 下运行两个生成器。核验生成的 DOCX ZIP 结构、文档表格/段落及合成正文，并以 Chrome 测试实际 HTML。**没有启动 Word，没有核验 Word 分页、字体替代或印刷效果。** 图示和文档只说明合成样例。

![合成长网页实际浏览器截图](../../docs/images/early-generator-desktop.png)

[合成网页预览](../../docs/demo/early-generator/index.html) · [增补总说明](../../supplement/README.md)

## 许可与状态

本地自有程序及本次整理部分沿用根目录 MIT；第三方 docx 及其依赖遵循各自许可，见主仓库依赖声明。三个原输入文稿的权属或再发布许可未由软件许可推定。

这是历史版本保全与可运行合成示例，不宣称原业务结果复现。后续若继续维护，可将输入校验和 HTML 转义作为独立改进；当前没有重写原排版算法。
