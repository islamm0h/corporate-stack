-- قاعدة بيانات PostgreSQL للموقع
-- إنشاء قاعدة البيانات
CREATE DATABASE corporate_stack_db;

-- الاتصال بقاعدة البيانات
\c corporate_stack_db;

-- إنشاء الامتدادات المطلوبة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- جدول المستخدمين والمديرين
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول العملاء المحتملين
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    industry VARCHAR(50),
    company_size VARCHAR(20) CHECK (company_size IN ('small', 'medium', 'large', 'enterprise')),
    region VARCHAR(50),
    city VARCHAR(50),
    source VARCHAR(50) DEFAULT 'website' CHECK (source IN ('website', 'social_media', 'referral', 'advertising', 'cold_call', 'other')),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
    lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    notes TEXT,
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الأنظمة والخدمات
CREATE TABLE systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(255),
    category VARCHAR(50),
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'SAR',
    features JSONB,
    specifications JSONB,
    images JSONB,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    seo_title VARCHAR(255),
    seo_description VARCHAR(500),
    seo_keywords TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول طلبات العروض
CREATE TABLE quote_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    system_id UUID REFERENCES systems(id),
    request_type VARCHAR(20) DEFAULT 'quote' CHECK (request_type IN ('quote', 'demo', 'consultation', 'information')),
    message TEXT,
    budget_range VARCHAR(50),
    timeline VARCHAR(50),
    requirements JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الردود والمتابعات
CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES quote_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) NOT NULL,
    response_type VARCHAR(20) DEFAULT 'email' CHECK (response_type IN ('email', 'phone', 'meeting', 'proposal', 'quote')),
    subject VARCHAR(255),
    content TEXT NOT NULL,
    attachments JSONB,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'replied')),
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول إعدادات النظام
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value JSONB,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, key)
);

-- جدول سجل النشاطات
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الإحصائيات اليومية
CREATE TABLE daily_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    total_leads INTEGER DEFAULT 0,
    new_leads INTEGER DEFAULT 0,
    qualified_leads INTEGER DEFAULT 0,
    converted_leads INTEGER DEFAULT 0,
    total_requests INTEGER DEFAULT 0,
    pending_requests INTEGER DEFAULT 0,
    completed_requests INTEGER DEFAULT 0,
    total_responses INTEGER DEFAULT 0,
    website_visits INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2),
    avg_session_duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الملفات والمرفقات
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    entity_type VARCHAR(50),
    entity_id UUID,
    uploaded_by UUID REFERENCES users(id),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول النسخ الاحتياطية
CREATE TABLE backups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    backup_name VARCHAR(255) NOT NULL,
    backup_type VARCHAR(20) DEFAULT 'full' CHECK (backup_type IN ('full', 'incremental', 'differential')),
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed', 'failed')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_region ON leads(region);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);

CREATE INDEX idx_quote_requests_status ON quote_requests(status);
CREATE INDEX idx_quote_requests_lead_id ON quote_requests(lead_id);
CREATE INDEX idx_quote_requests_system_id ON quote_requests(system_id);
CREATE INDEX idx_quote_requests_created_at ON quote_requests(created_at);

CREATE INDEX idx_responses_request_id ON responses(request_id);
CREATE INDEX idx_responses_user_id ON responses(user_id);
CREATE INDEX idx_responses_status ON responses(status);
CREATE INDEX idx_responses_created_at ON responses(created_at);

CREATE INDEX idx_systems_category ON systems(category);
CREATE INDEX idx_systems_is_active ON systems(is_active);
CREATE INDEX idx_systems_is_featured ON systems(is_featured);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

CREATE INDEX idx_daily_stats_date ON daily_stats(date);

-- إنشاء دوال التحديث التلقائي للوقت
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة المشغلات للتحديث التلقائي
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_systems_updated_at BEFORE UPDATE ON systems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quote_requests_updated_at BEFORE UPDATE ON quote_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_updated_at BEFORE UPDATE ON responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at BEFORE UPDATE ON daily_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إدراج بيانات تجريبية
-- إدراج مستخدم مدير افتراضي
INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active, email_verified) VALUES
('admin', 'admin@corporatestack.com', crypt('admin123', gen_salt('bf')), 'مدير', 'النظام', 'admin', true, true),
('manager1', 'manager@corporatestack.com', crypt('manager123', gen_salt('bf')), 'أحمد', 'المدير', 'manager', true, true),
('user1', 'user@corporatestack.com', crypt('user123', gen_salt('bf')), 'محمد', 'المستخدم', 'user', true, true);

-- إدراج الأنظمة والخدمات
INSERT INTO systems (name, slug, description, short_description, category, price, features, is_active, is_featured) VALUES
('نظام المحاسبة والفاتورة الإلكترونية', 'accounting-system',
'نظام محاسبة شامل يدعم الفاتورة الإلكترونية ومتوافق مع هيئة الزكاة والضريبة والجمارك',
'نظام محاسبة متكامل مع الفاتورة الإلكترونية',
'محاسبة', 15000.00,
'["الفاتورة الإلكترونية", "التقارير المالية", "إدارة العملاء", "إدارة الموردين", "الجرد"]'::jsonb,
true, true),

('نظام إدارة العملاء (CRM)', 'crm-system',
'نظام إدارة علاقات العملاء الشامل لتتبع العملاء المحتملين والمبيعات',
'نظام CRM متطور لإدارة العملاء والمبيعات',
'مبيعات', 12000.00,
'["إدارة العملاء المحتملين", "تتبع المبيعات", "التقارير التحليلية", "التسويق الآلي", "خدمة العملاء"]'::jsonb,
true, true),

('نظام إدارة الموارد البشرية', 'hr-system',
'نظام شامل لإدارة الموارد البشرية والرواتب والحضور والانصراف',
'نظام HR متكامل للموارد البشرية',
'موارد بشرية', 18000.00,
'["إدارة الموظفين", "الرواتب", "الحضور والانصراف", "الإجازات", "التقييم", "التدريب"]'::jsonb,
true, true),

('نظام إدارة المخزون', 'inventory-system',
'نظام إدارة المخزون والمستودعات مع تتبع المنتجات والكميات',
'نظام إدارة مخزون ذكي ومتطور',
'مخزون', 10000.00,
'["تتبع المخزون", "إدارة المستودعات", "تقارير المخزون", "تنبيهات النفاد", "الباركود"]'::jsonb,
true, false),

('نظام إدارة المشاريع', 'project-management',
'نظام إدارة المشاريع والمهام مع تتبع الوقت والموارد',
'نظام إدارة مشاريع احترافي',
'إدارة', 8000.00,
'["إدارة المشاريع", "تتبع المهام", "إدارة الفرق", "تقارير الأداء", "التقويم"]'::jsonb,
true, false);

-- إدراج إعدادات النظام الافتراضية
INSERT INTO system_settings (category, key, value, description, is_public) VALUES
('general', 'site_name', '"كوربريت ستاك"', 'اسم الموقع', true),
('general', 'site_description', '"حلول متكاملة لإدارة الأعمال"', 'وصف الموقع', true),
('general', 'contact_email', '"info@corporatestack.com"', 'البريد الإلكتروني للتواصل', true),
('general', 'contact_phone', '"+966501234567"', 'رقم الهاتف للتواصل', true),
('general', 'address', '"الرياض، المملكة العربية السعودية"', 'العنوان', true),
('general', 'currency', '"SAR"', 'العملة الافتراضية', true),
('general', 'maintenance_mode', 'false', 'وضع الصيانة', false),
('general', 'user_registration', 'true', 'السماح بتسجيل المستخدمين الجدد', false),

('seo', 'home_title', '"كوربريت ستاك - حلول متكاملة لإدارة الأعمال"', 'عنوان الصفحة الرئيسية', true),
('seo', 'home_description', '"نقدم حلولاً متكاملة لإدارة الأعمال تساعدك على تحسين الكفاءة وزيادة الإنتاجية"', 'وصف الصفحة الرئيسية', true),
('seo', 'home_keywords', '["حلول تقنية", "أنظمة إدارة", "برمجيات", "تطوير", "دعم فني"]', 'الكلمات المفتاحية للصفحة الرئيسية', true),
('seo', 'focus_keyword', '"حلول تقنية"', 'الكلمة المفتاحية الرئيسية', true),
('seo', 'meta_author', '"كوربريت ستاك"', 'مؤلف الموقع', true),
('seo', 'og_image', '"/images/og-image.jpg"', 'صورة المشاركة الاجتماعية', true),
('seo', 'twitter_card', '"summary_large_image"', 'نوع بطاقة تويتر', true),
('seo', 'canonical_url', '"https://corporatestack.com"', 'الرابط الأساسي', true),
('seo', 'robots_txt', '"index, follow"', 'إعدادات محركات البحث', true),
('seo', 'sitemap_enabled', 'true', 'تفعيل خريطة الموقع', true),
('seo', 'analytics_id', '"G-XXXXXXXXXX"', 'معرف Google Analytics', false),
('seo', 'search_console_id', '"XXXXXXXXXX"', 'معرف Google Search Console', false),

('security', 'ssl_enabled', 'true', 'تفعيل SSL', false),
('security', 'force_https', 'true', 'إجبار HTTPS', false),
('security', 'session_timeout', '3600', 'انتهاء صلاحية الجلسة (بالثواني)', false),
('security', 'max_login_attempts', '5', 'عدد محاولات تسجيل الدخول القصوى', false),
('security', 'password_min_length', '8', 'الحد الأدنى لطول كلمة المرور', false),

('backup', 'auto_backup', 'true', 'النسخ الاحتياطي التلقائي', false),
('backup', 'backup_frequency', '"daily"', 'تكرار النسخ الاحتياطي', false),
('backup', 'retention_days', '30', 'عدد أيام الاحتفاظ بالنسخ الاحتياطية', false),
('backup', 'backup_location', '"/backups"', 'مكان حفظ النسخ الاحتياطية', false),

('performance', 'cache_enabled', 'true', 'تفعيل التخزين المؤقت', false),
('performance', 'cache_duration', '3600', 'مدة التخزين المؤقت (بالثواني)', false),
('performance', 'compression_enabled', 'true', 'تفعيل ضغط الملفات', false),
('performance', 'minify_css', 'true', 'ضغط ملفات CSS', false),
('performance', 'minify_js', 'true', 'ضغط ملفات JavaScript', false),

('notifications', 'email_enabled', 'true', 'تفعيل الإشعارات بالبريد الإلكتروني', false),
('notifications', 'sms_enabled', 'false', 'تفعيل الإشعارات بالرسائل النصية', false),
('notifications', 'push_enabled', 'true', 'تفعيل الإشعارات المباشرة', false),
('notifications', 'admin_notifications', 'true', 'إشعارات المدير', false),

('api', 'api_enabled', 'true', 'تفعيل API', false),
('api', 'api_rate_limit', '1000', 'حد معدل استخدام API (طلب/ساعة)', false),
('api', 'api_version', '"v1"', 'إصدار API', false),
('api', 'webhook_enabled', 'false', 'تفعيل Webhooks', false);

-- إدراج عملاء محتملين تجريبيين
INSERT INTO leads (company_name, contact_person, email, phone, industry, company_size, region, city, source, status, lead_score, notes) VALUES
('شركة الرياض للتجارة', 'أحمد محمد السالم', 'ahmed@riyadh-trade.com', '+966501234567', 'تجارة', 'medium', 'الرياض', 'الرياض', 'website', 'qualified', 85, 'عميل مهتم بنظام المحاسبة والفاتورة الإلكترونية'),
('مؤسسة جدة للخدمات', 'فاطمة أحمد علي', 'fatima@jeddah-services.com', '+966502345678', 'خدمات', 'small', 'مكة المكرمة', 'جدة', 'social_media', 'contacted', 70, 'طلب معلومات عن نظام إدارة العملاء'),
('شركة الدمام الصناعية', 'محمد عبدالله الأحمد', 'mohammed@dammam-industrial.com', '+966503456789', 'صناعة', 'large', 'الشرقية', 'الدمام', 'referral', 'proposal', 90, 'مهتم بنظام إدارة الموارد البشرية'),
('مكتب الخبر الاستشاري', 'سارة محمد الزهراني', 'sara@khobar-consulting.com', '+966504567890', 'استشارات', 'small', 'الشرقية', 'الخبر', 'advertising', 'new', 60, 'استفسار أولي عن الخدمات'),
('شركة المدينة التقنية', 'عبدالرحمن سعد القحطاني', 'abdulrahman@madinah-tech.com', '+966505678901', 'تقنية', 'medium', 'المدينة المنورة', 'المدينة المنورة', 'website', 'negotiation', 95, 'في مرحلة التفاوض النهائي'),
('مؤسسة تبوك للتطوير', 'نورا عبدالعزيز الشمري', 'nora@tabuk-development.com', '+966506789012', 'تطوير عقاري', 'medium', 'تبوك', 'تبوك', 'cold_call', 'contacted', 65, 'تم التواصل هاتفياً'),
('شركة أبها للتجارة الإلكترونية', 'خالد أحمد عسيري', 'khalid@abha-ecommerce.com', '+966507890123', 'تجارة إلكترونية', 'small', 'عسير', 'أبها', 'website', 'qualified', 80, 'مهتم بنظام إدارة المخزون'),
('مجموعة حائل الاستثمارية', 'ريم محمد الشمري', 'reem@hail-investment.com', '+966508901234', 'استثمار', 'large', 'حائل', 'حائل', 'referral', 'closed_won', 100, 'تم إغلاق الصفقة بنجاح'),
('شركة القصيم للزراعة', 'عبدالله سليمان المطيري', 'abdullah@qassim-agriculture.com', '+966509012345', 'زراعة', 'medium', 'القصيم', 'بريدة', 'website', 'contacted', 75, 'طلب عرض تقديمي'),
('مؤسسة الباحة للخدمات اللوجستية', 'أمل عبدالرحمن الغامدي', 'amal@baha-logistics.com', '+966500123456', 'لوجستيات', 'small', 'الباحة', 'الباحة', 'social_media', 'new', 55, 'استفسار عبر وسائل التواصل الاجتماعي');

-- إدراج طلبات العروض
INSERT INTO quote_requests (lead_id, system_id, request_type, message, budget_range, timeline, status, priority) VALUES
((SELECT id FROM leads WHERE email = 'ahmed@riyadh-trade.com'),
 (SELECT id FROM systems WHERE slug = 'accounting-system'),
 'quote', 'نحتاج نظام محاسبة متكامل مع الفاتورة الإلكترونية لشركتنا', '10000-20000', '3 أشهر', 'in_progress', 'high'),

((SELECT id FROM leads WHERE email = 'fatima@jeddah-services.com'),
 (SELECT id FROM systems WHERE slug = 'crm-system'),
 'demo', 'نود مشاهدة عرض تقديمي لنظام إدارة العملاء', '5000-15000', 'شهر واحد', 'pending', 'medium'),

((SELECT id FROM leads WHERE email = 'mohammed@dammam-industrial.com'),
 (SELECT id FROM systems WHERE slug = 'hr-system'),
 'quote', 'طلب عرض سعر لنظام إدارة الموارد البشرية لـ 200 موظف', '15000-25000', '6 أشهر', 'completed', 'high'),

((SELECT id FROM leads WHERE email = 'sara@khobar-consulting.com'),
 (SELECT id FROM systems WHERE slug = 'project-management'),
 'information', 'معلومات عن نظام إدارة المشاريع', '5000-10000', 'شهرين', 'pending', 'low'),

((SELECT id FROM leads WHERE email = 'khalid@abha-ecommerce.com'),
 (SELECT id FROM systems WHERE slug = 'inventory-system'),
 'consultation', 'استشارة حول نظام إدارة المخزون', '8000-12000', '3 أشهر', 'in_progress', 'medium');

-- إدراج ردود ومتابعات
INSERT INTO responses (request_id, user_id, response_type, subject, content, status, follow_up_date) VALUES
((SELECT id FROM quote_requests WHERE lead_id = (SELECT id FROM leads WHERE email = 'ahmed@riyadh-trade.com')),
 (SELECT id FROM users WHERE username = 'manager1'),
 'email', 'عرض سعر نظام المحاسبة والفاتورة الإلكترونية',
 'نشكركم على اهتمامكم بخدماتنا. نرفق لكم عرض سعر مفصل لنظام المحاسبة والفاتورة الإلكترونية.',
 'sent', '2024-02-01'),

((SELECT id FROM quote_requests WHERE lead_id = (SELECT id FROM leads WHERE email = 'mohammed@dammam-industrial.com')),
 (SELECT id FROM users WHERE username = 'admin'),
 'proposal', 'اقتراح نظام إدارة الموارد البشرية',
 'نقدم لكم اقتراحاً شاملاً لنظام إدارة الموارد البشرية يتناسب مع احتياجات شركتكم.',
 'delivered', '2024-02-05');

-- إدراج إحصائيات يومية تجريبية
INSERT INTO daily_stats (date, total_leads, new_leads, qualified_leads, converted_leads, total_requests, pending_requests, completed_requests, total_responses, website_visits, page_views, bounce_rate, avg_session_duration) VALUES
('2024-01-01', 1200, 15, 8, 3, 25, 5, 18, 22, 1500, 4500, 35.5, 180),
('2024-01-02', 1215, 18, 10, 2, 28, 7, 19, 25, 1650, 4950, 32.1, 195),
('2024-01-03', 1233, 12, 6, 4, 22, 4, 16, 20, 1400, 4200, 38.2, 165),
('2024-01-04', 1245, 20, 12, 1, 30, 8, 20, 28, 1800, 5400, 29.8, 210),
('2024-01-05', 1265, 16, 9, 3, 26, 6, 18, 24, 1550, 4650, 33.7, 185),
('2024-01-06', 1281, 14, 7, 2, 24, 5, 17, 21, 1450, 4350, 36.4, 175),
('2024-01-07', 1295, 22, 14, 5, 32, 9, 21, 30, 1900, 5700, 28.3, 220);

-- إدراج سجل نشاطات تجريبي
INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address) VALUES
((SELECT id FROM users WHERE username = 'admin'), 'login', 'user', (SELECT id FROM users WHERE username = 'admin'), '{"login_method": "password"}', '192.168.1.100'),
((SELECT id FROM users WHERE username = 'manager1'), 'create', 'lead', (SELECT id FROM leads WHERE email = 'ahmed@riyadh-trade.com'), '{"company_name": "شركة الرياض للتجارة"}', '192.168.1.101'),
((SELECT id FROM users WHERE username = 'admin'), 'update', 'system_settings', null, '{"category": "general", "key": "site_name"}', '192.168.1.100'),
((SELECT id FROM users WHERE username = 'manager1'), 'send', 'response', (SELECT id FROM responses LIMIT 1), '{"response_type": "email"}', '192.168.1.101');
