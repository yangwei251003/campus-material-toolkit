# 第三方与资产声明

原脚本是本机项目的辅助程序，保留布局/清单/几何/打包控制逻辑；不把Pillow、OpenCV、ReportLab、docx或其他库的算法声称为本机原创。原商业输入、照片、Logo、二维码、其他学生资料、预算、外部分享HTML均未公开。

根MIT只覆盖本机脚本与本次整理，依赖按自身协议：Python登记在licenses/python-index.json，Node实际测试树登记在licenses/node-tested-index.json，随包LICENSE/NOTICE副本保留在同目录。npm包的全新锁定树尚待远端CI实测，不将测试树冒充完全相同的安装树。

PyMuPDF/MuPDF使用[官方AGPL或商业许可](https://pymupdf.readthedocs.io/en/latest/about.html#license-and-copyright)，根MIT不改变其要求；本项目不捆绑其库代码或二进制。docx采用其MIT，ReportLab/Pillow/OpenCV/NumPy/pypdf/pypdfium2及其原生组件采用登记的各自许可。使用或组合分发这些依赖时应按对应条款执行。

默认PDF合成例子使用PDF内置Helvetica别名，Pillow合成图使用库自带默认字体，不打包Windows字体。DOCX只保存原字体名称与合成文本，不嵌入商业字体或实际图片。未捆绑Microsoft Word、Poppler、外部docx Skill/校验工具；需要时使用者独立准备并遵守各自协议。

docs/demo中的PNG、HTML、PDF、DOCX和ZIP全部来自本次独立合成工作区。几何图不是AI生成、真实Logo或原业务效果图；浏览器和PDF图是实际输出截图。不要据此认为原物料素材或商业资料已备份完整。
