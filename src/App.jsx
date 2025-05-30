import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Camera, 
  Video, 
  Send, 
  Clock, 
  Shield, 
  User, 
  Lock, 
  Bell, 
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Menu,
  Settings,
  LogOut,
  FileText,
  Map as MapIcon,
  Home,
  Plus,
  Minus,
  Filter,
  Search,
  Upload,
  AlertCircle,
  Activity,
  TrendingUp,
  Users,
  BarChart3,
  Eye,
  EyeOff,
  Trash2,
  Edit
} from 'lucide-react';

// ============================================
// CONSTANTS & DATA
// ============================================

const REPORT_TYPES = [
  { 
    id: 'crime', 
    icon: AlertTriangle, 
    label: 'الإبلاغ الجنائي', 
    desc: 'حالات نهب/قتل/خطر شديد', 
    color: 'from-red-500 to-red-600' 
  },
  { 
    id: 'theft', 
    icon: Shield, 
    label: 'سرقة', 
    desc: 'سرقة ممتلكات', 
    color: 'from-orange-500 to-orange-600' 
  },
  { 
    id: 'medical', 
    icon: Plus, 
    label: 'حالة صحية', 
    desc: 'طلب طوارئ صحية', 
    color: 'from-blue-500 to-blue-600' 
  },
  { 
    id: 'extreme', 
    icon: AlertCircle, 
    label: 'بلاغ شديد الخطورة', 
    desc: 'إرسال فوري جداً', 
    color: 'from-red-600 to-red-700' 
  }
];

const DUMMY_REPORTS = [
  { id: 'R-2025-001', type: 'سرقة', severity: 'high', status: 'قيد المتابعة', location: 'الخرطوم، السوق الكبير', time: 'منذ ساعتين', lat: 15.5007, lng: 32.5599, description: 'تم رصد محاولة سرقة في المنطقة' },
  { id: 'R-2025-002', type: 'حالة صحية', severity: 'medium', status: 'مؤكد', location: 'أم درمان، شارع الأربعين', time: 'منذ 4 ساعات', lat: 15.6447, lng: 32.4777, description: 'حالة طبية طارئة' },
  { id: 'R-2025-003', type: 'إبلاغ جنائي', severity: 'high', status: 'مستلم', location: 'الخرطوم بحري، الشهداء', time: 'منذ 6 ساعات', lat: 15.5877, lng: 32.5341, description: 'حادث جنائي' },
  { id: 'R-2025-004', type: 'سرقة', severity: 'low', status: 'مغلق', location: 'الخرطوم، الرياض', time: 'منذ يوم', lat: 15.5447, lng: 32.5299, description: 'تم حل الحالة' },
  { id: 'R-2025-005', type: 'بلاغ شديد الخطورة', severity: 'high', status: 'قيد المتابعة', location: 'الخرطوم، المطار', time: 'منذ 30 دقيقة', lat: 15.5897, lng: 32.5531, description: 'حالة طارئة جداً' }
];

const SEVERITY_CONFIG = {
  high: { color: 'bg-red-500', label: 'عالي', textColor: 'text-red-700', bgColor: 'bg-red-100' },
  medium: { color: 'bg-orange-500', label: 'متوسط', textColor: 'text-orange-700', bgColor: 'bg-orange-100' },
  low: { color: 'bg-green-500', label: 'منخفض', textColor: 'text-green-700', bgColor: 'bg-green-100' }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const getSeverityColor = (severity) => SEVERITY_CONFIG[severity]?.color || 'bg-gray-500';
const getSeverityLabel = (severity) => SEVERITY_CONFIG[severity]?.label || 'غير محدد';
const getSeverityTextColor = (severity) => SEVERITY_CONFIG[severity]?.textColor || 'text-gray-700';
const getSeverityBgColor = (severity) => SEVERITY_CONFIG[severity]?.bgColor || 'bg-gray-100';

// ============================================
// REUSABLE COMPONENTS
// ============================================

const AppHeader = ({ title, subtitle, onBack, showLogo = false }) => (
  <div className="flex items-center mb-6">
    {onBack && (
      <button onClick={onBack} className="ml-auto">
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>
    )}
    <div className={`${onBack ? 'flex-1' : 'w-full'} flex items-center ${onBack ? 'justify-center' : 'justify-center'} gap-3`}>
      {showLogo && <Shield className="w-8 h-8 text-blue-600" />}
      <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>
        {title || 'SafeCity'}
      </span>
    </div>
    {onBack && <div className="w-6"></div>}
  </div>
);

const BottomNavigation = ({ activeScreen, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'map', icon: MapIcon, label: 'الخريطة' },
    { id: 'history', icon: FileText, label: 'سجلاتي' },
    { id: 'profile', icon: User, label: 'حسابي' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-around shadow-lg z-40">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className="flex flex-col items-center gap-1 transition-all"
        >
          <item.icon className={`w-6 h-6 ${activeScreen === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
          <span 
            className={`text-xs ${activeScreen === item.id ? 'font-semibold text-blue-600' : 'text-gray-500'}`}
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

const InputField = ({ label, type = 'text', value, onChange, placeholder, icon: Icon, showPasswordToggle, onTogglePassword, showPassword }) => (
  <div>
    <label className="block text-gray-700 mb-2 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
      {label}
    </label>
    <div className="relative">
      <input
        type={showPasswordToggle && !showPassword ? 'password' : type}
        value={value}
        onChange={onChange}
        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-right focus:border-blue-500 focus:outline-none transition-all"
        placeholder={placeholder}
        style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
      {Icon && !showPasswordToggle && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, disabled = false }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg',
    secondary: 'bg-white text-blue-600 border-2 border-blue-600',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg',
    ghost: 'bg-gray-200 text-gray-700'
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{ fontFamily: 'Cairo, sans-serif' }}
    >
      {Icon && <Icon className="w-6 h-6" />}
      {children}
    </motion.button>
  );
};

const ReportCard = ({ report, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    className="bg-white rounded-2xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-all"
  >
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {report.type}
          </span>
          <span className={`w-2 h-2 rounded-full ${getSeverityColor(report.severity)}`}></span>
        </div>
        <div className="text-sm text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
          {report.location}
        </div>
      </div>
      <span className="text-xs text-gray-500" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
        {report.time}
      </span>
    </div>
    <div className="flex items-center justify-between">
      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getSeverityBgColor(report.severity)} ${getSeverityTextColor(report.severity)}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
        {report.status}
      </span>
      <span className="text-xs text-gray-500" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
        {report.id}
      </span>
    </div>
  </motion.div>
);

// ============================================
// SCREEN COMPONENTS
// ============================================

const SplashScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 flex items-center justify-center"
    dir="rtl"
  >
    <div className="text-center relative">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 1 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-white opacity-20 blur-3xl rounded-full animate-pulse"></div>
        <Shield className="w-32 h-32 text-white mx-auto relative z-10" strokeWidth={1.5} />
      </motion.div>
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-5xl font-bold text-white mt-8 mb-4"
        style={{ fontFamily: 'Cairo, sans-serif' }}
      >
        SafeCity
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-2xl text-blue-100"
        style={{ fontFamily: 'Cairo, sans-serif' }}
      >
        سلامتك أولوية
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12"
      >
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-white rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  </motion.div>
);

const OnboardingScreen = ({ onNavigate }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex flex-col"
    dir="rtl"
  >
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <Shield className="w-24 h-24 text-blue-600 mx-auto mb-6" />
        </motion.div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
          مرحباً بك في SafeCity
        </h2>
        <p className="text-xl text-gray-600 mb-8" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
          نظام الإبلاغ والمراقبة الأمنية الذكي لحماية مجتمعك
        </p>
        <div className="space-y-4 mb-12">
          {[
            { icon: Shield, text: 'إبلاغ سريع وآمن' },
            { icon: MapPin, text: 'خرائط أمنية تفاعلية' },
            { icon: Clock, text: 'استجابة فورية' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="bg-blue-100 p-3 rounded-xl">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-lg text-gray-700" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <Button onClick={() => onNavigate('signup')} className="w-full">
        تسجيل جديد
      </Button>
      <Button onClick={() => onNavigate('login')} variant="secondary" className="w-full">
        تسجيل الدخول
      </Button>
    </div>
  </motion.div>
);

const SignupScreen = ({ onNavigate, onSignup }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'الاسم مطلوب';
    if (!formData.nationalId.trim()) newErrors.nationalId = 'الرقم الوطني مطلوب';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
    if (formData.password.length < 6) newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSignup({ name: formData.fullName });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 overflow-auto pb-8"
      dir="rtl"
    >
      <div className="p-6">
        <AppHeader 
          title="SafeCity" 
          onBack={() => onNavigate('onboarding')} 
          showLogo 
        />

        <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
          إنشاء حساب جديد
        </h2>
        <p className="text-gray-600 mb-8" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
          نستخدم بياناتك فقط للاستجابة للطوارئ
        </p>

        <div className="space-y-4">
          <InputField
            label="الاسم الكامل"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            placeholder="أدخل اسمك الكامل"
          />
          {errors.fullName && <p className="text-red-500 text-sm -mt-2">{errors.fullName}</p>}

          <InputField
            label="الرقم الوطني"
            value={formData.nationalId}
            onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
            placeholder="أدخل رقمك الوطني"
          />
          {errors.nationalId && <p className="text-red-500 text-sm -mt-2">{errors.nationalId}</p>}

          <InputField
            label="رقم الهاتف"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+249 XX XXX XXXX"
            icon={Phone}
          />
          {errors.phone && <p className="text-red-500 text-sm -mt-2">{errors.phone}</p>}

          <InputField
            label="كلمة المرور"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="أدخل كلمة المرور"
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          {errors.password && <p className="text-red-500 text-sm -mt-2">{errors.password}</p>}

          <InputField
            label="تأكيد كلمة المرور"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            placeholder="أعد إدخال كلمة المرور"
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm -mt-2">{errors.confirmPassword}</p>}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <p className="text-sm text-blue-800" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              بياناتك محمية ومشفّرة. يمكنك الاطلاع على{' '}
              <span className="underline cursor-pointer font-semibold">سياسة الخصوصية</span>
            </p>
          </div>

          <Button onClick={handleSubmit} className="w-full mt-6">
            إنشاء الحساب
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const LoginScreen = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    nationalId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col"
      dir="rtl"
    >
      <div className="p-6">
        <AppHeader 
          title="SafeCity" 
          onBack={() => onNavigate('onboarding')} 
          showLogo 
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
              تسجيل الدخول
            </h2>
            <p className="text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              مرحباً بعودتك إلى SafeCity
            </p>
          </div>

          <div className="space-y-4">
            <InputField
              label="الرقم الوطني"
              value={formData.nationalId}
              onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
              placeholder="أدخل رقمك الوطني"
            />

            <InputField
              label="كلمة المرور"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="أدخل كلمة المرور"
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <div className="text-left">
              <button className="text-blue-600 font-semibold text-sm hover:underline" style={{ fontFamily: 'Cairo, sans-serif' }}>
                نسيت كلمة المرور؟
              </button>
            </div>

            <Button onClick={() => onLogin({ name: 'محي الدين' })} className="w-full mt-6">
              تسجيل الدخول
            </Button>

            <div className="text-center pt-4">
              <span className="text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                ليس لديك حساب؟{' '}
              </span>
              <button
                onClick={() => onNavigate('signup')}
                className="text-blue-600 font-bold hover:underline"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                تسجيل جديد
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HomeScreen = ({ userData, reports, onNavigate, onReportClick, onReportTypeClick }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-24"
    dir="rtl"
  >
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-b-3xl shadow-xl p-6 pb-8">
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-9 h-9 text-white" />
          <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>SafeCity</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
        مرحباً، {userData?.name || 'محي الدين'}
      </h1>
      <div className="flex items-center gap-2 text-blue-100">
        <MapPin className="w-4 h-4" />
        <span style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>الموقع: الخرطوم</span>
      </div>
    </div>

    <div className="px-6 -mt-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
          اختر نوع البلاغ
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {REPORT_TYPES.map((type, index) => (
            <motion.button
              key={type.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onReportTypeClick(type)}
              className={`bg-gradient-to-br ${type.color} p-4 rounded-2xl text-white text-right shadow-lg hover:shadow-xl transition-shadow`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <type.icon className="w-8 h-8 mb-2" />
              <div className="text-sm font-bold mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {type.label}
              </div>
              <div className="text-xs opacity-90" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                {type.desc}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>

    <div className="px-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>
          بلاغاتي
        </h3>
        <button
          onClick={() => onNavigate('history')}
          className="text-blue-600 font-semibold text-sm hover:underline"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          عرض الكل
        </button>
      </div>
      <div className="space-y-3">
        {reports.slice(0, 3).map((report, index) => (
          <ReportCard 
            key={report.id} 
            report={report} 
            onClick={() => onReportClick(report)}
          />
        ))}
      </div>
    </div>

    <BottomNavigation activeScreen="home" onNavigate={onNavigate} />
  </motion.div>
);

const ReportDetailScreen = ({ reportType, onNavigate, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: reportType?.label || '',
    description: '',
    severity: 'medium',
    images: [],
    location: 'الخرطوم، شارع النيل',
    autoLocation: true
  });

  const handleSubmit = () => {
    if (!formData.description.trim()) {
      alert('الرجاء إدخال وصف للبلاغ');
      return;
    }
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-24"
      dir="rtl"
    >
      <div className="p-6">
        <AppHeader 
          title="SafeCity" 
          onBack={() => onNavigate('home')} 
          showLogo 
        />

        <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {formData.type}
        </h2>
        <p className="text-gray-600 mb-8" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
          أكمل التفاصيل لإرسال البلاغ
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
              وصف مختصر للبلاغ
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-right focus:border-blue-500 focus:outline-none transition-all h-32 resize-none"
              placeholder="أدخل وصفًا موجزًا للحادث"
              style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
              مستوى الخطورة
            </label>
            <div className="flex gap-3">
              {Object.entries(SEVERITY_CONFIG).map(([value, config]) => (
                <button
                  key={value}
                  onClick={() => setFormData({...formData, severity: value})}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    formData.severity === value
                      ? `${config.color} text-white shadow-lg`
                      : 'bg-white text-gray-600 border-2 border-gray-200'
                  }`}
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
              تحميل صور (اختياري - حد أقصى 5)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map(i => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  className="aspect-square bg-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition-all"
                >
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-500" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                    إضافة
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
              رفع فيديو (اختياري - الحد الأقصى 30 ثانية)
            </label>
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center gap-3 hover:border-blue-500 transition-all"
            >
              <Video className="w-6 h-6 text-gray-400" />
              <span className="text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                اضغط لإضافة فيديو
              </span>
            </motion.button>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
              الموقع
            </label>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={formData.autoLocation}
                  onChange={(e) => setFormData({...formData, autoLocation: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-gray-700" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                  استخراج الموقع تلقائيًا
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                  {formData.location}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
              <p className="text-sm text-red-800" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                بالموافقة على الإرسال، تؤكد أن هذا بلاغ رسمي ولا يمكن التراجع عنه قانونياً.
              </p>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full" icon={Send}>
            إرسال البلاغ
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const SuccessScreen = ({ report, onNavigate }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-6"
    dir="rtl"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", delay: 0.2 }}
      className="bg-green-500 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl"
    >
      <Check className="w-12 h-12 text-white" strokeWidth={3} />
    </motion.div>

    <motion.h2
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-3xl font-bold text-gray-900 mb-4 text-center"
      style={{ fontFamily: 'Cairo, sans-serif' }}
    >
      تم إرسال البلاغ بنجاح
    </motion.h2>

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-6 mb-8 shadow-xl max-w-md w-full"
    >
      <div className="text-center mb-6">
        <div className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
          رقم البلاغ
        </div>
        <div className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {report?.id}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <span className="text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>النوع</span>
          <span className="font-semibold text-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {report?.type}
          </span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <span className="text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>الحالة</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
            مستلم
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>وقت الاستجابة المتوقع</span>
          <span className="font-semibold text-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>
            5-10 دقائق
          </span>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 rounded-xl p-4">
        <p className="text-sm text-blue-800 text-center" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
          فريق الاستجابة في الطريق. سيتم الاتصال بك قريباً.
        </p>
      </div>
    </motion.div>

    <div className="flex gap-4 w-full max-w-md">
      <Button onClick={() => onNavigate('home')} className="flex-1">
        العودة للرئيسية
      </Button>
      <Button onClick={() => onNavigate('report-status')} variant="secondary" className="flex-1">
        تتبع البلاغ
      </Button>
    </div>
  </motion.div>
);

const MapScreen = ({ reports, onNavigate, onReportClick }) => {
  const [filter, setFilter] = useState('24h');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 pb-24"
      dir="rtl"
    >
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>SafeCity</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
          الخريطة الأمنية
        </h2>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {['24h', '7d', '30d', 'all'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap font-semibold transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {f === '24h' ? '24 ساعة' : f === '7d' ? '7 أيام' : f === '30d' ? '30 يوم' : 'الكل'}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100">
        <div className="absolute inset-0 bg-white bg-opacity-50">
          {reports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onReportClick(report)}
              className={`absolute w-12 h-12 rounded-full ${getSeverityColor(report.severity)} bg-opacity-40 border-4 border-white shadow-lg cursor-pointer flex items-center justify-center hover:scale-110 transition-transform`}
              style={{
                top: `${20 + i * 15}%`,
                right: `${15 + i * 20}%`
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-6 h-6 rounded-full ${getSeverityColor(report.severity)}`}
              />
            </motion.div>
          ))}
        </div>

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <button className="bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Plus className="w-6 h-6 text-gray-700" />
          </button>
          <button className="bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Minus className="w-6 h-6 text-gray-700" />
          </button>
          <button className="bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Filter className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-xl p-4">
          <div className="text-sm font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
            مستوى الخطورة
          </div>
          {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
              <span className="text-xs text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                {config.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
          البلاغات في المنطقة ({reports.length})
        </h3>
        <div className="space-y-3">
          {reports.map((report) => (
            <ReportCard 
              key={report.id} 
              report={report} 
              onClick={() => onReportClick(report)}
            />
          ))}
        </div>
      </div>

      <BottomNavigation activeScreen="map" onNavigate={onNavigate} />
    </motion.div>
  );
};

const ReportStatusScreen = ({ report, onNavigate }) => {
  const timeline = [
    { status: 'تم الاستلام', time: 'منذ ساعتين', active: true, complete: true },
    { status: 'قيد المراجعة', time: 'منذ ساعة', active: true, complete: true },
    { status: 'تم التعيين للفريق', time: 'منذ 30 دقيقة', active: true, complete: false },
    { status: 'في الطريق', time: 'قريباً', active: false, complete: false }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-24"
      dir="rtl"
    >
      <div className="p-6">
        <AppHeader 
          title="SafeCity" 
          onBack={() => onNavigate('home')} 
          showLogo 
        />

        <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
          تفاصيل البلاغ
        </h2>
        <p className="text-gray-600 mb-8" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
          رقم البلاغ: {report?.id}
        </p>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                  الحالة الحالية
                </div>
                <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {report?.status}
                </div>
              </div>
              <div className={`w-16 h-16 rounded-full ${getSeverityBgColor(report?.severity)} flex items-center justify-center`}>
                <Activity className={`w-8 h-8 ${getSeverityTextColor(report?.severity)}`} />
              </div>
            </div>

            <div className="space-y-4">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.complete ? 'bg-blue-600' : item.active ? 'bg-blue-200' : 'bg-gray-200'
                  }`}>
                    {item.complete ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <div className={`w-3 h-3 rounded-full ${item.active ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${item.active ? 'text-gray-900' : 'text-gray-400'}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {item.status}
                    </div>
                    <div className="text-sm text-gray-500" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              معلومات البلاغ
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>النوع</span>
                <span className="font-semibold text-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {report?.type}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>الموقع</span>
                <span className="font-semibold text-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {report?.location}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>الوقت</span>
                <span className="font-semibold text-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {report?.time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>الخطورة</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityBgColor(report?.severity)} ${getSeverityTextColor(report?.severity)}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {getSeverityLabel(report?.severity)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="primary" icon={Phone} className="bg-gradient-to-r from-green-600 to-green-700">
              اتصال
            </Button>
            <Button onClick={() => onNavigate('map')} variant="secondary" icon={MapPin}>
              الخريطة
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HistoryScreen = ({ reports, onNavigate, onReportClick }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-24"
    dir="rtl"
  >
    <div className="p-6">
      <AppHeader 
        title="SafeCity" 
        onBack={() => onNavigate('home')} 
        showLogo 
      />

      <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
        سجل البلاغات
      </h2>
      <p className="text-gray-600 mb-8" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
        جميع البلاغات المرسلة ({reports.length})
      </p>

      <div className="space-y-3">
        {reports.map((report) => (
          <ReportCard 
            key={report.id} 
            report={report} 
            onClick={() => onReportClick(report)}
          />
        ))}
      </div>
    </div>

    <BottomNavigation activeScreen="history" onNavigate={onNavigate} />
  </motion.div>
);

const ProfileScreen = ({ userData, onNavigate, onLogout }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-24"
    dir="rtl"
  >
    <div className="p-6">
      <AppHeader 
        title="SafeCity" 
        showLogo 
      />

      <div className="text-center mb-8">
        <div className="bg-blue-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {userData?.name || 'محي الدين'}
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
          مستخدم نشط
        </p>
      </div>

      <div className="space-y-3">
        {[
          { icon: User, label: 'تعديل الملف الشخصي', screen: 'edit-profile' },
          { icon: Bell, label: 'الإشعارات', screen: 'notifications' },
          { icon: Settings, label: 'الإعدادات', screen: 'settings' },
          { icon: Shield, label: 'سياسة الخصوصية', screen: 'privacy' },
          { icon: FileText, label: 'الشروط والأحكام', screen: 'terms' }
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => item.screen && onNavigate(item.screen)}
            className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center justify-between hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <item.icon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {item.label}
              </span>
            </div>
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
        ))}

        <button
          onClick={onLogout}
          className="w-full bg-red-50 rounded-2xl p-4 shadow-md flex items-center justify-center gap-3 hover:bg-red-100 transition-all"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          <span className="font-semibold text-red-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
            تسجيل الخروج
          </span>
        </button>
      </div>
    </div>

    <BottomNavigation activeScreen="profile" onNavigate={onNavigate} />
  </motion.div>
);

const ExtremeReportModal = ({ onClose, onSubmit, countdown }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
    onClick={onClose}
    dir="rtl"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
    >
      <div className="text-center">
        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>

        <h2 className="text-3xl font-bold text-red-600 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
          تحذير — حالة بالغة الخطورة
        </h2>

        <p className="text-lg text-gray-700 mb-8 leading-relaxed" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
          هذا البلاغ يُرسَل فَوْرياً دون إدخال تفاصِيل. يُستخدم فقط في الحالات القصوى.
        </p>

        {countdown !== null ? (
          <div className="mb-8">
            <motion.div
              key={countdown}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-7xl font-bold text-red-600 mb-4"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {countdown}
            </motion.div>
            <p className="text-gray-600" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              جاري الإرسال...
            </p>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button onClick={onClose} variant="ghost" className="flex-1">
              إلغاء
            </Button>
            <Button onClick={onSubmit} variant="danger" className="flex-1">
              إرسال الآن
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  </motion.div>
);

// ============================================
// MAIN APP COMPONENT
// ============================================

const SafeCityApp = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userData, setUserData] = useState(null);
  const [reports, setReports] = useState(DUMMY_REPORTS);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [showExtremeModal, setShowExtremeModal] = useState(false);
  const [extremeCountdown, setExtremeCountdown] = useState(null);

  useEffect(() => {
    if (currentScreen === 'splash') {
      setTimeout(() => setCurrentScreen('onboarding'), 3000);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (extremeCountdown !== null && extremeCountdown > 0) {
      const timer = setTimeout(() => setExtremeCountdown(extremeCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (extremeCountdown === 0) {
      handleExtremeSubmit();
    }
  }, [extremeCountdown]);

  const handleExtremeSubmit = () => {
    const newReport = {
      id: `R-2025-${String(reports.length + 1).padStart(3, '0')}`,
      type: 'بلاغ شديد الخطورة',
      severity: 'high',
      status: 'مستلم',
      location: 'الخرطوم، شارع النيل',
      time: 'الآن',
      lat: 15.5007,
      lng: 32.5599,
      description: 'بلاغ طوارئ شديد'
    };
    setReports([newReport, ...reports]);
    setSelectedReport(newReport);
    setExtremeCountdown(null);
    setShowExtremeModal(false);
    setCurrentScreen('success');
  };

  const handleReportTypeClick = (type) => {
    if (type.id === 'extreme') {
      setShowExtremeModal(true);
    } else {
      setSelectedReportType(type);
      setCurrentScreen('report-detail');
    }
  };

  const handleReportSubmit = (formData) => {
    const newReport = {
      id: `R-2025-${String(reports.length + 1).padStart(3, '0')}`,
      type: formData.type,
      severity: formData.severity,
      status: 'مستلم',
      location: formData.location,
      time: 'الآن',
      lat: 15.5007,
      lng: 32.5599,
      description: formData.description
    };
    setReports([newReport, ...reports]);
    setSelectedReport(newReport);
    setCurrentScreen('success');
  };

  const handleLogin = (user) => {
    setUserData(user);
    setCurrentScreen('home');
  };

  const handleSignup = (user) => {
    setUserData(user);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentScreen('onboarding');
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setCurrentScreen('report-status');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen onNavigate={setCurrentScreen} />;
      case 'signup':
        return <SignupScreen onNavigate={setCurrentScreen} onSignup={handleSignup} />;
      case 'login':
        return <LoginScreen onNavigate={setCurrentScreen} onLogin={handleLogin} />;
      case 'home':
        return (
          <HomeScreen
            userData={userData}
            reports={reports}
            onNavigate={setCurrentScreen}
            onReportClick={handleReportClick}
            onReportTypeClick={handleReportTypeClick}
          />
        );
      case 'report-detail':
        return (
          <ReportDetailScreen
            reportType={selectedReportType}
            onNavigate={setCurrentScreen}
            onSubmit={handleReportSubmit}
          />
        );
      case 'success':
        return <SuccessScreen report={selectedReport} onNavigate={setCurrentScreen} />;
      case 'map':
        return (
          <MapScreen
            reports={reports}
            onNavigate={setCurrentScreen}
            onReportClick={handleReportClick}
          />
        );
      case 'report-status':
        return <ReportStatusScreen report={selectedReport} onNavigate={setCurrentScreen} />;
      case 'history':
        return (
          <HistoryScreen
            reports={reports}
            onNavigate={setCurrentScreen}
            onReportClick={handleReportClick}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            userData={userData}
            onNavigate={setCurrentScreen}
            onLogout={handleLogout}
          />
        );
      default:
        return <HomeScreen userData={userData} reports={reports} onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative overflow-hidden" style={{ fontFamily: 'Cairo, Noto Sans Arabic, sans-serif' }}>
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>

      <AnimatePresence>
        {showExtremeModal && (
          <ExtremeReportModal
            onClose={() => {
              setShowExtremeModal(false);
              setExtremeCountdown(null);
            }}
            onSubmit={() => setExtremeCountdown(3)}
            countdown={extremeCountdown}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SafeCityApp;