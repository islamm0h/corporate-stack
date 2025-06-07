'use client'

import Link from 'next/link'

interface FreeTrialButtonProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  className?: string
  href?: string
}

export default function FreeTrialButton({
  size = 'medium',
  text = 'تجربة مجانية 14 يوم',
  className = '',
  href = '/contact?trial=true'
}: FreeTrialButtonProps) {

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'btn-free-trial-small'
      case 'large':
        return 'btn-free-trial-large'
      default:
        return ''
    }
  }

  return (
    <Link
      href={href}
      className={`btn btn-primary btn-free-trial ${getSizeClass()} ${className}`}
    >
      <i className="fas fa-gift"></i>
      {text}
    </Link>
  )
}
