// PC GEAR STORE - DATA

const DEFAULT_PRODUCTS = [
  // CPU
  {
    id: 1, name: 'Intel Core i5-14400F', category: 'CPU', brand: 'Intel',
    price: 3000000, oldPrice: 3490000, image: 'assets/img/cpu.svg',
    badge: 'bestseller', badgeText: 'Best Seller',
    spec: '10 nhân 16 luồng, LGA1700, Gaming ổn áp',
    desc: 'CPU quốc dân cho cấu hình gaming tầm trung, hiệu năng mạnh, dễ build với main B760. Hỗ trợ DDR4/DDR5 tùy mainboard.',
    stock: 18, rating: 4.8, reviews: 156,
    specs: { 'Socket': 'LGA1700', 'Số nhân': '10 (6P+4E)', 'Số luồng': '16', 'Base Clock': '2.5 GHz', 'Boost Clock': '4.7 GHz', 'Cache': '20MB L3', 'TDP': '65W', 'Kiến trúc': 'Raptor Lake Refresh' },
    images: ['assets/img/cpu.svg']
  },
  {
    id: 2, name: 'AMD Ryzen 5 7500F', category: 'CPU', brand: 'AMD',
    price: 3890000, oldPrice: 4290000, image: 'assets/img/cpu.svg',
    badge: 'hot', badgeText: 'Hot',
    spec: '6 nhân 12 luồng, AM5, DDR5',
    desc: 'Lựa chọn đẹp cho nền tảng AM5, cân tốt game eSports và AAA khi đi cùng VGA rời. Tiết kiệm điện, chạy mát.',
    stock: 12, rating: 4.6, reviews: 89,
    specs: { 'Socket': 'AM5', 'Số nhân': '6', 'Số luồng': '12', 'Base Clock': '3.7 GHz', 'Boost Clock': '5.0 GHz', 'Cache': '32MB L3', 'TDP': '65W', 'Kiến trúc': 'Zen 4' },
    images: ['assets/img/cpu.svg']
  },
  {
    id: 3, name: 'Intel Core i7-14700KF', category: 'CPU', brand: 'Intel',
    price: 8290000, oldPrice: 9490000, image: 'assets/img/cpu.svg',
    badge: 'sale', badgeText: '-13%',
    spec: '20 nhân 28 luồng, LGA1700, Unlocked',
    desc: 'CPU cao cấp cho gaming và workstation. Hiệu năng đa nhiệm vượt trội, hỗ trợ overclock.',
    stock: 6, rating: 4.9, reviews: 203,
    specs: { 'Socket': 'LGA1700', 'Số nhân': '20 (8P+12E)', 'Số luồng': '28', 'Base Clock': '3.4 GHz', 'Boost Clock': '5.6 GHz', 'Cache': '33MB L3', 'TDP': '125W', 'Kiến trúc': 'Raptor Lake Refresh' },
    images: ['assets/img/cpu.svg']
  },

  // GPU
  {
    id: 4, name: 'ASUS TUF RTX 5060 Ti 16GB', category: 'GPU', brand: 'ASUS',
    price: 12500000, oldPrice: 13200000, image: 'assets/img/gpu.svg',
    badge: 'new', badgeText: 'Mới',
    spec: '16GB GDDR7, 3 fan, Ray Tracing',
    desc: 'Card đồ họa dành cho gaming 2K, render nhẹ và build PC hiệu năng cao. Tản nhiệt 3 fan siêu mát.',
    stock: 8, rating: 4.7, reviews: 67,
    specs: { 'GPU': 'NVIDIA RTX 5060 Ti', 'VRAM': '16GB GDDR7', 'Bus': '128-bit', 'Boost Clock': '2535 MHz', 'Ray Tracing': 'Có', 'DLSS': '4.0', 'TDP': '150W', 'Cổng': '1x HDMI 2.1, 3x DP 2.1' },
    images: ['assets/img/gpu.svg']
  },
  {
    id: 5, name: 'MSI Gaming X RTX 4070 Super 12GB', category: 'GPU', brand: 'MSI',
    price: 15900000, oldPrice: 17200000, image: 'assets/img/gpu.svg',
    badge: 'sale', badgeText: '-8%',
    spec: '12GB GDDR6X, 2 fan, DLSS 3',
    desc: 'Card đồ họa mạnh cho gaming 2K-4K, streaming và làm việc đồ họa chuyên nghiệp.',
    stock: 5, rating: 4.8, reviews: 112,
    specs: { 'GPU': 'NVIDIA RTX 4070 Super', 'VRAM': '12GB GDDR6X', 'Bus': '192-bit', 'Boost Clock': '2505 MHz', 'Ray Tracing': 'Có', 'DLSS': '3.0', 'TDP': '220W', 'Cổng': '1x HDMI 2.1, 3x DP 1.4a' },
    images: ['assets/img/gpu.svg']
  },

  // Mainboard
  {
    id: 6, name: 'MSI B760M Gaming WiFi DDR5', category: 'Mainboard', brand: 'MSI',
    price: 2890000, oldPrice: 3290000, image: 'assets/img/mainboard.svg',
    badge: 'bestseller', badgeText: 'Best Seller',
    spec: 'LGA1700, DDR5, m-ATX, WiFi 6E',
    desc: 'Mainboard gọn đẹp cho case m-ATX, có WiFi 6E, đủ khe M.2 và cổng kết nối cơ bản.',
    stock: 15, rating: 4.5, reviews: 78,
    specs: { 'Socket': 'LGA1700', 'Chipset': 'B760', 'Form Factor': 'm-ATX', 'RAM': '2x DDR5 (max 128GB)', 'M.2': '2 khe', 'WiFi': '6E', 'USB': '6x USB 3.2', 'Audio': 'Realtek ALC897' },
    images: ['assets/img/mainboard.svg']
  },
  {
    id: 7, name: 'Gigabyte B650 AORUS Elite AX V2', category: 'Mainboard', brand: 'Gigabyte',
    price: 4190000, oldPrice: 4690000, image: 'assets/img/mainboard.svg',
    badge: 'hot', badgeText: 'Hot',
    spec: 'AM5, DDR5, ATX, WiFi 6E',
    desc: 'Mainboard AM5 cao cấp tầm trung, VRM mạnh, hỗ trợ PCIe 5.0 cho SSD.',
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
    desc: 'Thanh RAM DDR5 tốc độ cao, low-profile dễ lắp với tản khí lớn. XMP 3.0.',
    stock: 30, rating: 4.7, reviews: 132,
    specs: { 'Dung lượng': '16GB (1x16GB)', 'Loại': 'DDR5', 'Tốc độ': '6000 MHz', 'CAS Latency': 'CL30', 'Điện áp': '1.35V', 'XMP': '3.0', 'Heatsink': 'Có', 'Chiều cao': '33mm' },
    images: ['assets/img/ram.svg']
  },
  {
    id: 9, name: 'Kingston Fury Beast 32GB (2x16) DDR5 5600', category: 'RAM', brand: 'Kingston',
    price: 2190000, oldPrice: 2590000, image: 'assets/img/ram.svg',
    badge: 'bestseller', badgeText: 'Best Seller',
    spec: '32GB Kit, 5600MHz, CL36',
    desc: 'Kit RAM 32GB DDR5 cho build gaming và workstation, tương thích tốt Intel & AMD.',
    stock: 20, rating: 4.6, reviews: 95,
    specs: { 'Dung lượng': '32GB (2x16GB)', 'Loại': 'DDR5', 'Tốc độ': '5600 MHz', 'CAS Latency': 'CL36', 'Điện áp': '1.25V', 'XMP': '3.0', 'Heatsink': 'Có', 'Chiều cao': '34.9mm' },
    images: ['assets/img/ram.svg']
  },

  // SSD
  {
    id: 10, name: 'Lexar NM790 1TB Gen4', category: 'SSD', brand: 'Lexar',
    price: 1889000, oldPrice: 2190000, image: 'assets/img/ssd.svg',
    badge: 'hot', badgeText: 'Hot',
    spec: '1TB, PCIe 4.0, 7400MB/s Read',
    desc: 'SSD Gen4 tốc độ đọc 7400MB/s, load Windows, game và project cực nhanh.',
    stock: 22, rating: 4.8, reviews: 178,
    specs: { 'Dung lượng': '1TB', 'Interface': 'PCIe Gen4 x4 NVMe', 'Form Factor': 'M.2 2280', 'Đọc': '7400 MB/s', 'Ghi': '6500 MB/s', 'IOPS đọc': '1,000K', 'IOPS ghi': '900K', 'TBW': '800TB' },
    images: ['assets/img/ssd.svg']
  },
  {
    id: 11, name: 'Samsung 990 Pro 2TB Gen4', category: 'SSD', brand: 'Samsung',
    price: 4290000, oldPrice: 4990000, image: 'assets/img/ssd.svg',
    badge: 'sale', badgeText: '-14%',
    spec: '2TB, PCIe 4.0, 7450MB/s Read',
    desc: 'SSD flagship của Samsung, hiệu năng đỉnh cao cho gaming và công việc chuyên nghiệp.',
    stock: 9, rating: 4.9, reviews: 234,
    specs: { 'Dung lượng': '2TB', 'Interface': 'PCIe Gen4 x4 NVMe', 'Form Factor': 'M.2 2280', 'Đọc': '7450 MB/s', 'Ghi': '6900 MB/s', 'IOPS đọc': '1,400K', 'IOPS ghi': '1,550K', 'TBW': '1200TB' },
    images: ['assets/img/ssd.svg']
  },

  // PSU
  {
    id: 12, name: 'MSI MAG A750BN 750W Bronze', category: 'PSU', brand: 'MSI',
    price: 1490000, oldPrice: 1690000, image: 'assets/img/psu.svg',
    badge: 'bestseller', badgeText: 'Best Seller',
    spec: '750W, 80 Plus Bronze, ATX',
    desc: 'Nguồn 750W ổn định cho cấu hình tầm trung tới cận cao cấp. Bảo hành 5 năm.',
    stock: 16, rating: 4.5, reviews: 62,
    specs: { 'Công suất': '750W', 'Chuẩn': '80 Plus Bronze', 'Form Factor': 'ATX', 'Modular': 'Non-modular', 'Fan': '120mm', 'Bảo vệ': 'OVP/OPP/SCP/OTP', 'Cổng PCIe': '2x 8-pin', 'Bảo hành': '5 năm' },
    images: ['assets/img/psu.svg']
  },
  {
    id: 13, name: 'Corsair RM850x 850W Gold', category: 'PSU', brand: 'Corsair',
    price: 2990000, oldPrice: 3490000, image: 'assets/img/psu.svg',
    badge: 'new', badgeText: 'Mới',
    spec: '850W, 80 Plus Gold, Full Modular',
    desc: 'Nguồn cao cấp full modular, chạy siêu êm với chế độ Zero RPM. Lý tưởng cho RTX 40/50 series.',
    stock: 11, rating: 4.9, reviews: 145,
    specs: { 'Công suất': '850W', 'Chuẩn': '80 Plus Gold', 'Form Factor': 'ATX', 'Modular': 'Full Modular', 'Fan': '135mm (Zero RPM)', 'Bảo vệ': 'OVP/OPP/SCP/OTP/UVP', 'Cổng PCIe': '4x 8-pin + 12VHPWR', 'Bảo hành': '10 năm' },
    images: ['assets/img/psu.svg']
  },

  // Case
  {
    id: 14, name: 'Xigmatek Ocean RGB', category: 'Case', brand: 'Xigmatek',
    price: 700000, oldPrice: 850000, image: 'assets/img/case.svg',
    badge: 'sale', badgeText: '-18%',
    spec: 'm-ATX, Mặt kính, 3 fan ARGB',
    desc: 'Case giá tốt nhất phân khúc, thiết kế hiện đại, kèm 3 fan ARGB sẵn.',
    stock: 20, rating: 4.3, reviews: 87,
    specs: { 'Form Factor': 'm-ATX / ITX', 'Chất liệu': 'Thép + Kính cường lực', 'Khe fan': '6 x 120mm', 'Fan kèm': '3 x 120mm ARGB', 'Khe HDD': '2', 'Khe SSD': '2', 'GPU tối đa': '330mm', 'CPU Cooler': '160mm' },
    images: ['assets/img/case.svg']
  },

  // Cooling
  {
    id: 15, name: 'Jonsbo CR1000 EVO ARGB', category: 'Cooling', brand: 'Jonsbo',
    price: 290000, oldPrice: 390000, image: 'assets/img/cooler.svg',
    badge: 'sale', badgeText: '-26%',
    spec: 'Tower cooler, 4 heatpipe, ARGB',
    desc: 'Tản khí nhỏ gọn, đẹp, đủ dùng cho CPU phổ thông. LED ARGB đồng bộ mainboard.',
    stock: 25, rating: 4.4, reviews: 56,
    specs: { 'Loại': 'Tower Air Cooler', 'Heatpipe': '4 ống đồng', 'Fan': '1 x 120mm ARGB', 'RPM': '800-1800', 'Tiếng ồn': '≤26dBA', 'TDP hỗ trợ': '165W', 'Chiều cao': '155mm', 'Socket': 'LGA1700/AM5/AM4' },
    images: ['assets/img/cooler.svg']
  },
  {
    id: 16, name: 'DeepCool AK620 Digital', category: 'Cooling', brand: 'DeepCool',
    price: 1490000, oldPrice: 1690000, image: 'assets/img/cooler.svg',
    badge: 'hot', badgeText: 'Hot',
    spec: 'Dual tower, 6 heatpipe, Màn hình LED',
    desc: 'Tản khí dual tower cao cấp với màn hình LED hiển thị nhiệt độ CPU realtime.',
    stock: 14, rating: 4.8, reviews: 98,
    specs: { 'Loại': 'Dual Tower Air Cooler', 'Heatpipe': '6 ống đồng', 'Fan': '2 x 120mm FK120', 'RPM': '500-1850', 'Tiếng ồn': '≤28dBA', 'TDP hỗ trợ': '260W', 'Chiều cao': '160mm', 'Màn hình': 'LED hiển thị nhiệt độ' },
    images: ['assets/img/cooler.svg']
  },

  // Monitor
  {
    id: 17, name: 'LG 27GP850-B 27" 2K 165Hz', category: 'Monitor', brand: 'LG',
    price: 7990000, oldPrice: 8990000, image: 'assets/img/monitor.svg',
    badge: 'hot', badgeText: 'Hot',
    spec: '27" IPS Nano, 2K, 165Hz, 1ms',
    desc: 'Màn hình gaming 2K IPS Nano, tốc độ phản hồi 1ms, HDR400. Chuẩn cho game thủ.',
    stock: 7, rating: 4.7, reviews: 134,
    specs: { 'Kích thước': '27 inch', 'Độ phân giải': '2560x1440 (2K)', 'Tấm nền': 'IPS Nano', 'Tần số': '165Hz (OC 180Hz)', 'Thời gian PH': '1ms GtG', 'HDR': 'HDR400', 'Cổng': '1x HDMI 2.0, 1x DP 1.4, 2x USB 3.0', 'FreeSync/G-Sync': 'G-Sync Compatible' },
    images: ['assets/img/monitor.svg']
  },
  {
    id: 18, name: 'Kuycon P27L 27" 4K IPS 60Hz', category: 'Monitor', brand: 'Kuycon',
    price: 6300000, oldPrice: 6900000, image: 'assets/img/monitor.svg',
    badge: 'new', badgeText: 'Mới',
    spec: '27" 4K IPS, 60Hz, 99% sRGB',
    desc: 'Màn hình 4K sắc nét cho đồ họa, thiết kế và xem phim. Tấm nền IPS góc nhìn rộng.',
    stock: 5, rating: 4.5, reviews: 42,
    specs: { 'Kích thước': '27 inch', 'Độ phân giải': '3840x2160 (4K)', 'Tấm nền': 'IPS', 'Tần số': '60Hz', 'Thời gian PH': '5ms', 'Màu sắc': '99% sRGB, 95% DCI-P3', 'Cổng': '1x HDMI 2.0, 1x DP 1.2, USB-C', 'Chân đế': 'Xoay, nghiêng, nâng hạ' },
    images: ['assets/img/monitor.svg']
  },

  // Mouse
  {
    id: 19, name: 'Logitech G Pro X Superlight 2', category: 'Mouse', brand: 'Logitech',
    price: 2890000, oldPrice: 3290000, image: 'assets/img/mouse.svg',
    badge: 'bestseller', badgeText: 'Best Seller',
    spec: 'Wireless, 60g, 32K DPI, 95h pin',
    desc: 'Chuột gaming không dây nhẹ nhất thế giới, sensor HERO 2 32K. Lựa chọn của pro players.',
    stock: 13, rating: 4.9, reviews: 267,
    specs: { 'Kết nối': 'Wireless (LIGHTSPEED)', 'Sensor': 'HERO 2 (32K DPI)', 'Trọng lượng': '60g', 'Polling Rate': '2000 Hz (4K optional)', 'Pin': '95 giờ', 'Nút': '5 nút', 'Switch': 'LIGHTFORCE Hybrid', 'Grip': 'Claw / Fingertip' },
    images: ['assets/img/mouse.svg']
  },
  {
    id: 20, name: 'Razer Viper V3 Pro', category: 'Mouse', brand: 'Razer',
    price: 3490000, oldPrice: 3890000, image: 'assets/img/mouse.svg',
    badge: 'new', badgeText: 'Mới',
    spec: 'Wireless, 54g, 35K DPI, 8K Hz',
    desc: 'Chuột eSports đỉnh cao với polling rate 8000Hz, siêu nhẹ 54g.',
    stock: 8, rating: 4.8, reviews: 89,
    specs: { 'Kết nối': 'Wireless (HyperSpeed)', 'Sensor': 'Focus Pro 35K Gen-2', 'Trọng lượng': '54g', 'Polling Rate': '8000 Hz', 'Pin': '90 giờ', 'Nút': '6 nút', 'Switch': 'Gen-3 Optical', 'Grip': 'Claw / Fingertip' },
    images: ['assets/img/mouse.svg']
  },

  // Keyboard
  {
    id: 21, name: 'Akko 5075B Plus V2', category: 'Keyboard', brand: 'Akko',
    price: 1390000, oldPrice: 1590000, image: 'assets/img/keyboard.svg',
    badge: 'bestseller', badgeText: 'Best Seller',
    spec: '75% Wireless, Hot-swap, Gasket Mount',
    desc: 'Bàn phím cơ 75% wireless, gasket mount êm ái. Hot-swap switch dễ dàng tùy biến.',
    stock: 19, rating: 4.6, reviews: 156,
    specs: { 'Layout': '75% (82 phím)', 'Kết nối': 'Bluetooth 5.0 / 2.4G / USB-C', 'Switch': 'Cream Yellow V3 (Linear)', 'Mounting': 'Gasket Mount', 'Hot-swap': 'Có (5-pin)', 'Keycap': 'PBT Double-shot', 'Pin': '3000mAh (100h)', 'Foam': 'IXPE + PE Foam' },
    images: ['assets/img/keyboard.svg']
  },
  {
    id: 22, name: 'Razer BlackWidow V4 75%', category: 'Keyboard', brand: 'Razer',
    price: 3690000, oldPrice: 3990000, image: 'assets/img/keyboard.svg',
    badge: 'new', badgeText: 'Mới',
    spec: '75% Razer Switch, RGB, Hot-swap',
    desc: 'Bàn phím gaming cao cấp với switch Razer Orange V4, âm thanh thock đặc trưng.',
    stock: 7, rating: 4.7, reviews: 45,
    specs: { 'Layout': '75% (84 phím)', 'Kết nối': 'USB-C', 'Switch': 'Razer Orange Tactile V4', 'Mounting': 'Gasket', 'Hot-swap': 'Có', 'Keycap': 'PBT Double-shot', 'Backlight': 'Razer Chroma RGB', 'Đặc biệt': 'Knob xoay + Media keys' },
    images: ['assets/img/keyboard.svg']
  },

  // Headset
  {
    id: 23, name: 'HyperX Cloud III Wireless', category: 'Headset', brand: 'HyperX',
    price: 2790000, oldPrice: 3190000, image: 'assets/img/headset.svg',
    badge: 'hot', badgeText: 'Hot',
    spec: 'Wireless, DTS Headphone:X, 120h pin',
    desc: 'Tai nghe gaming không dây với DTS Headphone:X Spatial Audio, pin 120h siêu trâu.',
    stock: 11, rating: 4.7, reviews: 98,
    specs: { 'Kết nối': 'Wireless 2.4GHz / 3.5mm', 'Driver': '53mm Angled', 'Tần số': '10Hz - 21kHz', 'Trở kháng': '64Ω', 'Microphone': 'Detachable (tháo rời)', 'Âm thanh': 'DTS Headphone:X', 'Pin': '120 giờ', 'Trọng lượng': '330g' },
    images: ['assets/img/headset.svg']
  },
  {
    id: 24, name: 'SteelSeries Arctis Nova Pro', category: 'Headset', brand: 'SteelSeries',
    price: 5490000, oldPrice: 5990000, image: 'assets/img/headset.svg',
    badge: 'sale', badgeText: '-8%',
    spec: 'Wireless, ANC, Hi-Res, Dual Battery',
    desc: 'Tai nghe gaming flagship với ANC chủ động, âm thanh Hi-Res. Hệ thống pin đôi hot-swap.',
    stock: 4, rating: 4.9, reviews: 156,
    specs: { 'Kết nối': 'Wireless 2.4GHz / Bluetooth 5.0', 'Driver': '40mm Premium', 'Tần số': '10Hz - 40kHz (Hi-Res)', 'ANC': 'Có (4 mic)', 'Microphone': 'ClearCast Gen 2 (thu rút)', 'DAC': 'GameDAC Gen 2', 'Pin': 'Dual Battery Hot-swap (22h/pin)', 'Trọng lượng': '338g' },
    images: ['assets/img/headset.svg']
  }
];

// Blog posts
const BLOG_POSTS = [
  {
    id: 1, title: 'Hướng dẫn build PC Gaming 15 triệu chiến mượt mọi game 2025',
    excerpt: 'Cấu hình PC gaming 15 triệu với CPU Intel i5-14400F, RTX 5060 Ti 16GB, 16GB DDR5 RAM. Cân mượt mọi tựa game eSports và AAA ở 2K.',
    category: 'Build PC', author: 'PC Gear', date: '2026-06-10', readTime: '8 phút', image: 'assets/img/gpu.svg'
  },
  {
    id: 2, title: 'So sánh Intel vs AMD 2026: Nên chọn CPU nào cho gaming?',
    excerpt: 'Phân tích chi tiết hiệu năng, giá cả và tính năng giữa Intel Core 14th Gen và AMD Ryzen 7000 series. Đâu là lựa chọn tối ưu?',
    category: 'Đánh giá', author: 'PC Gear', date: '2026-06-08', readTime: '12 phút', image: 'assets/img/cpu.svg'
  },
  {
    id: 3, title: 'Top 5 SSD NVMe Gen4 đáng mua nhất 2026',
    excerpt: 'Danh sách SSD NVMe Gen4 có hiệu năng tốt nhất trong tầm giá. Từ budget đến flagship, đều có lựa chọn phù hợp.',
    category: 'Top List', author: 'PC Gear', date: '2026-06-05', readTime: '6 phút', image: 'assets/img/ssd.svg'
  },
  {
    id: 4, title: 'Cách chọn nguồn PSU phù hợp cho PC gaming',
    excerpt: 'Hướng dẫn tính công suất nguồn cần thiết, giải thích 80 Plus Bronze/Gold/Platinum, và top nguồn tốt nhất theo từng mức giá.',
    category: 'Hướng dẫn', author: 'PC Gear', date: '2026-06-02', readTime: '10 phút', image: 'assets/img/psu.svg'
  },
  {
    id: 5, title: 'Bàn phím cơ 2026: Gasket Mount vs Plate Mount khác gì?',
    excerpt: 'Tìm hiểu sự khác biệt giữa Gasket Mount và Plate Mount, cùng ưu nhược điểm của từng loại để chọn bàn phím phù hợp.',
    category: 'Kiến thức', author: 'PC Gear', date: '2026-05-28', readTime: '7 phút', image: 'assets/img/mainboard.svg'
  },
  {
    id: 6, title: 'RTX 5060 Ti Review: Card đồ họa gaming 2K tốt nhất?',
    excerpt: 'Đánh giá chi tiết NVIDIA RTX 5060 Ti với benchmark trong 20+ game, so sánh với RTX 4060 Ti và RX 7700 XT.',
    category: 'Đánh giá', author: 'PC Gear', date: '2026-05-25', readTime: '15 phút', image: 'assets/img/gpu.svg'
  }
];

// Category metadata - use Font Awesome class names instead of emoji
const CATEGORIES = [
  { key: 'CPU', label: 'Bộ xử lý', icon: 'fa-microchip' },
  { key: 'GPU', label: 'Card đồ họa', icon: 'fa-display' },
  { key: 'Mainboard', label: 'Bo mạch chủ', icon: 'fa-server' },
  { key: 'RAM', label: 'Bộ nhớ RAM', icon: 'fa-memory' },
  { key: 'SSD', label: 'Ổ cứng SSD', icon: 'fa-hard-drive' },
  { key: 'PSU', label: 'Nguồn máy tính', icon: 'fa-bolt' },
  { key: 'Case', label: 'Vỏ máy tính', icon: 'fa-computer' },
  { key: 'Cooling', label: 'Tản nhiệt', icon: 'fa-fan' },
  { key: 'Monitor', label: 'Màn hình', icon: 'fa-tv' },
  { key: 'Mouse', label: 'Chuột gaming', icon: 'fa-computer-mouse' },
  { key: 'Keyboard', label: 'Bàn phím cơ', icon: 'fa-keyboard' },
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
  coupon: 'pcgear_coupon',
  token: 'pcgear_token',
  user: 'pcgear_user'
};

const ApiClient = {
  baseUrl: 'backend/public',

  enabled() {
    return Boolean(this.baseUrl) && /^https?:$/.test(window.location.protocol);
  },

  async request(path, options = {}) {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${this.baseUrl}${path}`, {
      headers,
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
      const [products, categories, brands, posts] = await Promise.all([
        this.request('/products?per_page=50'),
        this.request('/categories'),
        this.request('/brands'),
        this.request('/blog-posts')
      ]);

      ApiState.products = products.data || [];
      if (Array.isArray(categories.data)) {
        CATEGORIES.splice(0, CATEGORIES.length, ...categories.data.map(c => ({
          key: c.key,
          label: c.label,
          icon: c.icon
        })));
      }
      if (Array.isArray(brands.data)) {
        BRANDS.splice(0, BRANDS.length, ...brands.data.map(b => b.name));
      }
      if (Array.isArray(posts.data)) {
        BLOG_POSTS.splice(0, BLOG_POSTS.length, ...posts.data.map(mapBlogPostFromApi));
      }
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
    readTime: post.read_time ? `${post.read_time} phÃºt` : '5 phÃºt',
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

function getAuthToken() {
  return localStorage.getItem(STORAGE_KEYS.token);
}

function getCurrentUser() {
  return readStorage(STORAGE_KEYS.user, null);
}

function saveAuthSession({ token, user }) {
  if (token) localStorage.setItem(STORAGE_KEYS.token, token);
  if (user) writeStorage(STORAGE_KEYS.user, user);
}

function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
}

async function loginUser(email, password) {
  const session = await ApiClient.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  saveAuthSession(session);
  return session.user;
}

async function registerUser(payload) {
  const session = await ApiClient.request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  saveAuthSession(session);
  return session.user;
}

async function saveProductToApi(product, id = null) {
  if (!ApiClient.enabled()) return product;

  const response = await ApiClient.request(id ? `/products/${id}` : '/products', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(product)
  });
  ApiState.products = null;
  await ApiClient.bootstrap();
  return response.data;
}

async function deleteProductFromApi(id) {
  if (!ApiClient.enabled()) return;

  await ApiClient.request(`/products/${id}`, { method: 'DELETE' });
  ApiState.products = null;
  await ApiClient.bootstrap();
}

function money(value) {
  return new Intl.NumberFormat('vi-VN').format(value) + '₫';
}

function getDiscount(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
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
    showToast('<i class="fa-solid fa-circle-xmark"></i> Sản phẩm không tồn tại');
    return;
  }

  const stock = Number(product.stock) || 0;
  if (stock <= 0) {
    showToast('<i class="fa-solid fa-circle-xmark"></i> Sản phẩm đã hết hàng');
    return;
  }

  const cart = getCart();
  const addQty = Math.max(1, Number(qty) || 1);
  const found = cart.find(item => item.id === productId);
  if (found) { found.qty = Math.min(stock, found.qty + addQty); }
  else { cart.push({ id: productId, qty: Math.min(stock, addQty) }); }
  saveCart(cart);
  syncCartItemToApi(productId, cart.find(item => item.id === productId)?.qty || addQty);
  showToast('Đã thêm vào giỏ hàng');
}

async function syncCartItemToApi(productId, quantity) {
  if (!ApiClient.enabled() || !getAuthToken()) return;

  try {
    await ApiClient.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ product_id: Number(productId), quantity: Number(quantity) })
    });
  } catch (error) {
    console.warn('Cart sync failed.', error);
  }
}

async function removeCartItemFromApi(productId) {
  if (!ApiClient.enabled() || !getAuthToken()) return;

  try {
    await ApiClient.request(`/cart/items/${productId}`, { method: 'DELETE' });
  } catch (error) {
    console.warn('Cart remove sync failed.', error);
  }
}

async function clearCartFromApi() {
  if (!ApiClient.enabled() || !getAuthToken()) return;

  try {
    await ApiClient.request('/cart', { method: 'DELETE' });
  } catch (error) {
    console.warn('Cart clear sync failed.', error);
  }
}

// Wishlist
function getWishlist() {
  return readStorage(STORAGE_KEYS.wishlist, []).map(Number).filter(Boolean);
}

function saveWishlist(list) {
  writeStorage(STORAGE_KEYS.wishlist, list);
  updateWishlistCount();
}

async function toggleWishlist(id) {
  let list = getWishlist();
  const numId = Number(id);
  const shouldRemove = list.includes(numId);
  if (shouldRemove) {
    list = list.filter(i => i !== numId);
    showToast('<i class="fa-solid fa-circle-xmark"></i> Đã bỏ khỏi yêu thích');
  } else {
    list.push(numId);
    showToast('<i class="fa-solid fa-heart"></i> Đã thêm vào yêu thích');
  }
  saveWishlist(list);
  syncWishlistToApi(numId, !shouldRemove);
  document.querySelectorAll(`[data-wishlist="${id}"]`).forEach(btn => {
    btn.classList.toggle('active', list.includes(numId));
    btn.innerHTML = list.includes(numId) ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
  });
}

async function syncWishlistToApi(productId, active) {
  if (!ApiClient.enabled() || !getAuthToken()) return;

  try {
    await ApiClient.request(`/wishlist/${productId}`, { method: active ? 'POST' : 'DELETE' });
  } catch (error) {
    console.warn('Wishlist sync failed.', error);
  }
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

  if (ApiClient.enabled()) {
    try {
      const response = await ApiClient.request(`/coupons/${encodeURIComponent(normalized)}?subtotal=${Number(subtotal) || 0}`);
      return response.data ? {
        code: response.data.code,
        discountPercent: Number(response.data.discountPercent),
        minOrderValue: Number(response.data.minOrderValue),
        maxDiscount: response.data.maxDiscount !== null ? Number(response.data.maxDiscount) : null,
        isActive: Boolean(response.data.isActive)
      } : null;
    } catch {
      return null;
    }
  }

  return getCouponByCode(normalized);
}

async function createOrderFromCart(payload) {
  if (!ApiClient.enabled()) {
    throw new Error('Backend API chưa sẵn sàng.');
  }
  if (!getAuthToken()) {
    throw new Error('Vui lòng đăng nhập để đặt hàng.');
  }

  const response = await ApiClient.request('/orders', {
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
