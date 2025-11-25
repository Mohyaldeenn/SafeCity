{/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-b-3xl shadow-xl p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>SafeCity</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative" onClick={() => 0 }>
              <Bell className="w-6 h-6 text-white" />
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {notifications}
                </motion.span>
              )}
            </button>
            <button onClick={() => 0 }>
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
          مرحباً، {"محي الدين" || userData?.name }
        </h1>
        <div className="flex items-center gap-2 text-blue-100">
          <MapPin className="w-4 h-4" />
          <span style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>الموقع: الخرطوم,أمدرمان</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
            الإجراءات السريعة
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {reportTypes.map((type, index) => (
              <motion.button
                key={type.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (type.id === 'extreme') {
                    setShowModal(true);
                  } else {
                    setReportForm({...reportForm, type: type.label});
                    setCurrentScreen('report-detail');
                  }
                }}
                className={`bg-gradient-to-br ${type.color} p-4 rounded-2xl text-white text-right shadow-lg`}
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
