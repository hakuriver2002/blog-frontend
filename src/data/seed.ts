export type Category = "Bóng Đá" | "Bóng Rổ" | "Tennis" | "F1" | "Thể Thao" | "Olympic";

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
        slug: "ronaldo-lap-ki-luc-100-ban-thang",
        title: "Ronaldo Phá Vỡ Kỷ Lục 100 Bàn Thắng Tại Saudi Pro League",
        excerpt: "Siêu sao người Bồ Đào Nha tiếp tục chứng minh đẳng cấp vượt thời gian với cú đúp lịch sử trong trận đấu tối qua tại Riyadh.",
        body: [
            "Cristiano Ronaldo một lần nữa viết tên mình vào lịch sử bóng đá thế giới khi ghi bàn thắng thứ 100 tại Saudi Pro League, trở thành cầu thủ đầu tiên đạt cột mốc này tại giải đấu còn non trẻ của Ả Rập Xê Út.",
            "Trong trận đấu với Al-Shabab, CR7 ghi cú đúp để đưa Al-Nassr giành chiến thắng 3-1, đồng thời xác lập kỷ lục bàn thắng ở Saudi Pro League. Đây là minh chứng rõ ràng nhất cho phong độ không tuổi của cầu thủ 41 tuổi.",
            "HLV Luis Castro chia sẻ: 'Ronaldo không chỉ là một cầu thủ, anh ấy là nguồn cảm hứng cho cả đội bóng. Kỷ lục 100 bàn chỉ là con số, nhưng sự cống hiến của anh ấy vô giá.'",
        ],
        category: "Bóng Đá",
        author: "Minh Tuấn",
        authorAvatar: "MT",
        authorBio: "Phóng viên thể thao với 12 năm kinh nghiệm, chuyên theo dõi bóng đá Châu Âu và Trung Đông.",
        readTime: "5 phút",
        publishedAt: "31/03/2026",
        image: "⚽",
        featured: true,
        trending: true,
        tags: ["Ronaldo", "Saudi League", "Kỷ lục"],
        color: "#1A56E8",
        views: 142500,
        likes: 8340,
    },
    {
        id: 2,
        slug: "lakers-vao-chung-ket-nba-2026",
        title: "LA Lakers Giành Suất Chung Kết NBA 2026 Sau Loạt Hiệp Phụ Nghẹt Thở",
        excerpt: "LeBron James ghi 45 điểm để đưa Lakers vào chung kết sau 7 game căng thẳng trước Boston Celtics.",
        body: [
            "Trận đấu Game 7 giữa LA Lakers và Boston Celtics tại TD Garden đã kết thúc sau 3 hiệp phụ với chiến thắng nghẹt thở 118-115 nghiêng về phía Los Angeles.",
            "LeBron James với 45 điểm, 12 kiến tạo, và 9 rebounds đã thể hiện màn trình diễn 'God Mode' thực sự. Cú ném 3 điểm quyết định của anh ở giây thứ 8 còn lại của hiệp phụ thứ 3 sẽ mãi đi vào lịch sử NBA.",
            "Anthony Davis cũng có một đêm đáng nhớ với 38 điểm và 15 rebounds, tạo nên bộ đôi quyền năng nhất playoffs năm nay.",
        ],
        category: "Bóng Rổ",
        author: "Hoàng Long",
        authorAvatar: "HL",
        authorBio: "Chuyên gia phân tích NBA, từng làm việc tại ESPN Đông Nam Á.",
        readTime: "7 phút",
        publishedAt: "30/03/2026",
        image: "🏀",
        featured: true,
        trending: true,
        tags: ["NBA", "Lakers", "LeBron"],
        color: "#E8320A",
        views: 98700,
        likes: 6120,
    },
    {
        id: 3,
        slug: "djokovic-vo-dich-roland-garros-2026",
        title: "Djokovic Đăng Quang Roland Garros Lần Thứ 4, Xô Đổ Mọi Thống Kê",
        excerpt: "Tay vợt Serbia huyền thoại viết thêm trang sử mới khi giành Grand Slam thứ 28 trong sự nghiệp.",
        body: [
            "Novak Djokovic đã bảo vệ thành công danh hiệu Roland Garros với chiến thắng 6-3, 7-5, 6-4 trước Carlos Alcaraz trong một trận chung kết đầy kịch tính tại Paris.",
            "Đây là Grand Slam thứ 28 trong sự nghiệp huy hoàng của Djokovic, một con số tưởng chừng như không thể vượt qua trong nhiều thập kỷ tới.",
        ],
        category: "Tennis",
        author: "Thu Hà",
        authorAvatar: "TH",
        authorBio: "Chuyên gia tennis, từng thi đấu chuyên nghiệp ở cấp độ WTA.",
        readTime: "6 phút",
        publishedAt: "29/03/2026",
        image: "🎾",
        featured: false,
        trending: true,
        tags: ["Tennis", "Roland Garros", "Djokovic"],
        color: "#00C46A",
        views: 76300,
        likes: 4890,
    },
    {
        id: 4,
        slug: "verstappen-vo-dich-f1-bahrain-gp",
        title: "Verstappen Thống Trị Bahrain GP, Red Bull Tiếp Tục Chuỗi Bất Bại",
        excerpt: "Max Verstappen giành pole to pole tại Bahrain, củng cố vị trí dẫn đầu bảng xếp hạng với 25 điểm tuyệt đối.",
        body: [
            "Max Verstappen tiếp tục màn trình diễn thống trị tại Bahrain Grand Prix, kiểm soát cuộc đua từ đầu đến cuối để giành chiến thắng pole-to-pole thứ ba liên tiếp của mùa giải.",
            "Red Bull Racing ghi dấu ấn với chiến lược pit stop hoàn hảo, giúp Verstappen duy trì khoảng cách an toàn trước Lando Norris (McLaren) và Charles Leclerc (Ferrari).",
        ],
        category: "F1",
        author: "Quốc Bảo",
        authorAvatar: "QB",
        authorBio: "Phóng viên F1 toàn cầu, bám sát các giải đấu khắp 3 châu lục.",
        readTime: "4 phút",
        publishedAt: "28/03/2026",
        image: "🏎️",
        featured: false,
        trending: false,
        tags: ["F1", "Verstappen", "Red Bull"],
        color: "#7C3AED",
        views: 54200,
        likes: 3210,
    },
    {
        id: 5,
        slug: "viet-nam-vao-ban-ket-asiad-bong-da",
        title: "U23 Việt Nam Tạo Địa Chấn, Hạ Nhật Bản Tại Tứ Kết ASIAD",
        excerpt: "Những chiến binh trẻ của HLV Troussier lại khiến cả Đông Nam Á phải ngưỡng mộ với màn trình diễn xuất sắc.",
        body: [
            "U23 Việt Nam đã viết nên trang sử vàng mới khi đánh bại U23 Nhật Bản 2-1 trong trận tứ kết ASIAD 2026 tại Hàng Châu, Trung Quốc.",
            "Bàn thắng quyết định của Nguyễn Xuân Hoàng ở phút bù giờ thứ 3 đã làm bùng nổ cả một thế hệ người hâm mộ bóng đá Việt Nam.",
        ],
        category: "Bóng Đá",
        author: "Văn Khoa",
        authorAvatar: "VK",
        authorBio: "Bình luận viên bóng đá nổi tiếng, chuyên theo dõi các đội tuyển Đông Nam Á.",
        readTime: "8 phút",
        publishedAt: "27/03/2026",
        image: "🇻🇳",
        featured: true,
        trending: true,
        tags: ["U23 Việt Nam", "ASIAD", "Bóng đá"],
        color: "#E8320A",
        views: 215000,
        likes: 18700,
    },
    {
        id: 6,
        slug: "olympic-paris-2026-lich-thi-dau",
        title: "Lịch Thi Đấu Olympic Paris 2026 – Những Môn Nên Theo Dõi Nhất",
        excerpt: "Từ điền kinh đến bơi lội, đây là những nội dung hứa hẹn tạo ra nhiều màn so tài đỉnh cao nhất.",
        body: [
            "Olympic Paris 2026 đang đến gần với 329 nội dung tranh tài trên 32 môn thể thao. Ban tổ chức đã công bố lịch thi đấu chi tiết, trong đó điền kinh và bơi lội sẽ là hai môn thu hút nhiều khán giả nhất.",
        ],
        category: "Olympic",
        author: "Phương Linh",
        authorAvatar: "PL",
        authorBio: "Phóng viên thể thao quốc tế, chuyên về các sự kiện thể thao đa môn.",
        readTime: "10 phút",
        publishedAt: "26/03/2026",
        image: "🏅",
        featured: false,
        trending: false,
        tags: ["Olympic", "Paris", "Lịch thi đấu"],
        color: "#F59E0B",
        views: 43100,
        likes: 2980,
    },
    {
        id: 7,
        slug: "messi-tro-lai-barcelona",
        title: "CHÍNH THỨC: Messi Ký Hợp Đồng Trở Về Barcelona Mùa Hè 2026",
        excerpt: "Cú sốc chuyển nhượng lớn nhất thập kỷ. Câu lạc bộ xứ Catalan chính thức thông báo Messi sẽ mặc áo số 10.",
        body: [
            "Lionel Messi chính thức trở lại Camp Nou trong thương vụ chuyển nhượng gây chấn động làng bóng đá thế giới. Siêu sao người Argentina đã ký hợp đồng 2 năm với Barcelona với mức lương được giữ bí mật.",
            "Chủ tịch Joan Laporta phát biểu tại buổi họp báo: 'Đây là ngày lịch sử của Barcelona. Leo đã trở về nhà.'",
        ],
        category: "Bóng Đá",
        author: "Duy Anh",
        authorAvatar: "DA",
        authorBio: "Phóng viên chuyên chuyển nhượng, bám sát thị trường La Liga và Serie A.",
        readTime: "6 phút",
        publishedAt: "25/03/2026",
        image: "✨",
        featured: false,
        trending: true,
        tags: ["Messi", "Barcelona", "Chuyển nhượng"],
        color: "#1A56E8",
        views: 387000,
        likes: 24500,
    },
    {
        id: 8,
        slug: "stephen-curry-season-record-three-point",
        title: "Stephen Curry Phá Kỷ Lục Ném 3 Điểm Trong Một Mùa Giải NBA",
        excerpt: "Chef Curry đã thực hiện cú ném 3 điểm thứ 420 trong mùa giải, vượt mặt chính mình năm 2016.",
        body: [
            "Stephen Curry tiếp tục viết lại lịch sử NBA khi ghi cú ném 3 điểm thứ 420 trong mùa giải 2025-26, phá vỡ kỷ lục chính anh lập từ năm 2015-16.",
        ],
        category: "Bóng Rổ",
        author: "Trọng Nghĩa",
        authorAvatar: "TN",
        authorBio: "Chuyên gia phân tích thống kê NBA, cộng tác với nhiều trang thể thao lớn.",
        readTime: "5 phút",
        publishedAt: "24/03/2026",
        image: "🏀",
        featured: false,
        trending: false,
        tags: ["NBA", "Curry", "Kỷ lục"],
        color: "#F59E0B",
        views: 61400,
        likes: 4120,
    },
    {
        id: 9,
        slug: "carlos-alcaraz-wimbledon-2026",
        title: "Alcaraz Vô Địch Wimbledon Lần Thứ 3 Liên Tiếp Ở Tuổi 23",
        excerpt: "Tay vợt Tây Ban Nha tiếp tục thống trị mặt cỏ xanh với phong cách tấn công đẹp mắt và mãnh liệt.",
        body: [
            "Carlos Alcaraz đã bảo vệ thành công danh hiệu Wimbledon lần thứ ba liên tiếp, trở thành tay vợt trẻ nhất trong lịch sử làm được điều này.",
        ],
        category: "Tennis",
        author: "Thu Hà",
        authorAvatar: "TH",
        authorBio: "Chuyên gia tennis, từng thi đấu chuyên nghiệp ở cấp độ WTA.",
        readTime: "6 phút",
        publishedAt: "23/03/2026",
        image: "🎾",
        featured: false,
        trending: false,
        tags: ["Tennis", "Wimbledon", "Alcaraz"],
        color: "#00C46A",
        views: 49800,
        likes: 3670,
    },
];

export const liveScores = [
    { home: "Man City", away: "Arsenal", score: "2 - 1", sport: "⚽", status: "68'" },
    { home: "Lakers", away: "Warriors", score: "98 - 102", sport: "🏀", status: "Q4 3:24" },
    { home: "Novak D.", away: "Alcaraz", score: "6-4, 3-5", sport: "🎾", status: "Set 2" },
    { home: "Real", away: "Barça", score: "1 - 1", sport: "⚽", status: "82'" },
    { home: "Boston", away: "Miami", score: "87 - 91", sport: "🏀", status: "Q3 7:45" },
    { home: "Ferrari", away: "McLaren", score: "P2 / P3", sport: "🏎️", status: "Lap 38/57" },
];

export const upcomingMatches = [
    { home: "Liverpool", away: "Chelsea", time: "Hôm nay 22:00", sport: "⚽", league: "Premier League", color: "#E8320A" },
    { home: "Golden State", away: "Denver", time: "Ngày mai 10:30", sport: "🏀", league: "NBA Playoffs", color: "#F59E0B" },
    { home: "Sinner", away: "Medvedev", time: "Ngày mai 18:00", sport: "🎾", league: "ATP Monte-Carlo", color: "#00C46A" },
    { home: "Red Bull", away: "Ferrari", time: "02/04 20:00", sport: "🏎️", league: "F1 Saudi GP", color: "#7C3AED" },
    { home: "PSG", away: "Bayern", time: "03/04 03:00", sport: "⚽", league: "UCL Quarter", color: "#1A56E8" },
];

export const categories: { name: Category; icon: string; color: string; count: number }[] = [
    { name: "Bóng Đá", icon: "⚽", color: "#1A56E8", count: 142 },
    { name: "Bóng Rổ", icon: "🏀", color: "#E8320A", count: 87 },
    { name: "Tennis", icon: "🎾", color: "#00C46A", count: 64 },
    { name: "F1", icon: "🏎️", color: "#7C3AED", count: 53 },
    { name: "Olympic", icon: "🏅", color: "#F59E0B", count: 38 },
    { name: "Thể Thao", icon: "🏆", color: "#E8320A", count: 210 },
];

export const polls = [
    {
        id: 1,
        question: "Ai sẽ vô địch UEFA Champions League 2026?",
        options: [
            { label: "Real Madrid", votes: 3420, color: "#F59E0B" },
            { label: "Manchester City", votes: 2810, color: "#1A56E8" },
            { label: "Barcelona", votes: 2290, color: "#E8320A" },
            { label: "Bayern Munich", votes: 1540, color: "#7C3AED" },
        ],
    },
];

export const highlights = [
    { title: "Ronaldo – Bàn thắng thứ 100", duration: "2:34", sport: "⚽", views: "4.2M", thumb: "#1A56E8" },
    { title: "LeBron – Cú ném 3 điểm cuối", duration: "1:52", sport: "🏀", views: "3.8M", thumb: "#E8320A" },
    { title: "Verstappen – Bahrain Onboard", duration: "3:10", sport: "🏎️", views: "2.1M", thumb: "#7C3AED" },
    { title: "Djokovic – Match point magic", duration: "4:05", sport: "🎾", views: "1.9M", thumb: "#00C46A" },
];
