# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
import json, csv, sys, shutil, html
sys.stdout.reconfigure(encoding='utf8')
ROOT = Path(runtime.workspace())
V = ROOT / 'output/DemoCampussample-8fbc8444_V3'
R = V / 'sample-22298da3'
O = V / 'V3_sample-846f8c41_20261016'
INFO = O / '00_sample-7a40a511'
INFO.mkdir(exist_ok=True)
rows = []
for f in ['sample-8deba3b0.json', 'sample-82349c7f.json', 'sample-58ae6943.json']:
    rows += json.loads((R / f).read_text('utf8'))['records']
qa = json.loads((R / 'V3sample-250b556e.json').read_text('utf8'))
clip = json.loads((R / 'sample-bc2a1719.json').read_text('utf8'))
assert not qa['errors'] and (not clip['failures'])

def csvout(name, heads, data):
    with (INFO / name).open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f)
        w.writerow(heads)
        w.writerows(data)
csvout('sample-af76b1c6.csv', ['sample-fc147721', 'sample-d44e9b3d', 'sample-399ee693', 'sample-0a2694b2mm', 'sample-59bf5977mm', 'PDFsample-6f05ae5fmm', 'PNGsample-8dd966adpx', 'PNGsample-b1c27820px', 'sample-9dddd9f9PNG', 'sample-d420a41bSVG', 'sample-6320b4a8', 'sample-18a46156', 'sample-cb4ba40b'], [[r['id'], r['name'], r['group'], *r['size_mm'], r['bleed_mm'], *r['pixels'], 'sample-b5141d3d' if r['transparent'] else 'sample-0c70665b', 'sample-b5141d3d' if r['cut'] else 'sample-484d5561', 'sample-041401fa' if r['pending'] else 'sample-3c2cf387', r['relative'], r['note']] for r in rows])
csvout('sample-f4dea550.csv', ['sample-fc147721', 'sample-d44e9b3d', 'sample-b14010a7（sample-3768dba2）'], [[r['id'], r['name'], '\n'.join((html.unescape(t) for t in r['text']))] for r in rows])
csvout('sample-1f38fa39.csv', ['sample-fc147721', 'sample-d44e9b3d', 'sample-a57c204d', 'sample-85c40fcb', 'sample-074da721PPI', 'sample-713e9e6f'], [[r['id'], r['name'], *r['source_pixels'], r['effective_ppi'], 'sample-b5141d3d' if r['whole_real_aircraft'] else 'sample-0c70665b'] for r in qa['raster_physical_resolution']])
names = {str(i).zfill(2): next((r['name'] for r in rows if r['id'] == str(i).zfill(2)), '') for i in range(1, 52)}
names.update({'20': 'sample-d5f5a7a0，sample-26e19062KTsample-714f2cde', '21': 'sample-82b25d52KTsample-714f2cde', '22': 'sample-2a74f423KTsample-714f2cde', '23': 'sample-eed6da5cKTsample-714f2cde', '24': 'FPVsample-e4919ea3KTsample-714f2cde', '25': 'DemoMark FPV CLUB KTsample-714f2cde', '26': 'sample-0effe0d0', '27': 'sample-afcc1920', '29': 'sample-aa12a5a1', '32': 'sample-05d269a2', '33': 'sample-5faa5745Asample-4020e2a8', '34': 'sample-5faa5745Bsample-4020e2a8', '35': 'sample-248aeef4', '36': 'sample-b55bda37', '37': 'sample-61ae8909', '38': 'sample-c4f595fe', '39': 'sample-d0e671e6', '40': 'sample-dc878974', '41': 'sample-8203a4ac', '45': 'sample-3b961321', '46': 'sample-9c926dddPolosample-cec9814c', '47': 'sample-20f9c680', '48': 'sample-c42dfe6e', '49': 'sample-55d89ebc', '50': 'sample-d884f5af'})
aud = []
for i in range(1, 52):
    id = f'{i:02d}'
    status = 'sample-1ba6d7e8'
    change = 'sample-2ffb3192；sample-890a2b46；sample-62909d43'
    if 1 <= i <= 12 or i in [17, 18, 19, 43, 44]:
        change += '；sample-d12f0637，sample-38b3aa21，sample-45aa260f'
    if i in [1, 2, 3, 4, 5, 6, 7, 13, 14, 15, 16, 17, 44]:
        change += '；sample-a1108b482026.10.21—10.25'
    if i in [8, 9, 10, 18, 29, 31, 44, 51]:
        change += '；sample-241ab6b4，sample-ffe30f7a'
    if 20 <= i <= 31 or 45 <= i <= 50:
        change += '；sample-a5a07275，sample-3812e58f'
    if i == 29:
        change += '；sample-0f774d32，sample-6fb1f822'
    if i == 42:
        change += '；sample-9e77085c'
    if i == 43:
        change += '；sample-839a470f: sample-5b8cb96f'
    if i == 51:
        change += '；sample-fc264321'
    if i == 27:
        status = 'sample-f1fbbc82，sample-7043caf1'
        change = 'sample-9fd34eea；sample-f3ddbef2、sample-aa2c8f64、sample-fa205b76；sample-5e06444e，sample-80192f6b'
    if 32 <= i <= 41:
        status = 'sample-bf99f828，sample-7522fe18'
        change = 'sample-31fe174c，sample-2988f9ca、sample-228b4d85；sample-ab95d61eV2sample-39932f24'
    aud.append([id, names[id], status, change])
csvout('sample-109c3c1f51sample-62516fe4.csv', ['sample-9f344565', 'sample-6446454e', 'sample-159c9fa9', 'sample-a29086f3'], aud)
audit = {'date': '2026-10-16', 'artwork_components': 151, 'standard_components': 147, 'pending_gate_reference_components': 4, 'original_items_reviewed': 51, 'original_revised_items': 40, 'unchanged_excluded_items': list(range(32, 42)), 'friendly_designs': 9, 'new_KT_designs': 12, 'new_stickers': 48, 'co_branded_stickers': 12, 'A3_sheets': 3, 'transparent_artwork_components': 108, 'outlined_text_and_brand_elements_checked': clip['checked_elements'], 'text_brand_clipping_findings': 0, 'file_preflight_errors': 0, 'PDFs_rendered': 151, 'PDF_render_failures': 0, 'notes': ['sample-fdb4454a，sample-02a036e7。', '26sample-e698a64614sample-fe953fa2。', 'sample-f56cd93e；sample-4a13e684。', 'sample-6d7d09baPPIsample-e477779a；sample-65a3b38926.5—60PPI，sample-ab5d86b0300PPIsample-dae13d51。', 'sample-d6ed8c38。']}
(INFO / 'sample-c307cbb9.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding='utf8')
(INFO / 'sample-b9dc40d8.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf8')
for name in ['V3sample-250b556e.json', 'sample-bc2a1719.json', 'PDFsample-de1d5dd0PNGsample-b4013cc4.json']:
    shutil.copy2(R / name, INFO / name)
parts = O / '06_sample-39732545/sample-5eb29a9a'
parts.mkdir(exist_ok=True)
for name in ['sample-dca037f7_sample-cd2d576f.png', 'DemoCampus_logosample-d7992255.svg', 'DemoMark_logosample-d7992255.svg', 'DemoBrand_logosample-d7992255.svg', 'DemoClub_logosample-d7992255.svg']:
    shutil.copy2(R / 'sample-a61c86f2_R2sample-9af69965' / name, parts / name)
gen = {}
for p in [R / 'sample-a61c86f2_R2sample-0420d5da.json', ROOT / '_event_work/v3_bg_jobs.json', ROOT / '_event_work/v3_bg_jobs_more.json', ROOT / '_event_work/v3_ip_sources.json']:
    if p.exists():
        gen[p.name] = json.loads(p.read_text('utf8'))
(INFO / 'sample-c1882ff4.json').write_text(json.dumps(gen, ensure_ascii=False, indent=2), encoding='utf8')
manual = '# DemoCampussample-8fbc8444 V3｜sample-7d7573a6\n\nsample-23cb246f: 2026sample-62ef900a10sample-1625179b16sample-85217f7a。sample-0f43733f: 2026sample-62ef900a10sample-1625179b21sample-85217f7a—10sample-1625179b25sample-85217f7a。\n\n## sample-661a37f9\n\n- 151sample-e4fd8a1c: 147sample-1bfb8cf8，4sample-de6a423e；sample-a4461850PDF、SVG、PNG。\n- sample-109c3c1f51sample-a4137600: 40sample-763fbe11；27sample-203366d9、sample-eca78b4a；32—41sample-0818d9a0，sample-3050a952。\n- sample-e15119129sample-f2ee5808（sample-347741a1），sample-0006d696KTsample-714f2cde12sample-f2ee5808，sample-8fc85cd36sample-c35ffc8f；sample-1e1041b748sample-f2ee5808，sample-b6a993c24sample-97b030cc12sample-f2ee5808，ST01—12sample-60117e19DemoClubsample-91fc364b。\n- 48sample-40bef7d93sample-f56a049fA3sample-382b20ac，sample-679b9cda16sample-828ac3fb；sample-a64231dc、sample-1aceb787、sample-7aa6c7c710sample-206f01c8。\n- sample-0effe0d0、sample-f4ce4256、sample-a246957e、sample-69a268b1、sample-8b8e2b81、sample-e6e0a178、sample-9430a4f45sample-1e8575f3、sample-2b8791a03sample-b384555a、sample-37f590fe。\n- sample-44c274921920×1080sample-57a8744b；sample-850c7dcb、sample-b5ad0394、sample-5ea34877、51sample-c527cd32、sample-b5bc754a。\n\n## sample-2a28757b\n\nsample-6b77644fPDFsample-a080f9cb；SVGsample-ed8c44de，sample-351acb85，sample-9ad05b9b。PNGsample-7860088f，sample-e3dd1397。sample-b2075c87PDFsample-332da62bTrimBoxsample-58995f4f3mmsample-497b79c6；PNGsample-335b720bSVGsample-4a5c59bd。\n\nsample-a55c3287“sample-83c5089d”sample-8af2350cSVGsample-d215097a，sample-844b8cc80.2mmsample-a4127d65，sample-107e00fcCutContour。sample-8242c48f；sample-72fa8406，sample-7dbc96f8。sample-7c952901SVGsample-d0a25c25、sample-ed32f5f1；sample-b52c0057，sample-ac44ec2bPDFsample-dccb8597SVGsample-8fec9246。\n\nKTsample-714f2cde、sample-4a4a150a/sample-986f48f0，sample-113f0448；sample-18d6778d。sample-c7d1db03，sample-505d0258。sample-64a9320a60×30mm，sample-56a0416560×12mmsample-ef335f18；sample-5f73c41c、sample-39a0ae1e、sample-fc147721。sample-e43ee774；sample-46e19077。\n\nsample-6eb0610a100%sample-6637ea66。600×400cmsample-fced2ed0PDFsample-6f600407UserUnit=2sample-b47801f1，sample-a92458e5TrimBoxsample-b69f0137；sample-00ee7cb3UserUnit，sample-4bc841236000×4000mmsample-576d81bbSVGsample-fb04addb，sample-c990e0cfPDFsample-0f2cd7c5。\n\nsample-9734ae1cRGBsample-6dbbd157PDF 1.7sample-de1d5dd0PNG/SVG，sample-d1d020c4PDF/Xsample-519fa68b；sample-8f723556。sample-cf107e99。\n\n## sample-64477e9f\n\nsample-41efe82f/sample-ec941291600×900mm；sample-db035f1e600×750mm；sample-f807a7b71600×900mm；sample-fced2ed06000×4000mm；sample-9b1eae1f800×1800mm；sample-91d98262、sample-d4390cbd、sample-2728a6a1、sample-df883956900×600mm。\n\nKTsample-c2040991500×350mm、sample-55f557ec500mm；sample-ed868918800×600mm；sample-0effe0d0600×2400mm；sample-aa12a5a190×130mm；sample-ef335f1860×12mm；sample-f4ce4256100×70mm；sample-a246957e120×60mm；sample-ed121da560×60mm、sample-1e6934bd60mm；sample-3c0ff5ab70mm；sample-e04b05be20×900mm；sample-69eb4170297×210mm。sample-67841019CSV。\n\n## sample-1f530bfc\n\nsample-7e76de82，sample-de290ba6；sample-673c99c5，sample-719a7966。sample-88b8fdb1100×2400mm，sample-d2fcd26750mm；sample-e2e3aa3015mmsample-d0f34b2a，sample-96c14527。sample-8822223d，sample-b1c57d1cGUIDE01sample-59890699；sample-f1a69c69。\n\nsample-ffb0ce8850A/B/Csample-dcc26ba9、sample-1a4ab026、sample-1f86a0ae，50Dsample-7263033e；50E/Fsample-7a146886。sample-be24524d45、46sample-5c229776，sample-e1cbdbb3；sample-864de511。\n\n## sample-861ea680\n\n08sample-fd2b7c54、09sample-fdcd1bd0、10sample-7b50017a、03/04/17sample-0414f928、18sample-116f90f4、31sample-95d799a344sample-872f46d2，sample-0d261383“sample-a61eec24/sample-acd23e57”。sample-c7053faf，sample-1ba9083f、sample-fdcd1bd0、sample-a69fdfae。\n\nsample-a7cefeb03/2/1sample-23f454be10sample-1625179b18/19/20sample-1abe58ec；sample-5826c78b10sample-1625179b21sample-10d8e70225sample-85217f7a。09sample-0ed1b55410/11sample-04b73ce1。sample-5474115b、sample-2a3c7087、sample-cb5eba21。\n\n## sample-f9a7cb11\n\nsample-3ad89c55: sample-e8544a8f，sample-b5ff9d9a；sample-f9a774ce、sample-422c1551。sample-f351a65a，sample-7012accd、sample-4b450a1c。sample-6833b4cb。\n\nsample-dc6e2aaf、sample-fd490571、sample-409d0719、DemoClubsample-0deb56ce，sample-d59c828b。ST01—12sample-4bda4f73。43sample-720f80eb“sample-5b8cb96f”。\n\n## sample-7af061f9\n\nsample-14b69bd6、sample-91fc364b、sample-00537832、sample-707a6993，sample-3dde4214。sample-3f95d14a，sample-698b857ePPIsample-d665e8b0“sample-1f38fa39.csv”；sample-e365450cDPIsample-6982ebac。sample-65a3b38926.5—60PPI，sample-ca80505d85.7PPI、sample-c8b8e85064PPI、sample-479801d6121.1PPI，sample-aa7f267d；sample-87f64542。600×400cmsample-54cd751f。\n\n07sample-54bb469827Rsample-26675f7e，27A/B/Csample-d76b6977、sample-aa2c8f64、sample-742eabad。sample-0922e97f。sample-33dc3afa/sample-9b9a3dfb、sample-ec0bde6b、sample-22c4db09、sample-9bb5c562；sample-0b4cf60c。sample-a1ce7787，sample-37fbfacc147sample-f4bbb2aa。\n\n## sample-c307cbb9\n\n151sample-0066134bPDFsample-cb7f3394，sample-a66c78e6PNGsample-39932f24、PDFsample-3ddd40a6、sample-9dddd9f9alpha、sample-0d84a414；772sample-2677357d/sample-5ee8f39f。sample-8442a08f26sample-2f68493314sample-aeb09b1b。sample-3d20137e。\n\nsample-82b5a3edSHA256sample-2a37bb7b，sample-b96f282d。sample-be50360b，sample-92deb487；sample-833cd2eb。\n\n## sample-c7c0b055\n\n- GEPRCsample-3b15fa5b: https://example.invalid/reference\n- GEPRC MARK5sample-5fe4e25d: https://example.invalid/reference\n- GetFPVsample-318916c1: https://example.invalid/reference\n- FAIsample-12033304: https://example.invalid/reference\n- sample-cf3e1046KTsample-30504e75: https://example.invalid/reference\n- sample-0168d914: https://example.invalid/reference\n- Adobesample-73d822ec: https://example.invalid/reference\n\nsample-7377d839，sample-c8d3085e。sample-f2773c3f“sample-c1882ff4.json”，sample-bf9fbd24，sample-38543cab。\n'
(INFO / 'sample-7d7573a6.md').write_text(manual, encoding='utf8')
(O / 'sample-79f03058.txt').write_text('DemoCampussample-8fbc8444 V3｜2026-10-16\n\n1. sample-c771248e 00_V3sample-be8e4e25.html sample-a8c81f93Allsample-53b9b5a9。\n2. sample-d7666ed7PDF，sample-ae436232_sample-83c5089d.svg。\n3. sample-13ec30c4、sample-497b79c6、sample-a98f9b4c、sample-e60cf48100_sample-7a40a511。\n4. 07_sample-eb457a0d_sample-fcd89de8 sample-0baa56d0，sample-ad801d7d。\n5. sample-50b5b1d2、sample-7b50017a、sample-fdcd1bd0、sample-afabc055，sample-8de711ab。\n6. sample-afd8c252、sample-0006d696、sample-6b204557；V2sample-8af2350c32—41sample-bee0e55b。\n', encoding='utf8')
print('delivery data ready', len(rows))
