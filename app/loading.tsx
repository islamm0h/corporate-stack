export default function Loading() {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-logo-container">
          <div className="splash-logo">
            <img src="/logo.svg" alt="Corporate Stack Logo" className="splash-logo-image" />
          </div>
          
          <h1 className="splash-title">
            <span className="title-corporate">Corporate</span>
            <span className="title-stack">Stack</span>
          </h1>
          
          <p className="splash-subtitle">حلول متكاملة لإدارة الأعمال</p>
        </div>

        <div className="loading-container">
          <div className="loading-bar-container">
            <div className="loading-bar">
              <div className="loading-progress" style={{ width: '50%' }}></div>
            </div>
            <div className="loading-percentage">50%</div>
          </div>
          
          <p className="loading-text">جاري التحميل...</p>
        </div>
      </div>
    </div>
  )
}
