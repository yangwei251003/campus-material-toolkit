# 脚本状态与版本保全

每个原Python脚本均有同名脱敏版本，不把四个渲染变体或不同交付版本拆成原创空仓库。源码内的业务固定路径变为显式workspace，真实文字/品牌/联系内容被替换；私有原件不公开。

| 程序 | 本次执行范围 |
|---|---|
| club/save_posters.py、package_posters.py | 16个合成PNG，实际复制、图像验证、HTML、ZIP CRC及逐图SHA通过 |
| club/render.py | 原1.1倍PDF渲染与页诊断保留；Word默认拒绝实际调用，未做COM导出 |
| club/render_revised.py、render_teacher.py | 原1.3倍缩放、不同文件/记录前缀与页诊断保留；未做COM导出 |
| event/build_pdf.py | 原Paragraph/Table/callout/链接布局与溢出检查，7页合成输入实际输出/文字读回；输入字体改为内置Helvetica别名，不带Windows字体文件 |
| event/build_visual_catalog.py | 4项合成输入，实际像素/SHA清单、HTML过滤器和拼图输出 |
| event/vectorize_brand.py | 原颜色阈值、alpha与k-means的四种轮廓配置，在四张新几何图实际产出4 SVG；没有读取原Logo |
| event/mark_visual_status.py、visual_manifest.py | 原状态更新/设计清单生成代码保留，具体需求/枚举文字合成化；未对原材料重新运行 |
| event/package_visual_delivery.py、assemble_final_delivery.py | 原轻量Word引用、段落/相对链接/ZIP核对代码保留；外部docx工具和真实授权输入未齐，不声称全链路通过 |
| event/v3_delivery_data.py、v3_package.py | 原清单/CSV/说明与ZIP成员哈希流程保留；业务说明合成化，未复建151项材料 |
| event/v3_preflight.py、v3_docs_check.py、v3_pdf_compare.py | 原透明度/变换/分辨率、文件链接/页数、PDF-PNG差异检查保留；未跑原素材或印厂验收 |
| event/v31_assemble.py、v31_finalize.py | 原不同版本的alpha边界、轮廓、成品布局与交付检查分开保全；未把V3和V3.1覆盖合并 |
| organization/build.js | 原布局函数及表格/页面组合，459项文案/标签字符串外置为合成JSON；实际生成448段落/26表格、26 ZIP项、0内嵌图片，XML可读；未做Word最终排版验收 |
| organization/render.py | 原0.8倍联系表与1.6倍逐页图逻辑保留，默认Word调用拒绝；未操作Office |

全部20 Python语法通过；所有函数/类名称和If/For/While/Try/With/Assert计数与原代码相符。此静态证据只证明保全结构，不证明每条业务分支正确。正文/条件中的真实数据已经替换，工作区输入需要与选用版本匹配。
