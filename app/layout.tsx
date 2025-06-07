import type { Metadata } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800']
})

export const metadata: Metadata = {
  title: 'كوربريت ستاك - حلول متكاملة لإدارة الأعمال',
  description: 'نقدم حلولاً متكاملة لإدارة الأعمال تساعدك على تحسين الكفاءة وزيادة الإنتاجية وتحقيق النمو المستدام.',
  keywords: 'إدارة أعمال, برامج محاسبة, إدارة موارد بشرية, إدارة مشاريع, نظام متكامل',
  authors: [{ name: 'كوربريت ستاك' }],
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  colorScheme: 'light',
  themeColor: '#ffffff',
  openGraph: {
    type: 'website',
    url: 'https://www.corporatestack.com/',
    title: 'كوربريت ستاك - حلول متكاملة لإدارة الأعمال',
    description: 'نقدم حلولاً متكاملة لإدارة الأعمال تساعدك على تحسين الكفاءة وزيادة الإنتاجية وتحقيق النمو المستدام.',
    images: [
      {
        url: 'https://www.corporatestack.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'كوربريت ستاك',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'كوربريت ستاك - حلول متكاملة لإدارة الأعمال',
    description: 'نقدم حلولاً متكاملة لإدارة الأعمال تساعدك على تحسين الكفاءة وزيادة الإنتاجية وتحقيق النمو المستدام.',
    images: ['https://www.corporatestack.com/images/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" style={{ colorScheme: 'light only' }}>
      <head>
        {/* منع الوضع الداكن */}
        <meta name="color-scheme" content="light only" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-navbutton-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-status-bar-style" content="light-content" />

        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js" async></script>
      </head>
      <body
        className={tajawal.className}
        style={{
          backgroundColor: '#ffffff',
          color: '#1e293b',
          colorScheme: 'light only'
        }}
      >
        {children}
      </body>
    </html>
  )
}