# Campus Material Toolkit：历史源码增补

这是本地宣传物料工具箱的源码覆盖补审。新增 **34 个历史程序：19 个 CJS 和 15 个 Python**；与首批 21 个程序合计 **55 个独立程序文件**。它们保留海报、道具、贴纸、画廊、文档排版、PDF 裁切和资料装配的实现与不同迭代，属于一个工具箱，未拆成多个空壳项目。

业务资料与软件实现分开保存。公开副本替换了硬编码业务文案、价格、联系方式、本机路径和素材引用；保留原函数名称与主要控制流程。**合成占位数据不能还原原业务交付物。** 完整原件、照片、Logo、二维码、预算、人员资料和商业文稿留在原本地目录，不能依据此仓库删除原目录。

## 两个阶段

1. **源码保全**：`workflows/club/*.cjs`、`workflows/event/*.cjs` 和 `workflows/assets/**/*.py`。默认在执行原代码前停止。缺少原输入的历史工作流没有被宣称整体复现。
2. **可运行示例**：`supplement/demo.py`、`supplement/demo_svg.cjs` 与 `supplement/apis/`。仅使用新生成的几何图像、PDF 和 SVG，验证可以独立复用的原有算法。安装及结果说明见[运行示例](DEMO.md)。

## 技术与依赖

Python 使用 Pillow、PyMuPDF；可运行示例使用 Python 3.12。SVG 示例使用 Node.js 与 Sharp。历史代码还涉及 docx、PDFKit、opentype.js、xml-js、svg-to-pdfkit、ReportLab、svglib、OpenCV、NumPy、zxing-cpp，以及外部中文 PDF 字体辅助模块。它们均为外部依赖，未把安装缓存或第三方 Skill 整包复制进来。

中文字体、Word、Poppler、特定 PDF/二维码校验工具及其他历史工作流依赖未在这一增补阶段完整验证。系统字体需要使用者自行取得适用授权，本仓库不分发微软字体。

## 历史工作流入口

直接执行历史脚本会显示 `ARCHIVE_GUARD` 并退出，不先读原文档、不发起业务下载。经核验的两条 PDF 路径由可运行示例以合成工作区显式调用。其他历史脚本须先阅读源码并自行提供获得授权的完整输入，不应对原业务目录试运行。

合成工作区需要 `.campus-material-workspace.json`，内容包含 `"synthetic": true`；历史入口还要求 `--execute-archived --workspace <目录>`。此开关表示显式运行历史代码，不代表该分支已验证。旧网络素材获取程序 `fetch_aircraft.py` 始终阻断，应由使用者提供有权使用的本地素材。

`build_catalog.py` 还保留从其他脚本生成版本的历史方式；其原模板和外部输入不在公开包中。部分旧函数会清理工作区文件，未纳入可运行示例。请使用新空目录。

## 目录与版本

```text
workflows/club/            # 3 个文档制作/修订迭代
workflows/event/           # 16 个 V3 排版、矢量图形及检查模块
workflows/assets/          # 15 个装配、裁切、提取和不同版式的历史脚本
supplement/archive_runtime.* # 默认阻断与显式合成工作区
supplement/apis/           # 从原算法提取的无业务输入模块
supplement/demo*           # 实际合成输入验证入口
docs/demo/supplement/      # 示例真实输出和静态预览
```

有不同实现的同名脚本保留在不同 `edition_*` 目录。原业务目录名称和私有路径映射仅保留在本地审计记录；公开[源码覆盖表](source-coverage.json)给出中性的版本标签。

## 许可与状态

本地自有程序及新增整理代码沿用仓库根目录 MIT 许可；第三方库、字体、照片和机构标识不因此获得 MIT 许可，见[依赖与资产边界](THIRD_PARTY.md)。此工具箱属于历史开发归档与部分可运行示例，不是可直接重制原活动物料的完整产品。

下一步可以为确有复用需求的历史工作流整理公开输入规范和逐项测试；当前没有以替换大半原算法的方式制造完整复现结论。
