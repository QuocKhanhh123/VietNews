import Link from "next/link"
import { ArrowLeft, Users, Target, Award, Mail, Phone, MapPin, Globe, Shield, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Về trang chủ
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                <span className="text-primary">VietNews</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Nguồn tin tức đáng tin cậy, cập nhật nhanh chóng và chính xác nhất về Việt Nam và thế giới. Chúng tôi
                cam kết mang đến thông tin chất lượng cao cho cộng đồng.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>Tin tức 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Thông tin chính xác</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Cập nhật nhanh</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/AnhBia.png"
                alt="VietNews newsroom"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm opacity-90">Cập nhật tin tức</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-primary text-xl">
                <Target className="h-6 w-6" />
                Sứ Mệnh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src="/DoiNgu.jpg"
                alt="Đội ngũ VietNews"
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
              <p className="text-muted-foreground leading-relaxed">
                Mang đến cho độc giả những thông tin tin cậy, chính xác và kịp thời về các sự kiện quan trọng trong nước
                và quốc tế. Chúng tôi cam kết đưa tin khách quan, trung thực và có trách nhiệm với xã hội.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-primary text-xl">
                <Award className="h-6 w-6" />
                Tầm Nhìn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src="/TamNhinn.jpg"
                alt="Tầm nhìn công nghệ"
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
              <p className="text-muted-foreground leading-relaxed">
                Trở thành nền tảng tin tức hàng đầu Việt Nam, được độc giả tin tưởng và lựa chọn để cập nhật thông tin
                hàng ngày. Chúng tôi hướng tới việc ứng dụng công nghệ hiện đại để nâng cao trải nghiệm người dùng.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary text-2xl">
                  <Users className="h-7 w-7" />
                  Giới Thiệu VietNews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">VietNews</strong> được thành lập với mục tiêu trở thành nguồn
                  thông tin tin cậy và chất lượng cao cho cộng đồng người Việt. Chúng tôi tự hào là một trong những
                  trang tin tức trực tuyến phát triển nhanh nhất, với đội ngũ phóng viên và biên tập viên giàu kinh
                  nghiệm.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Với sự phát triển của công nghệ thông tin, chúng tôi không ngừng cải tiến và nâng cấp nền tảng để mang
                  đến trải nghiệm đọc tin tốt nhất. Website được thiết kế responsive, tối ưu cho mọi thiết bị từ desktop
                  đến mobile, đảm bảo người dùng có thể truy cập thông tin mọi lúc, mọi nơi.
                </p>

                <div>
                  <h4 className="font-semibold text-foreground mb-4">Các lĩnh vực chúng tôi tập trung:</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "Thời sự trong nước và quốc tế",
                      "Kinh tế - Tài chính",
                      "Thể thao",
                      "Công nghệ",
                      "Giải trí - Văn hóa",
                      "Sức khỏe - Đời sống",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-primary mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">Độc giả hàng tháng</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Phóng viên chuyên nghiệp</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Cập nhật tin tức</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-primary mb-2">5+</div>
              <div className="text-sm text-muted-foreground">Năm kinh nghiệm</div>
            </Card>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Liên Hệ Với Chúng Tôi</CardTitle>
                <p className="text-muted-foreground">Chúng tôi luôn sẵn sàng lắng nghe ý kiến đóng góp từ độc giả</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <p className="text-muted-foreground">contact@vietnews.com</p>
                      <p className="text-muted-foreground">editor@vietnews.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Điện thoại</h4>
                      <p className="text-muted-foreground">+84 24 3xxx xxxx</p>
                      <p className="text-muted-foreground">Hotline: 1900 xxxx</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Địa chỉ</h4>
                      <p className="text-muted-foreground">
                        Tầng 10, Tòa nhà ABC
                        <br />
                        123 Đường XYZ, Quận 1<br />
                        TP. Hồ Chí Minh
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Giờ làm việc:</strong> Thứ 2 - Thứ 6: 8:00 - 18:00 | Thứ 7: 8:00
                    - 12:00 | Chủ nhật: Nghỉ
                  </p>
                </div>
              </CardContent>
            </div>
            <div className="relative">
              <img src="/VanPhong.jpg" alt="Văn phòng VietNews" className="w-full h-full object-cover" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
