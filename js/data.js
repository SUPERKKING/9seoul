/**
 * 9SEOUL Experience & Art Database
 * Categories: 'experience' (경험) | 'making' (제작)
 * Centered around historic Seochon, Jongno-gu, Seoul
 */

export const INITIAL_PROGRAMS = [
  {
    id: "prog-1",
    title: "Seochon Hanok Mindful Tea Ceremony & Heritage House Tour",
    titleKo: "서촌 100년 고택 한옥 다도 및 명상 체험",
    category: "experience", // 경험
    categoryLabel: "Experience (경험)",
    categoryIcon: "🍵",
    host: {
      name: "Master Sun-hee Park",
      role: "Certified Hanok Tea Sommelier",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      languages: ["English", "Korean", "Japanese"]
    },
    location: {
      name: "Nuha-dong Hanok Pavilion (Jaha Tea House)",
      nameKo: "누하동 자하헌 다도공간",
      address: "24 Jahamun-ro 7-gil, Jongno-gu, Seoul",
      addressKo: "서울시 종로구 자하문로7길 24",
      lat: 37.5802,
      lng: 126.9698,
      landmarkDistanceDesc: "3 min walk from Tongin Market"
    },
    pricing: {
      krw: 45000,
      usd: 34
    },
    durationMinutes: 90,
    rating: 4.96,
    reviewCount: 148,
    audioDocent: {
      title: "1-Min Hanok Tea Soundscape & Master Introduction",
      duration: "0:58",
      transcript: "Welcome to Jaha Tea House in Nuha-dong. Listen to the gentle spring water heating in the iron kettle as we prepare wild mountain green tea harvested from Mount Jirisan. Breathe in the cedar wood aromas of this century-old Hanok."
    },
    reviews: [
      {
        id: "rev-1",
        author: "Emma Watson",
        country: "🇬🇧 London, UK",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
        rating: 5,
        date: "2 days ago",
        text: "The most serene morning in Seoul! Master Park explained the philosophy behind Korean green tea so poetically. The seasonal Dasik cookies melted in my mouth.",
        photo: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400"
      },
      {
        id: "rev-2",
        author: "Lucas Chen",
        country: "🇸🇬 Singapore",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        rating: 5,
        date: "5 days ago",
        text: "Hidden gem inside Seochon alleyways! Walking here with the app's GPS route was super easy.",
        photo: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400"
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1528164344705-475426879c0d?w=800&auto=format&fit=crop&q=80"
    ],
    nextAvailableSlot: "Today 15:30",
    slots: [
      { id: "s1-1", time: "11:00", available: 4, max: 6 },
      { id: "s1-2", time: "14:00", available: 2, max: 6 },
      { id: "s1-3", time: "15:30", available: 5, max: 6 },
      { id: "s1-4", time: "17:00", available: 6, max: 6 }
    ],
    summary: "Immerse in tranquil Joseon-era tea culture inside a century-old Hanok. Taste 3 wild mountain green teas paired with handcrafted seasonal Dasik (Korean sweets).",
    summaryKo: "100년 된 서촌 한옥에서 야생 차 3종과 제철 다식을 맛보며 즐기는 정통 다도 명상 체험입니다.",
    inclusions: ["3 Premium Korean Teas", "Seasonal Dasik Sweets", "Hanok Garden Access", "Tea Mindfulness Guide Booklet"],
    badge: "🔥 Fast Booking",
    featured: true
  },
  {
    id: "prog-2",
    title: "Joseon White Porcelain (Baekja) Wheel Pottery Workshop",
    titleKo: "조선 백자 물레 성형 & 도예 컵/화병 제작 클래스",
    category: "making", // 제작
    categoryLabel: "Making (제작)",
    categoryIcon: "🏺",
    host: {
      name: "Ceramist Min-woo Kang",
      role: "Seochon Clay Collective Founder",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      languages: ["English", "Korean"]
    },
    location: {
      name: "Clay & Soul Atelier Seochon",
      nameKo: "서촌 흙과 영혼 공방",
      address: "18 Pirundae-ro, Jongno-gu, Seoul",
      addressKo: "서울시 종로구 필운대로 18",
      lat: 37.5768,
      lng: 126.9679,
      landmarkDistanceDesc: "5 min walk from Gyeongbokgung Stn Exit 2"
    },
    pricing: {
      krw: 68000,
      usd: 52
    },
    durationMinutes: 120,
    rating: 4.98,
    reviewCount: 210,
    audioDocent: {
      title: "1-Min Joseon White Ceramic & Wheel Craft Guide",
      duration: "0:52",
      transcript: "Welcome to Clay & Soul Atelier. Feel the cool natural white clay on the potter's wheel. Master Min-woo will guide your hands to shape a graceful Moon Jar cup."
    },
    reviews: [
      {
        id: "rev-2-1",
        author: "Sarah Jenkins",
        country: "🇺🇸 New York, USA",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
        rating: 5,
        date: "3 days ago",
        text: "Making my own white porcelain cup was the highlight of my trip to Seoul! International shipping was smooth.",
        photo: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400"
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531875456634-3f5418280d20?w=800&auto=format&fit=crop&q=80"
    ],
    nextAvailableSlot: "Today 16:00",
    slots: [
      { id: "s2-1", time: "13:30", available: 1, max: 4 },
      { id: "s2-2", time: "16:00", available: 3, max: 4 },
      { id: "s2-3", time: "18:30", available: 4, max: 4 }
    ],
    summary: "Throw your own Joseon-style minimalist white ceramic cup or vase on the electric pottery wheel. Worldwide kiln-fired shipping available to your home country.",
    summaryKo: "전통 조선 백자의 절제된 미학을 살려 나만의 도자기 컵 또는 화병을 물레로 직접 빚어보는 원데이 클래스입니다.",
    inclusions: ["All Premium White Clay", "Wheel Coaching", "2 Kiln Firings & Glaze", "Protective Apron & Gift Box"],
    badge: "⭐ Top Rated",
    featured: true
  },
  {
    id: "prog-3",
    title: "Boan 1942: Contemporary Art & Historic Inn Curator Walk",
    titleKo: "보안1942 현대미술 전시 & 80년 역사 여관 큐레이터 투어",
    category: "experience", // 경험
    categoryLabel: "Experience (경험)",
    categoryIcon: "🎨",
    host: {
      name: "Curator Chloe Kim",
      role: "Contemporary Art Historian",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      languages: ["English", "Korean", "French"]
    },
    location: {
      name: "Boan 1942 Cultural Complex",
      nameKo: "보안1942 복합문화공간",
      address: "33 Hyoja-ro, Jongno-gu, Seoul",
      addressKo: "서울시 종로구 효자로 33",
      lat: 37.5786,
      lng: 126.9725,
      landmarkDistanceDesc: "Directly opposite Gyeongbokgung West Gate (Yeongchumun)"
    },
    pricing: {
      krw: 35000,
      usd: 27
    },
    durationMinutes: 75,
    rating: 4.92,
    reviewCount: 94,
    audioDocent: {
      title: "1-Min Boan 1942 Avant-Garde Literature & Art Tour",
      duration: "0:50",
      transcript: "Standing before Boan Inn, built in 1936. This building welcomed Korea's greatest twentieth-century poets and artists who gathered in secret to write and paint."
    },
    reviews: [
      {
        id: "rev-3-1",
        author: "Jean-Paul Sartre",
        country: "🇫🇷 Paris, France",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
        rating: 5,
        date: "4 days ago",
        text: "Fascinating blend of old architecture and cutting-edge contemporary art. The rooftop view of the palace wall at twilight was breathtaking.",
        photo: "https://images.unsplash.com/photo-1545987796-200677ee1011?w=400"
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1545987796-200677ee1011?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&auto=format&fit=crop&q=80"
    ],
    nextAvailableSlot: "Today 17:00",
    slots: [
      { id: "s3-1", time: "14:30", available: 8, max: 10 },
      { id: "s3-2", time: "17:00", available: 6, max: 10 }
    ],
    summary: "Discover Korea's modern literature & avant-garde art history at Boan Inn, where famous poets gathered since 1936. Exclusive curator tour with rooftop sunset drink.",
    summaryKo: "1936년부터 시인과 예술가들의 아지트였던 보안여관에서 현대미술 전시와 루프탑 전망을 즐기는 큐레이터 동행 투어입니다.",
    inclusions: ["Exclusive Gallery Entry", "Curator Audio System", "Rooftop Herbal Tea / Drink", "Exhibition Poster"],
    badge: "🏛️ Cultural Landmark",
    featured: false
  },
  {
    id: "prog-4",
    title: "Handcrafted Korean Stone Seal (Dojang) & Calligraphy Studio",
    titleKo: "수제 자연석 전각 도장 조각 & 한글 서예 각인 클래스",
    category: "making", // 제작
    categoryLabel: "Making (제작)",
    categoryIcon: "✍️",
    host: {
      name: "Artist Hyeon-jo Lee",
      role: "Traditional Seal Engraver",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      languages: ["English", "Korean"]
    },
    location: {
      name: "Seochon Moon Stone Seal Studio",
      nameKo: "서촌 달빛 전각 도장 연구소",
      address: "12 Jahamun-ro 5-gil, Jongno-gu, Seoul",
      addressKo: "서울시 종로구 자하문로5길 12",
      lat: 37.5791,
      lng: 126.9712,
      landmarkDistanceDesc: "2 min from Gyeongbokgung Exit 2"
    },
    pricing: {
      krw: 55000,
      usd: 42
    },
    durationMinutes: 90,
    rating: 4.99,
    reviewCount: 312,
    audioDocent: {
      title: "1-Min Royal Stone Seal Carving Introduction",
      duration: "0:48",
      transcript: "In Korea, personal stone seals carry deep spiritual energy and identity. Today, Master Lee will translate your name into Hangul calligraphy and guide your chisel strokes."
    },
    reviews: [
      {
        id: "rev-4-1",
        author: "David Miller",
        country: "🇦🇺 Sydney, Australia",
        avatar: "avatar_art.jpg",
        rating: 5,
        date: "Yesterday",
        text: "The best souvenir from my entire Asia trip! Stamping my Hangul name in red ink on mulberry paper felt so authentic.",
        photo: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400"
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80"
    ],
    nextAvailableSlot: "Today 15:00",
    slots: [
      { id: "s4-1", time: "11:30", available: 2, max: 6 },
      { id: "s4-2", time: "15:00", available: 4, max: 6 },
      { id: "s4-3", time: "17:30", available: 5, max: 6 }
    ],
    summary: "Translate your name into graceful Korean Hangul and hand-carve it into a natural colored stone seal. Stamped on traditional Hanji paper inside a velvet silk pouch.",
    summaryKo: "자신의 영문 이름을 한글로 변환하여 자연석에 직접 칼로 새겨 넣는 나만의 전통 수제 도장 만들기 클래스입니다.",
    inclusions: ["Natural Stone Block", "Engraving Chisels & Safety Gear", "Red Seal Ink Pad", "Handmade Silk Pouch", "Hangul Name Calligraphy Card"],
    badge: "🎁 Great Souvenir",
    featured: true
  },
  {
    id: "prog-5",
    title: "Seochon Artisanal Makgeolli & Fermented Pairing Salon",
    titleKo: "서촌 골목 프리미엄 전통주 5종 테이스팅 & 계절 안주 살롱",
    category: "experience", // 경험
    categoryLabel: "Experience (경험)",
    categoryIcon: "🍶",
    host: {
      name: "Sommelier Jin-hyuk Choi",
      role: "Traditional Brewery Sommelier",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
      languages: ["English", "Korean"]
    },
    location: {
      name: "Tongui Sulbang Traditional Cellar",
      nameKo: "통의동 술방 살롱",
      address: "8 Changseong-dong, Jongno-gu, Seoul",
      addressKo: "서울시 종로구 창성동 8",
      lat: 37.5815,
      lng: 126.9718,
      landmarkDistanceDesc: "Across from Blue House sarangchae"
    },
    pricing: {
      krw: 52000,
      usd: 39
    },
    durationMinutes: 90,
    rating: 4.95,
    reviewCount: 167,
    audioDocent: {
      title: "1-Min Korean Artisanal Rice Wine Fermentation Story",
      duration: "0:55",
      transcript: "Makgeolli is Korea's oldest fermented drink, alive with natural yeast and probiotics. Tonight, savor five artisanal small-batch bottles paired with Seochon market seasonal treats."
    },
    reviews: [
      {
        id: "rev-5-1",
        author: "Marco Rossi",
        country: "🇮🇹 Rome, Italy",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        rating: 5,
        date: "6 days ago",
        text: "Incredible sommelier! I never knew Korean traditional rice wines could have such complex fruity and floral tasting notes.",
        photo: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400"
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80"
    ],
    nextAvailableSlot: "Today 18:00",
    slots: [
      { id: "s5-1", time: "18:00", available: 3, max: 8 },
      { id: "s5-2", time: "20:00", available: 6, max: 8 }
    ],
    summary: "Taste 5 rare small-batch Korean artisanal makgeolli and Yakju rice wines. Learn fermentation history paired with Seochon market chef's seasonal delicacies.",
    summaryKo: "소규모 양조장의 프리미엄 전통주 5종과 서촌 제철 식재료로 만든 안주를 즐기며 한국의 발효 문화를 나누는 미식 경험입니다.",
    inclusions: ["5 Artisanal Rice Wine Tastings", "Gourmet Seochon Banchan Board", "Tasting Note Card", "Mini souvenir bottle"],
    badge: "✨ Evening Special",
    featured: false
  },
  {
    id: "prog-6",
    title: "Traditional Mother-of-Pearl (Najeonchilgi) Craft Atelier",
    titleKo: "영롱한 천연 자개(나전칠기) 소반 트레이 & 텀블러 제작",
    category: "making", // 제작
    categoryLabel: "Making (제작)",
    categoryIcon: "✨",
    host: {
      name: "Master Artisan Yeo-jin Shin",
      role: "Intangible Cultural Heritage Trainee",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      languages: ["English", "Korean", "Mandarin"]
    },
    location: {
      name: "Shimmering Shell Studio Tongin",
      nameKo: "통인동 빛나는자개 아틀리에",
      address: "15 Tongin-dong, Jongno-gu, Seoul",
      addressKo: "서울시 종로구 통인동 15",
      lat: 37.5808,
      lng: 126.9685,
      landmarkDistanceDesc: "Inside Tongin Historic Alley"
    },
    pricing: {
      krw: 62000,
      usd: 48
    },
    durationMinutes: 100,
    rating: 4.97,
    reviewCount: 184,
    audioDocent: {
      title: "1-Min Thousand-Year Royal Mother-of-Pearl Craft",
      duration: "0:52",
      transcript: "Najeonchilgi is Korea's iridescent lacquerware crafted from real abalone shell. Arrange shimmering shell flakes to create your royal tea tray."
    },
    reviews: [
      {
        id: "rev-6-1",
        author: "Yuki Tanaka",
        country: "🇯🇵 Tokyo, Japan",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
        rating: 5,
        date: "1 week ago",
        text: "The mother-of-pearl tray sparkles in natural sunlight! Master Yeo-jin gave very clear and kind English instructions.",
        photo: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400"
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
    ],
    nextAvailableSlot: "Today 16:30",
    slots: [
      { id: "s6-1", time: "14:00", available: 1, max: 6 },
      { id: "s6-2", time: "16:30", available: 4, max: 6 },
      { id: "s6-3", time: "19:00", available: 6, max: 6 }
    ],
    summary: "Create an iridescent Korean lacquerware tray or hand-held mirror using real abalone mother-of-pearl flakes. A timeless Royal craft you take home immediately.",
    summaryKo: "천연 전복 껍데기로 만든 영롱한 자개를 섬세하게 배치하여 나만의 나전칠기 소반 트레이 또는 손거울을 제작하는 예술 공예입니다.",
    inclusions: ["Natural Abalone Mother-of-Pearl Pieces", "Wooden Tray or Compact Mirror", "UV Resin & Polishing Tools", "Luxury Gift Box"],
    badge: "💎 Best Seller",
    featured: true
  },
  {
    id: "prog-7",
    title: "Suseongdong Valley & Poet Yun Dong-ju Twilight Walk",
    titleKo: "인왕산 수성동 계곡 & 시인 윤동주 발자취 황혼 힐링 산책",
    category: "experience", // 경험
    categoryLabel: "Experience (경험)",
    categoryIcon: "🚶",
    host: {
      name: "Storyteller David Han",
      role: "Seochon Heritage Guide",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      languages: ["English", "Korean"]
    },
    location: {
      name: "Suseongdong Valley Pavillion",
      nameKo: "옥인동 수성동 계곡 입구",
      address: "185-3 Ogin-dong, Jongno-gu, Seoul",
      addressKo: "서울시 종로구 옥인동 185-3",
      lat: 37.5826,
      lng: 126.9654,
      landmarkDistanceDesc: "Foot of Mt. Inwangsan, end of Seochon Village"
    },
    pricing: {
      krw: 30000,
      usd: 23
    },
    durationMinutes: 90,
    rating: 4.94,
    reviewCount: 128,
    audioDocent: {
      title: "1-Min Inwangsan Mountain Twilight Poetry Walk",
      duration: "0:54",
      transcript: "Listen to the murmuring mountain stream flowing under Girin Bridge. Painted by master Jeong Seon in the Joseon dynasty, this valley inspired poets for generations."
    },
    reviews: [
      {
        id: "rev-7-1",
        author: "Oliver Schmidt",
        country: "🇩🇪 Berlin, Germany",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        rating: 5,
        date: "1 week ago",
        text: "The sunset over Mt. Inwangsan was magical. David shared poetic stories of old Seoul that you won't find in any standard guidebook.",
        photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400"
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80"
    ],
    nextAvailableSlot: "Today 17:30",
    slots: [
      { id: "s7-1", time: "10:00", available: 10, max: 12 },
      { id: "s7-2", time: "17:30", available: 5, max: 12 }
    ],
    summary: "Stroll along scenic Inwangsan mountain streams depicted in Joseon dynasty landscape paintings. Listen to timeless poems written by Yun Dong-ju as golden hour illuminates Seoul.",
    summaryKo: "겸재 정선의 진경산수화 배경인 수성동 계곡을 거닐며 서촌을 사랑한 시인들의 문학과 아름다운 노을을 감상하는 투어입니다.",
    inclusions: ["English Local Historian Guide", "Poetry Booklet & Postcards", "Organic Iced Omija Tea", "Inwangsan Photo Session"],
    badge: "🌿 Nature & History",
    featured: false
  },
  {
    id: "prog-8",
    title: "Hanok Woodblock Printmaking & Folk Painting (Minhwa)",
    titleKo: "전통 민화 부적 족자 & 목판화 판화 프레스 제작 아틀리에",
    category: "making", // 제작
    categoryLabel: "Making (제작)",
    categoryIcon: "🖌️",
    host: {
      name: "Artist Soo-bin Jung",
      role: "Traditional Korean Folk Painter",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
      languages: ["English", "Korean"]
    },
    location: {
      name: "Ogin Forest Minhwa Studio",
      nameKo: "옥인동 숲속 민화 공방",
      address: "42 Ogin-gil, Jongno-gu, Seoul",
      addressKo: "서울시 종로구 옥인길 42",
      lat: 37.5831,
      lng: 126.9682,
      landmarkDistanceDesc: "Near Suseongdong alleyway"
    },
    pricing: {
      krw: 58000,
      usd: 44
    },
    durationMinutes: 100,
    rating: 4.96,
    reviewCount: 153,
    audioDocent: {
      title: "1-Min Folk Art Minhwa & Auspicious Symbols Guide",
      duration: "0:49",
      transcript: "Korean folk painting Minhwa brings good fortune, health, and joy into the home. Learn how to press woodblocks on mulberry Hanji paper."
    },
    reviews: [
      {
        id: "rev-8-1",
        author: "Camila Fernandez",
        country: "🇪🇸 Madrid, Spain",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
        rating: 5,
        date: "2 weeks ago",
        text: "The tiger and magpie scroll I created is now hanging proudly in my living room. An unforgettable hands-on art workshop!",
        photo: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400"
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1460661419200-fd4358377982?w=800&auto=format&fit=crop&q=80"
    ],
    nextAvailableSlot: "Today 16:00",
    slots: [
      { id: "s8-1", time: "11:00", available: 3, max: 6 },
      { id: "s8-2", time: "16:00", available: 2, max: 6 }
    ],
    summary: "Hand-print traditional Korean tiger & magpie auspicious folk symbols onto Mulberry Hanji paper using carved woodblocks and mineral colors on a hanging scroll.",
    summaryKo: "까치와 호랑이, 연꽃 등 복을 부르는 한국 전통 민화를 닥나무 한지 족자에 채색 및 판화로 완성해보는 원데이 아트 클래스입니다.",
    inclusions: ["Mulberry Hanji Scroll", "Mineral Pigments & Brushes", "Handcrafted Wooden Stamp Block", "Protective Scroll Tube"],
    badge: "🐯 Traditional Art",
    featured: false
  }
];

export const SEOCHON_SIMULATION_POINTS = [
  {
    id: "loc-gyeongbok-stn",
    name: "Gyeongbokgung Stn (Exit 2)",
    nameKo: "경복궁역 2번 출구 (서촌 입구)",
    lat: 37.5759,
    lng: 126.9734,
    description: "Main subway gateway to Seochon"
  },
  {
    id: "loc-tongin-market",
    name: "Tongin Traditional Market",
    nameKo: "통인시장 정문",
    lat: 37.5804,
    lng: 126.9701,
    description: "Heart of Seochon, lively street food & crafts"
  },
  {
    id: "loc-boan1942",
    name: "Boan 1942 / Yeongchumun Gate",
    nameKo: "보안1942 & 경복궁 영추문 앞",
    lat: 37.5786,
    lng: 126.9725,
    description: "Historic arts & cultural corridor"
  },
  {
    id: "loc-suseongdong",
    name: "Suseongdong Valley Entrance",
    nameKo: "수성동 계곡 입구",
    lat: 37.5826,
    lng: 126.9654,
    description: "Picturesque hillside under Mt. Inwangsan"
  },
  {
    id: "loc-jahamun-cafe",
    name: "Jahamun-ro Heritage Alley",
    nameKo: "자하문로 한옥 카페 골목",
    lat: 37.5795,
    lng: 126.9715,
    description: "Cozy Hanok cafes, tea houses and studios"
  }
];

export const HANGUL_NAME_SAMPLES = {
  "Alex": { ko: "알렉스", hanja: "雅樂斯", meaning: "Graceful Melody & Harmony" },
  "Emma": { ko: "엠마", hanja: "慧馬", meaning: "Wisdom & Forward Journey" },
  "David": { ko: "데이비드", hanja: "大義得", meaning: "Great Virtue & Righteousness" },
  "Chloe": { ko: "클로이", hanja: "花利", meaning: "Blooming Flower of Prosperity" },
  "Liam": { ko: "리암", hanja: "理岩", meaning: "Wise Reason as Solid as Rock" },
  "Sophia": { ko: "소피아", hanja: "素美雅", meaning: "Purity, Beauty & Elegance" },
  "Michael": { ko: "마이클", hanja: "明仁", meaning: "Luminous Compassion" }
};

export const STAMP_TOUR_DATA = [
  {
    id: "stamp-1",
    title: "Nuha-dong Hanok Stamp",
    titleKo: "누하동 다도 도장",
    icon: "🍵",
    status: "unlocked",
    earnedAt: "Today 10:15"
  },
  {
    id: "stamp-2",
    title: "Tongui Royal Seal Stamp",
    titleKo: "통의동 전각 도장",
    icon: "✍️",
    status: "unlocked",
    earnedAt: "Today 14:20"
  },
  {
    id: "stamp-3",
    title: "Ogin Ceramic Pottery Stamp",
    titleKo: "옥인동 백자 도장",
    icon: "🏺",
    status: "unlocked",
    requirement: "Book 1 Making Workshop"
  },
  {
    id: "stamp-4",
    title: "Suseongdong Nature Walk Stamp",
    titleKo: "수성동 계곡 산책 도장",
    icon: "🚶",
    status: "locked",
    requirement: "Walk 500m in Seochon"
  }
];
