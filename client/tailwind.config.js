/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Màu Chính (Dùng chung) ---
        "primary": "#2563eb",       // Blue-600
        "primary-hover": "#1d4ed8", // Blue-700
        "primary-light": "#eff6ff", // Blue-50
        
        // --- Màu Nền & Surface ---
        "background-body": "#f8fafc", // Slate-50
        "surface-white": "#ffffff",
        
        // --- Màu Text & Border ---
        "border-light": "#e2e8f0",  // Slate-200
        "text-main": "#0f172a",     // Slate-900
        "text-secondary": "#64748b", // Slate-500
        
        // --- Màu riêng cho trạng thái POS ---
        "pos-success": "#22c55e",   // Green-500
        "pos-warning": "#f59e0b",   // Amber-500
        "pos-error": "#ef4444",     // Red-500
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
      },
      // --- CẤU HÌNH MỚI CHO BẾP (KDS) ---
      height: {
         'top-bar': '56px',
         'bottom-bar': '36px',
         'main-area': 'calc(100vh - 92px)', // Tự động trừ đi header và footer
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Hiệu ứng nhấp nháy cho đơn quá giờ
        blink: {
            '0%, 100%': { borderColor: '#ef4444', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)' },
            '50%': { borderColor: '#f87171', boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.2)' },
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'blink': 'blink 2s infinite', // Animation cảnh báo
      }
    },
  },
  plugins: [],
}