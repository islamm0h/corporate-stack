'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// إعلان النوع لـ particles.js
declare global {
  interface Window {
    particlesJS: any
  }
}

export default function SplashScreen() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // تهيئة تأثير الجزيئات المتحركة
    if (typeof window !== 'undefined' && window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 100,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: '#ffffff'
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000'
            },
            polygon: {
              nb_sides: 5
            }
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 5,
            random: true,
            anim: {
              enable: true,
              speed: 5,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 3,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'bubble'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 1
              }
            },
            bubble: {
              distance: 200,
              size: 6,
              duration: 2,
              opacity: 0.8,
              speed: 3
            },
            repulse: {
              distance: 200,
              duration: 0.4
            },
            push: {
              particles_nb: 4
            },
            remove: {
              particles_nb: 2
            }
          }
        },
        retina_detect: true
      })
    }

    // تحريك شريط التحميل
    let width = 0
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval)
        // الانتقال إلى الصفحة الرئيسية بعد اكتمال التحميل
        setTimeout(() => {
          router.push('/')
        }, 500)
      } else {
        width += 1
        setProgress(width)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="splash-body">
      {/* Particles.js Container */}
      <div id="particles-js"></div>

      <div className="splash-container">
        <div className="logo-container">
          <img src="/logo.svg" alt="كوربريت ستاك" className="logo" />
          <h1 className="company-name">كوربريت ستاك</h1>
          <p className="tagline">
            <span className="colored-tagline">كوربريت ستاك</span> لإدارة{' '}
            <span className="colored-tagline-secondary">أعمالك</span> بكفاءة{' '}
            <span className="colored-tagline-accent">عالية</span>
          </p>
        </div>

        <div className="loading-container">
          <div className="loading-bar">
            <div
              className="loading-progress"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="loading-text">
            جاري تحميل الموقع <span className="loading-dots"></span>
          </div>
        </div>
      </div>

      <div className="splash-footer">
        جميع الحقوق محفوظة &copy; 2025 كوربريت ستاك
      </div>
    </div>
  )
}
