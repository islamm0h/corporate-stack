'use client'

interface FreeTrialButtonProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  className?: string
}

export default function FreeTrialButton({ 
  size = 'medium', 
  text = 'تجربة مجانية 14 يوم',
  className = ''
}: FreeTrialButtonProps) {
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // سيتم ربطه بدومين آخر لاحقاً
    // يمكن تغيير هذا الرابط عند الحاجة
    const trialUrl = 'https://trial.corporatestack.com' // مثال للدومين المستقبلي
    
    // مؤقتاً نعرض رسالة
    alert('سيتم توجيهك لصفحة التسجيل قريباً')
    
    // في المستقبل سيتم استخدام:
    // window.open(trialUrl, '_blank')
  }

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
    <a 
      href="#" 
      className={`btn btn-primary btn-free-trial ${getSizeClass()} ${className}`}
      onClick={handleClick}
    >
      <i className="fas fa-gift"></i>
      {text}
    </a>
  )
}
