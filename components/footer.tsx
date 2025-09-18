import Link from "next/link"
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold text-primary">VietNews</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Website tin tức hàng đầu Việt Nam, cung cấp thông tin nhanh chóng, chính xác và đáng tin cậy.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="text-muted-foreground hover:text-primary">
                  Quảng cáo
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Danh mục tin tức</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/thoi-su" className="text-muted-foreground hover:text-primary">
                  Thời sự
                </Link>
              </li>
              <li>
                <Link href="/category/kinh-te" className="text-muted-foreground hover:text-primary">
                  Kinh tế
                </Link>
              </li>
              <li>
                <Link href="/category/the-thao" className="text-muted-foreground hover:text-primary">
                  Thể thao
                </Link>
              </li>
              <li>
                <Link href="/category/giai-tri" className="text-muted-foreground hover:text-primary">
                  Giải trí
                </Link>
              </li>
              <li>
                <Link href="/category/cong-nghe" className="text-muted-foreground hover:text-primary">
                  Công nghệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Thông tin liên hệ</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">contact@vietnews.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 VietNews. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
