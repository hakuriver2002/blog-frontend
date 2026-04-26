export type Category = "Kumite" | "Kata" | "Kihon" | "Bunkai" | "Giải Đấu" | "Võ Sĩ";

export interface Article {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    body: string[];
    category: Category;
    author: string;
    authorAvatar: string;
    authorBio: string;
    readTime: string;
    publishedAt: string;
    image: string;
    featured?: boolean;
    trending?: boolean;
    tags: string[];
    color: string;
    views: number;
    likes: number;
}

export const articles: Article[] = [
    {
        id: 1,
        slug: "hoang-ngan-huyen-thoai-kata",
        title: "Nguyễn Hoàng Ngân - Huyền Thoại Kata Việt Nam",
        excerpt: "Nữ hoàng Kata Nguyễn Hoàng Ngân với những cống hiến không mệt mỏi cho Karatedo nước nhà.",
        body: [
            "Nguyễn Hoàng Ngân được mệnh danh là 'Nữ hoàng Kata' của Karatedo Việt Nam. Cô đã mang về vô số huy chương vàng từ SEA Games, ASIAD cho đến giải Vô địch thế giới.",
            "Trong những bài biểu diễn Kata của mình, Hoàng Ngân luôn thể hiện được sự uyển chuyển, mạnh mẽ và thần thái tuyệt vời, khiến bạn bè quốc tế phải nể phục.",
            "Hiện tại, dù đã lùi về công tác huấn luyện, những di sản cô để lại vẫn là nguồn cảm hứng lớn lao cho các thế hệ võ sĩ trẻ."
        ],
        category: "Kata",
        author: "Võ Sư Hùng",
        authorAvatar: "VSH",
        authorBio: "Huấn luyện viên Karatedo với 20 năm kinh nghiệm.",
        readTime: "5 phút",
        publishedAt: "23/04/2026",
        image: "🥋",
        featured: true,
        trending: true,
        tags: ["Hoàng Ngân", "Kata", "Huyền thoại"],
        color: "var(--color-mokoto-main)",
        views: 142500,
        likes: 8340,
    },
    {
        id: 2,
        slug: "ky-thuat-kumite-nang-cao",
        title: "Kỹ Thuật Kumite: Chiến Thuật Phản Công Chớp Nhoáng",
        excerpt: "Phân tích chiến thuật phản công Sen-no-Sen và Go-no-Sen trong thi đấu đối kháng Kumite.",
        body: [
            "Trong Kumite, phản công không chỉ là phòng thủ mà còn là nghệ thuật chọn thời điểm. Sen-no-Sen (tiên phát chế nhân) đòi hỏi sự tinh tế và tốc độ xuất thần.",
            "Bài viết này sẽ đi sâu vào cách luyện tập phản xạ, chọn thời điểm bắt nhịp đối thủ và tung ra đòn Gyaku Tsuki quyết định."
        ],
        category: "Kumite",
        author: "Thầy Bình",
        authorAvatar: "TB",
        authorBio: "Trọng tài cấp quốc gia, cựu vô địch Kumite toàn quốc.",
        readTime: "7 phút",
        publishedAt: "22/04/2026",
        image: "🥊",
        featured: true,
        trending: true,
        tags: ["Kumite", "Chiến thuật", "Tsuki"],
        color: "var(--color-mokoto-main)",
        views: 98700,
        likes: 6120,
    },
    {
        id: 3,
        slug: "giai-vo-dich-karatedo-quoc-gia-2026",
        title: "Khai Mạc Giải Vô Địch Karatedo Quốc Gia 2026 Tại Đà Nẵng",
        excerpt: "Hàng trăm võ sĩ từ khắp các tỉnh thành hội tụ về Đà Nẵng để tranh tài tại giải đấu danh giá nhất trong năm.",
        body: [
            "Hôm nay, Giải Vô địch Karatedo Quốc gia 2026 đã chính thức khai mạc tại Cung Thể thao Tiên Sơn, Đà Nẵng.",
            "Giải đấu năm nay thu hút kỷ lục 500 vận động viên tham gia ở cả hai nội dung Kata và Kumite."
        ],
        category: "Giải Đấu",
        author: "Phóng Viên Thể Thao",
        authorAvatar: "PV",
        authorBio: "Đưa tin trực tiếp từ các sự kiện thể thao võ thuật.",
        readTime: "6 phút",
        publishedAt: "20/04/2026",
        image: "🏅",
        featured: true,
        trending: true,
        tags: ["Quốc gia", "Giải đấu", "Đà Nẵng"],
        color: "#1A56E8",
        views: 76300,
        likes: 4890,
    },
    {
        id: 4,
        slug: "ban-chat-cua-kihon",
        title: "Kihon: Nền Tảng Cốt Lõi Của Mọi Kỹ Thuật",
        excerpt: "Tại sao việc lặp đi lặp lại các động tác cơ bản lại quan trọng đến thế trong Karatedo?",
        body: [
            "Kihon (Cơ bản) là linh hồn của Karatedo. Một cú đấm mạnh không sinh ra từ cơ bắp, mà sinh ra từ sự chuẩn xác của Kihon.",
            "Từ tư thế tấn (Zenkutsu Dachi) đến cách xoay hông, tất cả đều phải đạt đến độ hoàn hảo."
        ],
        category: "Kihon",
        author: "Sensei Taro",
        authorAvatar: "ST",
        authorBio: "Chuyên gia Karatedo Nhật Bản.",
        readTime: "4 phút",
        publishedAt: "18/04/2026",
        image: "👊",
        featured: false,
        trending: false,
        tags: ["Kihon", "Căn bản", "Tập luyện"],
        color: "var(--color-mokoto-black)",
        views: 54200,
        likes: 3210,
    },
    {
        id: 5,
        slug: "y-nghia-cua-bunkai",
        title: "Bunkai: Giải Mã Các Ứng Dụng Thực Chiến Trong Kata",
        excerpt: "Kata không chỉ là múa võ, Bunkai giúp chúng ta hiểu được tính thực chiến tàn khốc ẩn sau mỗi động tác.",
        body: [
            "Mỗi động tác trong Kata đều mang một ý nghĩa tự vệ thực tế. Bunkai chính là quá trình 'phân tích' và áp dụng những kỹ thuật đó vào tình huống chiến đấu thật."
        ],
        category: "Bunkai",
        author: "Lê Minh",
        authorAvatar: "LM",
        authorBio: "Nghiên cứu sinh võ thuật cổ truyền.",
        readTime: "8 phút",
        publishedAt: "15/04/2026",
        image: "🥋",
        featured: false,
        trending: false,
        tags: ["Bunkai", "Kata", "Thực chiến"],
        color: "#00C46A",
        views: 215000,
        likes: 18700,
    }
];

export const liveScores = [
    { home: "Hà Nội", away: "TP.HCM", score: "3 - 2", sport: "🥊", status: "Kumite - Chung kết" },
    { home: "Quân Đội", away: "Thanh Hóa", score: "24.5 - 23.8", sport: "🥋", status: "Kata Đồng Đội" },
];

export const upcomingMatches = [
    { home: "Đà Nẵng", away: "Bình Dương", time: "Hôm nay 14:00", sport: "🥊", league: "Giải Quốc Gia", color: "var(--color-mokoto-main)" },
    { home: "Việt Nam", away: "Thái Lan", time: "Ngày mai 09:30", sport: "🥋", league: "SEA Games", color: "#F59E0B" },
];

export const categories: { name: Category; icon: string; color: string; count: number }[] = [
    { name: "Kumite", icon: "🥊", color: "var(--color-mokoto-main)", count: 142 },
    { name: "Kata", icon: "🥋", color: "#1A56E8", count: 87 },
    { name: "Kihon", icon: "👊", color: "var(--color-mokoto-black)", count: 64 },
    { name: "Bunkai", icon: "📚", color: "#00C46A", count: 53 },
    { name: "Giải Đấu", icon: "🏅", color: "#F59E0B", count: 38 },
];

export const polls = [
    {
        id: 1,
        question: "Kỹ thuật nào bạn thấy khó hoàn thiện nhất?",
        options: [
            { label: "Mawashi Geri", votes: 3420, color: "var(--color-mokoto-main)" },
            { label: "Ura Mawashi", votes: 2810, color: "var(--color-mokoto-black)" },
            { label: "Gyaku Tsuki", votes: 2290, color: "#E8320A" },
            { label: "Yoko Geri", votes: 1540, color: "#1A56E8" },
        ],
    },
];

export const highlights = [
    { title: "Chung Kết Kumite Nghẹt Thở", duration: "2:34", sport: "🥊", views: "4.2M", thumb: "var(--color-mokoto-main)" },
    { title: "Bài Unsu Hoàn Hảo", duration: "1:52", sport: "🥋", views: "3.8M", thumb: "var(--color-mokoto-black)" },
];
