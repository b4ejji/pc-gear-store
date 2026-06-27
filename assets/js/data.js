// PC GEAR STORE - DATA

const DEFAULT_PRODUCTS = [
  // CPU
  {
    id: 1, name: 'Intel Core i5-14400F', category: 'CPU', brand: 'Intel',
    price: 3000000, oldPrice: 3490000, image: 'assets/img/cpu.svg',
    badge: 'bestseller', badgeText: 'Best Seller',
    spec: '10 nh�n 16 lu?ng, LGA1700, Gaming ?n �p',
    desc: 'CPU qu?c d�n cho c?u h�nh gaming t?m trung, hi?u nang m?nh, d? build v?i main B760. H? tr? DDR4/DDR5 t�y mainboard.',
    stock: 18, rating: 4.8, reviews: 156,
    specs: { 'Socket': 'LGA1700', 'S? nh�n': '10 (6P+4E)', 'S? lu?ng': '16', 'Base Clock': '2.5 GHz', 'Boost Clock': '4.7 GHz', 'Cache': '20MB L3', 'TDP': '65W', 'Ki?n tr�c': 'Raptor Lake Refresh' },
    images: ['assets/img/cpu.svg']
  },
  {
    id: 2, name: 'AMD Ryzen 5 7500F', category: 'CPU', brand: 'AMD',
    price: 3890000, oldPrice: 4290000, image: 'assets/img/cpu.svg',
    badge: 'hot', badgeText: 'Hot',
    spec: '6 nh�n 12 lu?ng, AM5, DDR5',
    desc: 'L?a ch?n d?p cho n?n t?ng AM5, c�n t?t game eSports v� AAA khi di c�ng VGA r?i. Ti?t ki?m di?n, ch?y m�t.',
    stock: 12, rating: 4.6, reviews: 89,
    specs: { 'Socket': 'AM5', 'S? nh�n': '6', 'S? lu?ng': '12', 'Base Clock': '3.7 GHz', 'Boost Clock': '5.0 GHz', 'Cache': '32MB L3', 'TDP': '65W', 'Ki?n tr�c': 'Zen 4' },
    images: ['assets/img/cpu.svg']
  },
  {
    id: 3, name: 'Intel Core i7-14700KF', category: 'CPU', brand: 'Intel',
    price: 8290000, oldPrice: 9490000, image: 'assets/img/cpu.svg',
    badge: 'sale', badgeText: '-13%',
    spec: '20 nh�n 28 lu?ng, LGA1700, Unlocked',
    desc: 'CPU cao c?p cho gaming v� workstation. Hi?u nang da nhi?m vu?t tr?i, h? tr? overclock.',
    stock: 6, rating: 4.9, reviews: 203,
    specs: { 'Socket': 'LGA1700', 'S? nh�n': '20 (8P+12E)', 'S? lu?ng': '28', 'Base Clock': '3.4 GHz', 'Boost Clock': '5.6 GHz', 'Cache': '33MB L3', 'TDP': '125W', 'Ki?n tr�c': 'Raptor Lake Refresh' },
    images: ['assets/img/cpu.svg']
  },

  // GPU
  {
    id: 4, name: 'ASUS TUF RTX 5060 Ti 16GB', category: 'GPU', brand: 'ASUS',
    price: 12500000, oldPrice: 13200000, image: 'assets/img/gpu.svg',
    badge: 'new', badgeText: 'M?i',
    spec: '16GB GDDR7, 3 fan, Ray Tracing',
    desc: 'Card d? h?a d�nh cho gaming 2K, render nh? v� build PC hi?u nang cao. T?n nhi?t 3 fan si�u m�t.',
    stock: 8, rating: 4.7, reviews: 67,
    specs: { 'GPU': 'NVIDIA RTX 5060 Ti', 'VRAM': '16GB GDDR7', 'Bus': '128-bit', 'Boost Clock': '2535 MHz', 'Ray Tracing': 'C�', 'DLSS': '4.0', 'TDP': '150W', 'C?ng': '1x HDMI 2.1, 3x DP 2.1' },
    images: ['assets/img/gpu.svg']
  },
  {
    id: 5, name: 'MSI Gaming X RTX 4070 Super 12GB', category: 'GPU', brand: 'MSI',
    price: 15900000, oldPrice: 17200000, image: 'assets/img/gpu.svg',
    badge: 'sale', badgeText: '-8%',
    spec: '12GB GDDR6X, 2 fan, DLSS 3',
    desc: 'Card d? h?a m?nh cho gaming 2K-4K, streaming v� l�m vi?c d? h?a chuy�n nghi?p.',
    stock: 5, rating: 4.8, reviews: 112,
    specs: { 'GPU': 'NVIDIA RTX 4070 Super', 'VRAM': '12GB GDDR6X', 'Bus': '192-bit', 'Boost Clock': '2505 MHz', 'Ray Tracing': 'C�', 'DLSS': '3.0', 'TDP': '220W', 'C?ng': '1x HDMI 2.1, 3x DP 1.4a' },
    images: ['assets/img/gpu.svg']
  },

  // Mainboard
  {
    id: 6, name: 'MSI B760M Gaming WiFi DDR5', category: 'Mainboard', brand: 'MSI',
    price: 2890000, oldPrice: 3290000, image: 'assets/img/mainboard.svg',
    badge: 'bestseller', badgeText: 'Best Seller',
    spec: 'LGA1700, DDR5, m-ATX, WiFi 6E',
    desc: 'Mainboard g?n d?p cho case m-ATX, c� WiFi 6E, d? khe M.2 v� c?ng k?t n?i co b?n.',
    stock: 15, rating: 4.5, reviews: 78,
    specs: { 'Socket': 'LGA1700', 'Chipset': 'B760', 'Form Factor': 'm-ATX', 'RAM': '2x DDR5 (max 128GB)', 'M.2': '2 khe', 'WiFi': '6E', 'USB': '6x USB 3.2', 'Audio': 'Realtek ALC897' },
    images: ['assets/img/mainboard.svg']
  },
  {
    id: 7, name: 'Gigabyte B650 AORUS Elite AX V2', category: 'Mainboard', brand: 'Gigabyte',
    price: 4190000, oldPrice: 4690000, image: 'assets/img/mainboard.svg',
    badge: 'hot', badgeText: 'Hot',
    spec: 'AM5, DDR5, ATX, WiFi 6E',
    desc: 'Mainboard AM5 cao c?p t?m trung, VRM m?nh, h? tr? PCIe 5.0 cho SSD.',
    stock: 10, rating: 4.6, reviews: 54,
    specs: { 'Socket': 'AM5', 'Chipset': 'B650', 'Form Factor': 'ATX', 'RAM': '4x DDR5 (max 192GB)', 'M.2': '3 khe (1x PCIe 5.0)', 'WiFi': '6E', 'USB': '8x USB 3.2', 'Audio': 'Realtek ALC1220' },
    images: ['assets/img/mainboard.svg']
  },

  // RAM
  {
    id: 8, name: 'G.Skill Ripjaws S5 16GB DDR5 6000MHz', category: 'RAM', brand: 'G.Skill',
    price: 1176000, oldPrice: 1350000, image: 'assets/img/ram.svg',
    badge: 'sale', badgeText: '-13%',
    spec: '16GB, 6000MHz, CL30, Low profile',
    desc: 'Thanh RAM DDR5 t?c d? cao, low-profile d? l?p v?i t?n kh� l?n. XMP 3.0.',
    stock: 30, rating: 4.7, reviews: 132,
    specs: { 'Dung lu?ng': '16GB (1x16GB)', 'Lo?i': 'DDR5', 'T?c d?': '6000 MHz', 'CAS Latency': 'CL30', '�i?n �p': '1.35V', 'XMP': '3.0', 'Heatsink': 'C�', 'Chi?u cao': '33mm' },
    images: ['assets/img/ram.svg']
  },
  {
    id: 9, name: 'Kingston Fury Beast 32GB (2x16) DDR5 5600', category: 'RAM', brand: 'Kingston',
    price: 2190000, oldPrice: 2590000, image: 'assets/img/ram.svg',
    badge: 'bestseller', badgeText: 'Best Seller',
    spec: '32GB Kit, 5600MHz, CL36',
    desc: 'Kit RAM 32GB DDR5 cho build gaming v� workstation, tuong th�ch t?t Intel & AMD.',
    stock: 20, rating: 4.6, reviews: 95,
    specs: { 'Dung lu?ng': '32GB (2x16GB)', 'Lo?i': 'DDR5', 'T?c d?': '5600 MHz', 'CAS Latency': 'CL36', '�i?n �p': '1.25V', 'XMP': '3.0', 'Heatsink': 'C�', 'Chi?u cao': '34.9mm' },
    images: ['assets/img/ram.svg']
  },

  // SSD
  {
    id: 10, name: 'Lexar NM790 1TB Gen4', category: 'SSD', brand: 'Lexar',
    price: 1889000, oldPrice: 2190000, image: 'assets/img/ssd.svg',
    badge: 'hot', badgeText: 'Hot',
    spec: '1TB, PCIe 4.0, 7400MB/s Read',
    desc: 'SSD Gen4 t?c d? d?c 7400MB/s, load Windows, game v� project c?c nhanh.',
    stock: 22, rating: 4.8, reviews: 178,
    specs: { 'Dung lu?ng': '1TB', 'Interface': 'PCIe Gen4 x4 NVMe', 'Form Factor': 'M.2 2280', '�?c': '7400 MB/s', 'Ghi': '6500 MB/s', 'IOPS d?c': '1,000K', 'IOPS ghi': '900K', 'TBW': '800TB' },
    images: ['assets/img/ssd.svg']
  },
  {
    id: 11, name: 'Samsung 990 Pro 2TB Gen4', category: 'SSD', brand: 'Samsung',
    price: 4290000, oldPrice: 4990000, image: 'assets/img/ssd.svg',
    badge: 'sale', badgeText: '-14%',
    spec: '2TB, PCIe 4.0, 7450MB/s Read',
    desc: 'SSD flagship c?a Samsung, hi?u nang d?nh cao cho gaming v� c�ng vi?c chuy�n nghi?p.',
    stock: 9, rating: 4.9, reviews: 234,
    specs: { 'Dung lu?ng': '2TB', 'Interface': 'PCIe Gen4 x4 NVMe', 'Form Factor': 'M.2 2280', '�?c': '7450 MB/s', 'Ghi': '6900 MB/s', 'IOPS d?c': '1,400K', 'IOPS ghi': '1,550K', 'TBW': '1200TB' },
    images: ['assets/img/ssd.svg']
  },

  // PSU
  {
    id: 12, name: 'MSI MAG A750BN 750W Bronze', category: 'PSU', brand: 'MSI',
    price: 1490000, oldPrice: 1690000, image: 'assets/img/psu.svg',
    badge: 'bestseller', badgeText: 'Best Seller',
    spec: '750W, 80 Plus Bronze, ATX',
    desc: 'Ngu?n 750W ?n d?nh cho c?u h�nh t?m trung t?i c?n cao c?p. B?o h�nh 5 nam.',
    stock: 16, rating: 4.5, reviews: 62,
    specs: { 'C�ng su?t': '750W', 'Chu?n': '80 Plus Bronze', 'Form Factor': 'ATX', 'Modular': 'Non-modular', 'Fan': '120mm', 'B?o v?': 'OVP/OPP/SCP/OTP', 'C?ng PCIe': '2x 8-pin', 'B?o h�nh': '5 nam' },
    images: ['assets/img/psu.svg']
  },
  {
    id: 13, name: 'Corsair RM850x 850W Gold', category: 'PSU', brand: 'Corsair',
    price: 2990000, oldPrice: 3490000, image: 'assets/img/psu.svg',
    badge: 'new', badgeText: 'M?i',
    spec: '850W, 80 Plus Gold, Full Modular',
    desc: 'Ngu?n cao c?p full modular, ch?y si�u �m v?i ch? d? Zero RPM. L� tu?ng cho RTX 40/50 series.',
    stock: 11, rating: 4.9, reviews: 145,
    specs: { 'C�ng su?t': '850W', 'Chu?n': '80 Plus Gold', 'Form Factor': 'ATX', 'Modular': 'Full Modular', 'Fan': '135mm (Zero RPM)', 'B?o v?': 'OVP/OPP/SCP/OTP/UVP', 'C?ng PCIe': '4x 8-pin + 12VHPWR', 'B?o h�nh': '10 nam' },
    images: ['assets/img/psu.svg']
  },

  // Case
  {
    id: 14, name: 'Xigmatek Ocean RGB', category: 'Case', brand: 'Xigmatek',
    price: 700000, oldPrice: 850000, image: 'assets/img/case.svg',
    badge: 'sale', badgeText: '-18%',
    spec: 'm-ATX, M?t k�nh, 3 fan ARGB',
    desc: 'Case gi� t?t nh?t ph�n kh�c, thi?t k? hi?n d?i, k�m 3 fan ARGB s?n.',
    stock: 20, rating: 4.3, reviews: 87,
    specs: { 'Form Factor': 'm-ATX / ITX', 'Ch?t li?u': 'Th�p + K�nh cu?ng l?c', 'Khe fan': '6 x 120mm', 'Fan k�m': '3 x 120mm ARGB', 'Khe HDD': '2', 'Khe SSD': '2', 'GPU t?i da': '330mm', 'CPU Cooler': '160mm' },
    images: ['assets/img/case.svg']
  },

  // Cooling
  {
    id: 15, name: 'Jonsbo CR1000 EVO ARGB', category: 'Cooling', brand: 'Jonsbo',
    price: 290000, oldPrice: 390000, image: 'assets/img/cooler.svg',
    badge: 'sale', badgeText: '-26%',
    spec: 'Tower cooler, 4 heatpipe, ARGB',
    desc: 'T?n kh� nh? g?n, d?p, d? d�ng cho CPU ph? th�ng. LED ARGB d?ng b? mainboard.',
    stock: 25, rating: 4.4, reviews: 56,
    specs: { 'Lo?i': 'Tower Air Cooler', 'Heatpipe': '4 ?ng d?ng', 'Fan': '1 x 120mm ARGB', 'RPM': '800-1800', 'Ti?ng ?n': '=26dBA', 'TDP h? tr?': '165W', 'Chi?u cao': '155mm', 'Socket': 'LGA1700/AM5/AM4' },
    images: ['assets/img/cooler.svg']
  },
  {
    id: 16, name: 'DeepCool AK620 Digital', category: 'Cooling', brand: 'DeepCool',
    price: 1490000, oldPrice: 1690000, image: 'assets/img/cooler.svg',
    badge: 'hot', badgeText: 'Hot',
    spec: 'Dual tower, 6 heatpipe, M�n h�nh LED',
    desc: 'T?n kh� dual tower cao c?p v?i m�n h�nh LED hi?n th? nhi?t d? CPU realtime.',
    stock: 14, rating: 4.8, reviews: 98,
    specs: { 'Lo?i': 'Dual Tower Air Cooler', 'Heatpipe': '6 ?ng d?ng', 'Fan': '2 x 120mm FK120', 'RPM': '500-1850', 'Ti?ng ?n': '=28dBA', 'TDP h? tr?': '260W', 'Chi?u cao': '160mm', 'M�n h�nh': 'LED hi?n th? nhi?t d?' },
    images: ['assets/img/cooler.svg']
  },

  // Monitor
  {
    id: 17, name: 'LG 27GP850-B 27" 2K 165Hz', category: 'Monitor', brand: 'LG',
    price: 7990000, oldPrice: 8990000, image: 'assets/img/monitor.svg',
    badge: 'hot', badgeText: 'Hot',
    spec: '27" IPS Nano, 2K, 165Hz, 1ms',
    desc: 'M�n h�nh gaming 2K IPS Nano, t?c d? ph?n h?i 1ms, HDR400. Chu?n cho game th?.',
    stock: 7, rating: 4.7, reviews: 134,
    specs: { 'K�ch thu?c': '27 inch', '�? ph�n gi?i': '2560x1440 (2K)', 'T?m n?n': 'IPS Nano', 'T?n s?': '165Hz (OC 180Hz)', 'Th?i gian PH': '1ms GtG', 'HDR': 'HDR400', 'C?ng': '1x HDMI 2.0, 1x DP 1.4, 2x USB 3.0', 'FreeSync/G-Sync': 'G-Sync Compatible' },
    images: ['assets/img/monitor.svg']
  },
  {
    id: 18, name: 'Kuycon P27L 27" 4K IPS 60Hz', category: 'Monitor', brand: 'Kuycon',
    price: 6300000, oldPrice: 6900000, image: 'assets/img/monitor.svg',
    badge: 'new', badgeText: 'M?i',
    spec: '27" 4K IPS, 60Hz, 99% sRGB',
    desc: 'M�n h�nh 4K s?c n�t cho d? h?a, thi?t k? v� xem phim. T?m n?n IPS g�c nh�n r?ng.',
    stock: 5, rating: 4.5, reviews: 42,
    specs: { 'K�ch thu?c': '27 inch', '�? ph�n gi?i': '3840x2160 (4K)', 'T?m n?n': 'IPS', 'T?n s?': '60Hz', 'Th?i gian PH': '5ms', 'M�u s?c': '99% sRGB, 95% DCI-P3', 'C?ng': '1x HDMI 2.0, 1x DP 1.2, USB-C', 'Ch�n d?': 'Xoay, nghi�ng, n�ng h?' },
    images: ['assets/img/monitor.svg']
  },

  // Mouse
  {
    id: 19, name: 'Logitech G Pro X Superlight 2', category: 'Mouse', brand: 'Logitech',
    price: 2890000, oldPrice: 3290000, image: 'assets/img/mouse.svg',
    badge: 'bestseller', badgeText: 'Best Seller',
    spec: 'Wireless, 60g, 32K DPI, 95h pin',
    desc: 'Chu?t gaming kh�ng d�y nh? nh?t th? gi?i, sensor HERO 2 32K. L?a ch?n c?a pro players.',
    stock: 13, rating: 4.9, reviews: 267,
    specs: { 'K?t n?i': 'Wireless (LIGHTSPEED)', 'Sensor': 'HERO 2 (32K DPI)', 'Tr?ng lu?ng': '60g', 'Polling Rate': '2000 Hz (4K optional)', 'Pin': '95 gi?', 'N�t': '5 n�t', 'Switch': 'LIGHTFORCE Hybrid', 'Grip': 'Claw / Fingertip' },
    images: ['assets/img/mouse.svg']
  },
  {
    id: 20, name: 'Razer Viper V3 Pro', category: 'Mouse', brand: 'Razer',
    price: 3490000, oldPrice: 3890000, image: 'assets/img/mouse.svg',
    badge: 'new', badgeText: 'M?i',
    spec: 'Wireless, 54g, 35K DPI, 8K Hz',
    desc: 'Chu?t eSports d?nh cao v?i polling rate 8000Hz, si�u nh? 54g.',
    stock: 8, rating: 4.8, reviews: 89,
    specs: { 'K?t n?i': 'Wireless (HyperSpeed)', 'Sensor': 'Focus Pro 35K Gen-2', 'Tr?ng lu?ng': '54g', 'Polling Rate': '8000 Hz', 'Pin': '90 gi?', 'N�t': '6 n�t', 'Switch': 'Gen-3 Optical', 'Grip': 'Claw / Fingertip' },
    images: ['assets/img/mouse.svg']
  },

  // Keyboard
  {
    id: 21, name: 'Akko 5075B Plus V2', category: 'Keyboard', brand: 'Akko',
    price: 1390000, oldPrice: 1590000, image: 'assets/img/keyboard.svg',
    badge: 'bestseller', badgeText: 'Best Seller',
    spec: '75% Wireless, Hot-swap, Gasket Mount',
    desc: 'B�n ph�m co 75% wireless, gasket mount �m �i. Hot-swap switch d? d�ng t�y bi?n.',
    stock: 19, rating: 4.6, reviews: 156,
    specs: { 'Layout': '75% (82 ph�m)', 'K?t n?i': 'Bluetooth 5.0 / 2.4G / USB-C', 'Switch': 'Cream Yellow V3 (Linear)', 'Mounting': 'Gasket Mount', 'Hot-swap': 'C� (5-pin)', 'Keycap': 'PBT Double-shot', 'Pin': '3000mAh (100h)', 'Foam': 'IXPE + PE Foam' },
    images: ['assets/img/keyboard.svg']
  },
  {
    id: 22, name: 'Razer BlackWidow V4 75%', category: 'Keyboard', brand: 'Razer',
    price: 3690000, oldPrice: 3990000, image: 'assets/img/keyboard.svg',
    badge: 'new', badgeText: 'M?i',
    spec: '75% Razer Switch, RGB, Hot-swap',
    desc: 'B�n ph�m gaming cao c?p v?i switch Razer Orange V4, �m thanh thock d?c trung.',
    stock: 7, rating: 4.7, reviews: 45,
    specs: { 'Layout': '75% (84 ph�m)', 'K?t n?i': 'USB-C', 'Switch': 'Razer Orange Tactile V4', 'Mounting': 'Gasket', 'Hot-swap': 'C�', 'Keycap': 'PBT Double-shot', 'Backlight': 'Razer Chroma RGB', '�?c bi?t': 'Knob xoay + Media keys' },
    images: ['assets/img/keyboard.svg']
  },

  // Headset
  {
    id: 23, name: 'HyperX Cloud III Wireless', category: 'Headset', brand: 'HyperX',
    price: 2790000, oldPrice: 3190000, image: 'assets/img/headset.svg',
    badge: 'hot', badgeText: 'Hot',
    spec: 'Wireless, DTS Headphone:X, 120h pin',
    desc: 'Tai nghe gaming kh�ng d�y v?i DTS Headphone:X Spatial Audio, pin 120h si�u tr�u.',
    stock: 11, rating: 4.7, reviews: 98,
    specs: { 'K?t n?i': 'Wireless 2.4GHz / 3.5mm', 'Driver': '53mm Angled', 'T?n s?': '10Hz - 21kHz', 'Tr? kh�ng': '64O', 'Microphone': 'Detachable (th�o r?i)', '�m thanh': 'DTS Headphone:X', 'Pin': '120 gi?', 'Tr?ng lu?ng': '330g' },
    images: ['assets/img/headset.svg']
  },
  {
    id: 24, name: 'SteelSeries Arctis Nova Pro', category: 'Headset', brand: 'SteelSeries',
    price: 5490000, oldPrice: 5990000, image: 'assets/img/headset.svg',
    badge: 'sale', badgeText: '-8%',
    spec: 'Wireless, ANC, Hi-Res, Dual Battery',
    desc: 'Tai nghe gaming flagship v?i ANC ch? d?ng, �m thanh Hi-Res. H? th?ng pin d�i hot-swap.',
    stock: 4, rating: 4.9, reviews: 156,
    specs: { 'K?t n?i': 'Wireless 2.4GHz / Bluetooth 5.0', 'Driver': '40mm Premium', 'T?n s?': '10Hz - 40kHz (Hi-Res)', 'ANC': 'C� (4 mic)', 'Microphone': 'ClearCast Gen 2 (thu r�t)', 'DAC': 'GameDAC Gen 2', 'Pin': 'Dual Battery Hot-swap (22h/pin)', 'Tr?ng lu?ng': '338g' },
    images: ['assets/img/headset.svg']
  }
];

// Blog posts
const BLOG_POSTS = [
  {
    id: 1, title: 'Hu?ng d?n build PC Gaming 15 tri?u chi?n mu?t m?i game 2025',
    excerpt: 'C?u h�nh PC gaming 15 tri?u v?i CPU Intel i5-14400F, RTX 5060 Ti 16GB, 16GB DDR5 RAM. C�n mu?t m?i t?a game eSports v� AAA ? 2K.',
    category: 'Build PC', author: 'PC Gear', date: '2026-06-10', readTime: '8 ph�t', image: 'assets/img/gpu.svg'
  },
  {
    id: 2, title: 'So s�nh Intel vs AMD 2026: N�n ch?n CPU n�o cho gaming?',
    excerpt: 'Ph�n t�ch chi ti?t hi?u nang, gi� c? v� t�nh nang gi?a Intel Core 14th Gen v� AMD Ryzen 7000 series. ��u l� l?a ch?n t?i uu?',
    category: '��nh gi�', author: 'PC Gear', date: '2026-06-08', readTime: '12 ph�t', image: 'assets/img/cpu.svg'
  },
  {
    id: 3, title: 'Top 5 SSD NVMe Gen4 d�ng mua nh?t 2026',
    excerpt: 'Danh s�ch SSD NVMe Gen4 c� hi?u nang t?t nh?t trong t?m gi�. T? budget d?n flagship, d?u c� l?a ch?n ph� h?p.',
    category: 'Top List', author: 'PC Gear', date: '2026-06-05', readTime: '6 ph�t', image: 'assets/img/ssd.svg'
  },
  {
    id: 4, title: 'C�ch ch?n ngu?n PSU ph� h?p cho PC gaming',
    excerpt: 'Hu?ng d?n t�nh c�ng su?t ngu?n c?n thi?t, gi?i th�ch 80 Plus Bronze/Gold/Platinum, v� top ngu?n t?t nh?t theo t?ng m?c gi�.',
    category: 'Hu?ng d?n', author: 'PC Gear', date: '2026-06-02', readTime: '10 ph�t', image: 'assets/img/psu.svg'
  },
  {
    id: 5, title: 'B�n ph�m co 2026: Gasket Mount vs Plate Mount kh�c g�?',
    excerpt: 'T�m hi?u s? kh�c bi?t gi?a Gasket Mount v� Plate Mount, c�ng uu nhu?c di?m c?a t?ng lo?i d? ch?n b�n ph�m ph� h?p.',
    category: 'Ki?n th?c', author: 'PC Gear', date: '2026-05-28', readTime: '7 ph�t', image: 'assets/img/mainboard.svg'
  },
  {
    id: 6, title: 'RTX 5060 Ti Review: Card d? h?a gaming 2K t?t nh?t?',
    excerpt: '��nh gi� chi ti?t NVIDIA RTX 5060 Ti v?i benchmark trong 20+ game, so s�nh v?i RTX 4060 Ti v� RX 7700 XT.',
    category: '��nh gi�', author: 'PC Gear', date: '2026-05-25', readTime: '15 ph�t', image: 'assets/img/gpu.svg'
  }
];

// Category metadata - use Font Awesome class names instead of emoji
const CATEGORIES = [
  { key: 'CPU', label: 'B? x? l�', icon: 'fa-microchip' },
  { key: 'GPU', label: 'Card d? h?a', icon: 'fa-display' },
  { key: 'Mainboard', label: 'Bo m?ch ch?', icon: 'fa-server' },
  { key: 'RAM', label: 'B? nh? RAM', icon: 'fa-memory' },
  { key: 'SSD', label: '? c?ng SSD', icon: 'fa-hard-drive' },
  { key: 'PSU', label: 'Ngu?n m�y t�nh', icon: 'fa-bolt' },
  { key: 'Case', label: 'V? m�y t�nh', icon: 'fa-computer' },
  { key: 'Cooling', label: 'T?n nhi?t', icon: 'fa-fan' },
  { key: 'Monitor', label: 'M�n h�nh', icon: 'fa-tv' },
  { key: 'Mouse', label: 'Chu?t gaming', icon: 'fa-computer-mouse' },
  { key: 'Keyboard', label: 'B�n ph�m co', icon: 'fa-keyboard' },
  { key: 'Headset', label: 'Tai nghe', icon: 'fa-headphones' }
];

const BRANDS = ['Intel', 'AMD', 'NVIDIA', 'ASUS', 'MSI', 'Gigabyte', 'Corsair', 'G.Skill', 'Kingston', 'Samsung', 'Lexar', 'Logitech', 'Razer', 'HyperX', 'SteelSeries', 'Akko', 'DeepCool', 'Jonsbo', 'Xigmatek', 'LG', 'Kuycon'];

const COUPONS = [
  {
    code: 'PCGEAR10',
    discountPercent: 10,
    minOrderValue: 5000000,
    maxDiscount: 2000000,
    isActive: true
  }
];

const STORAGE_KEYS = {
  products: 'pcgear_products',
  cart: 'pcgear_cart',
  wishlist: 'pcgear_wishlist',
  wishlistGuest: 'pcgear_wishlist_guest',
  coupon: 'pcgear_coupon',
  session: 'pcgear_session',
  user: 'pcgear_user'
};

const ApiClient = {
  baseUrl: 'backend',

  enabled() {
    return Boolean(this.baseUrl) && /^https?:$/.test(window.location.protocol);
  },

  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

    const response = await fetch(`${this.baseUrl}${path}`, {
      headers,
      credentials: 'same-origin',
      ...options
    });

    if (!response.ok) {
      let message = `API ${response.status}: ${response.statusText}`;
      try {
        const error = await response.json();
        if (error?.message) message = error.message;
      } catch { }
      throw new Error(message);
    }

    return response.status === 204 ? null : response.json();
  },

  async bootstrap() {
    if (!this.enabled()) return;
    try {
      const products = await this.request('/products/list.php?per_page=50');
      ApiState.products = products.data || [];
    } catch (error) {
      console.warn('Backend API unavailable, using local fallback.', error);
    }
  }
};

const ApiState = {
  products: null,
  ready: null
};

function mapBlogPostFromApi(post) {
  return {
    id: Number(post.id),
    title: post.title,
    excerpt: post.excerpt || '',
    category: post.category,
    author: 'PC Gear',
    date: String(post.published_at || post.created_at || '').slice(0, 10),
    readTime: post.read_time ? `${post.read_time} ph�t` : '5 ph�t',
    image: post.image || 'assets/img/gpu.svg'
  };
}

function whenDomReady() {
  if (document.readyState !== 'loading') return Promise.resolve();
  return new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
}

function onAppReady(callback) {
  if (!ApiState.ready) {
    ApiState.ready = Promise.all([whenDomReady(), ApiClient.bootstrap()]);
  }
  ApiState.ready.then(callback).catch(error => {
    console.error(error);
    callback();
  });
}

// --- LocalStorage helpers ---

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : cloneData(fallback);
  } catch {
    localStorage.removeItem(key);
    return cloneData(fallback);
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getProducts() {
  if (Array.isArray(ApiState.products)) {
    return cloneData(ApiState.products);
  }

  const saved = localStorage.getItem(STORAGE_KEYS.products);
  if (!saved) {
    writeStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
    return cloneData(DEFAULT_PRODUCTS);
  }
  try {
    const parsed = JSON.parse(saved);
    if (parsed.length === 0 || !parsed[0].specs || !parsed[0].desc) {
      writeStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
      return cloneData(DEFAULT_PRODUCTS);
    }
    return parsed;
  }
  catch { writeStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS); return cloneData(DEFAULT_PRODUCTS); }
}

function saveProducts(products) {
  ApiState.products = cloneData(products);
  writeStorage(STORAGE_KEYS.products, products);
}

function getAuthSession() {
  return localStorage.getItem(STORAGE_KEYS.session);
}

function getCurrentUser() {
  return readStorage(STORAGE_KEYS.user, null);
}

function saveAuthSession({ user }) {
  if (user) localStorage.setItem(STORAGE_KEYS.session, '1');
  if (user) writeStorage(STORAGE_KEYS.user, user);
}

function clearAuthSession() {
  if (ApiClient.enabled()) {
    ApiClient.request('/auth/logout.php', { method: 'POST' }).catch(error => {
      console.warn('Logout failed.', error);
    });
  }
  localStorage.removeItem(STORAGE_KEYS.session);
  localStorage.removeItem(STORAGE_KEYS.user);
}

function getWishlistStorageKey(user = getCurrentUser()) {
  return user?.id ? `${STORAGE_KEYS.wishlist}_user_${user.id}` : STORAGE_KEYS.wishlistGuest;
}

function logoutUser(redirect = 'index.html') {
  clearAuthSession();
  showToast('�� dang xu?t');
  setTimeout(() => { window.location.href = redirect; }, 500);
}

async function loginUser(email, password) {
  const session = await ApiClient.request('/auth/login.php', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  saveAuthSession(session);
  return session.user;
}

async function registerUser(payload) {
  const session = await ApiClient.request('/auth/login.php?action=register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  saveAuthSession(session);
  return session.user;
}

async function saveProductToApi(product, id = null) {
  if (!ApiClient.enabled()) return product;

  const response = await ApiClient.request(id ? `/products/edit.php?id=${id}` : '/products/add.php', {
    method: 'POST',
    body: JSON.stringify(product)
  });
  ApiState.products = null;
  await ApiClient.bootstrap();
  return response.data;
}

async function deleteProductFromApi(id) {
  if (!ApiClient.enabled()) return;

  await ApiClient.request(`/products/delete.php?id=${id}`, { method: 'POST' });
  ApiState.products = null;
  await ApiClient.bootstrap();
}

function money(value) {
  return new Intl.NumberFormat('vi-VN').format(value) + '?';
}

function getDiscount(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

function getBadgeText(product) {
  const raw = String(product?.badgeText || product?.badge || '').trim();
  const key = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (key === 'moi' || key === 'new') return 'M?I';
  if (key === 'hot') return 'HOT';
  if (key === 'best seller' || key === 'bestseller') return 'BEST SELLER';
  if (key === 'giam gia' || key === 'sale') return 'GI?M GI�';
  return raw || 'M?I';
}

function getCart() {
  return readStorage(STORAGE_KEYS.cart, [])
    .filter(item => Number(item.id) > 0)
    .map(item => ({ id: Number(item.id), qty: Math.max(1, Number(item.qty) || 1) }));
}

function saveCart(cart) {
  writeStorage(STORAGE_KEYS.cart, cart);
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.qty, 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = count);
}

async function addToCart(id, qty = 1) {
  const productId = Number(id);
  const product = getProducts().find(item => item.id === productId);
  if (!product) {
    showToast('<i class="fa-solid fa-circle-xmark"></i> S?n ph?m kh�ng t?n t?i');
    return;
  }

  const stock = Number(product.stock) || 0;
  if (stock <= 0) {
    showToast('<i class="fa-solid fa-circle-xmark"></i> S?n ph?m d� h?t h�ng');
    return;
  }

  const cart = getCart();
  const addQty = Math.max(1, Number(qty) || 1);
  const found = cart.find(item => item.id === productId);
  if (found) { found.qty = Math.min(stock, found.qty + addQty); }
  else { cart.push({ id: productId, qty: Math.min(stock, addQty) }); }
  saveCart(cart);
  syncCartItemToApi(productId, cart.find(item => item.id === productId)?.qty || addQty);
  showToast('�� th�m v�o gi? h�ng');
}

async function syncCartItemToApi(productId, quantity) {
  if (!ApiClient.enabled() || !getAuthSession()) return;

  try {
    await ApiClient.request('/cart/add.php', {
      method: 'POST',
      body: JSON.stringify({ product_id: Number(productId), quantity: Number(quantity) })
    });
  } catch (error) {
    console.warn('Cart sync failed.', error);
  }
}

async function removeCartItemFromApi(productId) {
  if (!ApiClient.enabled() || !getAuthSession()) return;

  try {
    await ApiClient.request(`/cart/remove.php?id=${productId}`, { method: 'POST' });
  } catch (error) {
    console.warn('Cart remove sync failed.', error);
  }
}

async function clearCartFromApi() {
  if (!ApiClient.enabled() || !getAuthSession()) return;

  try {
    await ApiClient.request('/cart/remove.php?all=1', { method: 'POST' });
  } catch (error) {
    console.warn('Cart clear sync failed.', error);
  }
}

// Wishlist
function normalizeIdList(list) {
  return [...new Set((Array.isArray(list) ? list : []).map(Number).filter(Boolean))];
}

function getWishlist() {
  return normalizeIdList(readStorage(getWishlistStorageKey(), []));
}

function saveWishlist(list) {
  writeStorage(getWishlistStorageKey(), normalizeIdList(list));
  updateWishlistCount();
}

async function loadWishlistFromApi() {
  return getWishlist();
}

function isInWishlist(id) {
  return getWishlist().includes(Number(id));
}

function updateWishlistCount() {
  const count = getWishlist().length;
  document.querySelectorAll('[data-wishlist-count]').forEach(el => el.textContent = count);
}

function getCouponByCode(code) {
  const normalized = String(code || '').trim().toUpperCase();
  return COUPONS.find(coupon => coupon.code === normalized && coupon.isActive) || null;
}

function getActiveCoupon() {
  return getCouponByCode(localStorage.getItem(STORAGE_KEYS.coupon));
}

function saveActiveCoupon(code) {
  if (code) localStorage.setItem(STORAGE_KEYS.coupon, String(code).trim().toUpperCase());
  else localStorage.removeItem(STORAGE_KEYS.coupon);
}

function calculateCouponDiscount(coupon, subtotal) {
  if (!coupon || subtotal < coupon.minOrderValue) return 0;
  const discount = Math.floor(subtotal * coupon.discountPercent / 100);
  return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
}

async function fetchCouponByCode(code, subtotal = 0) {
  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized) return null;


  return getCouponByCode(normalized);
}

async function createOrderFromCart(payload) {
  if (!ApiClient.enabled()) {
    throw new Error('Backend API chua s?n s�ng.');
  }
  if (!getAuthSession()) {
    throw new Error('Vui long dang nhap de dat hang.');
  }

  const response = await ApiClient.request('/orders/checkout.php', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return response.data;
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; document.body.appendChild(toast); }
  toast.replaceChildren();

  const iconMatch = String(message).match(/^<i class="(fa-[^"]+)"><\/i>\s*(.*)$/);
  if (iconMatch) {
    const icon = document.createElement('i');
    icon.className = iconMatch[1];
    toast.append(icon, document.createTextNode(` ${iconMatch[2]}`));
  } else {
    toast.textContent = message;
  }

  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '<i class="fa-solid fa-star"></i>'.repeat(full) +
    (half ? '<i class="fa-solid fa-star-half-stroke"></i>' : '') +
    '<i class="fa-regular fa-star"></i>'.repeat(empty);
}


