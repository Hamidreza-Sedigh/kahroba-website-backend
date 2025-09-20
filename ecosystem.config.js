module.exports = {
    apps: [
      {
        name: "website-backend",
        script: "src/server.js",
        instances: 2,                         // تعداد پردازش‌ها (به اندازه CPU 2 core)
        exec_mode: "cluster",                 // حالت کلاستر برای استفاده از چند هسته
        max_memory_restart: "2G",             // اگر بیشتر از 1 گیگ رم مصرف کرد ری‌استارت بشه
        watch: false,                         // تغییر فایل‌ها ری‌استارت نکنه (مناسب پروداکشن)
        env: {
          NODE_ENV: "development"
        },
        env_production: {
          NODE_ENV: "production"
        }
      }
    ]
  }
  