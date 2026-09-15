import React, { useState } from 'react';
import { 
  X, 
  Target, 
  Calendar, 
  Clock, 
  Sparkles, 
  Check, 
  Sliders, 
  Award,
  AlertCircle
} from 'lucide-react';
import { PersonalizedPlanConfig, DEFAULT_PLAN_CONFIG } from '../../data/studyPlanData';

interface AdaptationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PersonalizedPlanConfig;
  onSave: (newConfig: PersonalizedPlanConfig) => void;
}

export const AdaptationConfigModal: React.FC<AdaptationConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [currentBand, setCurrentBand] = useState(config.currentBand);
  const [targetBand, setTargetBand] = useState(config.targetBand);
  const [totalDays, setTotalDays] = useState(config.totalDays);
  const [dailyHours, setDailyHours] = useState(config.dailyHours);
  const [targetListening, setTargetListening] = useState(config.targetListening);
  const [targetReading, setTargetReading] = useState(config.targetReading);
  const [targetWriting, setTargetWriting] = useState(config.targetWriting);
  const [targetSpeaking, setTargetSpeaking] = useState(config.targetSpeaking);
  const [focusWeaknesses, setFocusWeaknesses] = useState<string[]>(config.focusWeaknesses || []);

  if (!isOpen) return null;

  const weaknessOptions = [
    '词汇量不足2500',
    '长难句语法结构混乱',
    '听力连读与数字拼写慢',
    '写作思路受限/论据单薄',
    '口语Part 2卡顿不连贯',
    '机考控时与打字速度慢'
  ];

  const toggleWeakness = (w: string) => {
    setFocusWeaknesses(prev => 
      prev.includes(w) ? prev.filter(item => item !== w) : [...prev, w]
    );
  };

  const handleQuickReset = () => {
    setCurrentBand(4.0);
    setTargetBand(7.0);
    setTotalDays(178);
    setDailyHours(2.5);
    setTargetListening(7.5);
    setTargetReading(7.5);
    setTargetWriting(6.5);
    setTargetSpeaking(6.5);
    setFocusWeaknesses(DEFAULT_PLAN_CONFIG.focusWeaknesses);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...config,
      currentBand,
      targetBand,
      totalDays,
      dailyHours,
      targetListening,
      targetReading,
      targetWriting,
      targetSpeaking,
      focusWeaknesses
    });
    onClose();
  };

  const calculatedOverall = ((targetListening + targetReading + targetWriting + targetSpeaking) / 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/35 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
      <div 
        className="bg-white/95 backdrop-blur-2xl rounded-3xl w-full max-w-xl shadow-[0_24px_80px_rgba(0,0,0,0.18)] border border-black/[0.08] overflow-hidden flex flex-col animate-scaleUp max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/[0.04] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black/[0.04] text-[#1d1d1f] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-[#1d1d1f]">个人备考适配设定 (Personal Adaptation)</h2>
              <p className="text-[11px] text-[#86868b] font-normal">根据当前基础与备考周期，量身定制科学提分路线图</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-[#1d1d1f] text-sm">
          {/* Top Presets: Current & Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.03]">
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#86868b]" />
                当前平均基础分
              </label>
              <div className="flex items-center gap-2">
                <select 
                  value={currentBand}
                  onChange={(e) => setCurrentBand(parseFloat(e.target.value))}
                  className="w-full bg-white border border-black/[0.08] rounded-xl p-2.5 font-semibold text-[#1d1d1f] text-sm focus:outline-none shadow-2xs"
                >
                  <option value={3.5}>Band 3.5 (初学起步)</option>
                  <option value={4.0}>Band 4.0 (有限水平 · 推荐)</option>
                  <option value={4.5}>Band 4.5 (基础薄弱)</option>
                  <option value={5.0}>Band 5.0 (基础中等)</option>
                  <option value={5.5}>Band 5.5 (面临瓶颈)</option>
                  <option value={6.0}>Band 6.0 (合格水平)</option>
                </select>
              </div>
              <p className="text-[11px] text-[#86868b] mt-1.5 font-normal">
                4.0 分核心难点：词汇量偏小、长难句读不懂、听力抓不住信息。
              </p>
            </div>

            <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.03]">
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#86868b]" />
                目标期望总分
              </label>
              <div className="flex items-center gap-2">
                <select 
                  value={targetBand}
                  onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                  className="w-full bg-white border border-black/[0.08] rounded-xl p-2.5 font-semibold text-[#1d1d1f] text-sm focus:outline-none shadow-2xs"
                >
                  <option value={6.5}>Band 6.5 (常规直录)</option>
                  <option value={7.0}>Band 7.0 (名校通用 · 推荐)</option>
                  <option value={7.5}>Band 7.5 (顶尖名校/法学)</option>
                  <option value={8.0}>Band 8.0 (极高要求)</option>
                </select>
              </div>
              <p className="text-[11px] text-[#86868b] mt-1.5 font-normal">
                达成 7.0 分策略：听读双 7.5 分拉高均分，写作口语稳过 6.5 分。
              </p>
            </div>
          </div>

          {/* Timeline & Daily Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#86868b]" />
                备考总周期（天数）
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  min={30} 
                  max={365} 
                  value={totalDays}
                  onChange={(e) => setTotalDays(Math.max(1, parseInt(e.target.value) || 178))}
                  className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-sm font-semibold text-[#1d1d1f] focus:outline-none shadow-2xs"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#86868b] font-normal">天</span>
              </div>
              <span className="text-[11px] text-[#86868b] block mt-1 font-normal">
                当前设定：178 天（约 6 个月，适合 4.0 稳步跃升 7.0）
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#86868b]" />
                每日规划投入时长
              </label>
              <select 
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-sm font-semibold text-[#1d1d1f] focus:outline-none shadow-2xs"
              >
                <option value={1.5}>1.5 小时 / 天 (在职轻度)</option>
                <option value={2.0}>2.0 小时 / 天 (兼顾学业)</option>
                <option value={2.5}>2.5 小时 / 天 (推荐黄金配比)</option>
                <option value={3.0}>3.0 小时 / 天 (高强度突破)</option>
                <option value={4.0}>4.0 小时 / 天 (全脱产备战)</option>
              </select>
              <span className="text-[11px] text-[#86868b] block mt-1 font-normal">
                黄金配比：每天 2.5 小时，兼顾词汇、输入（听读）与输出（写说）
              </span>
            </div>
          </div>

          {/* 4 Skills Target Allocation */}
          <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.03]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-xs text-[#1d1d1f] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#86868b]" />
                四科提分配置方案
              </span>
              <span className="text-xs font-semibold text-[#1d1d1f] tabular-nums">
                核算总分：Band {calculatedOverall.toFixed(2)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[11px] text-[#86868b] block mb-1">听力 Listening</span>
                <input 
                  type="number" 
                  step="0.5" 
                  min="4.0" 
                  max="9.0" 
                  value={targetListening} 
                  onChange={(e) => setTargetListening(parseFloat(e.target.value) || 7.5)}
                  className="w-full bg-white border border-black/[0.08] rounded-xl p-2 text-center font-semibold text-sm text-[#1d1d1f] shadow-2xs"
                />
              </div>
              <div>
                <span className="text-[11px] text-[#86868b] block mb-1">阅读 Reading</span>
                <input 
                  type="number" 
                  step="0.5" 
                  min="4.0" 
                  max="9.0" 
                  value={targetReading} 
                  onChange={(e) => setTargetReading(parseFloat(e.target.value) || 7.5)}
                  className="w-full bg-white border border-black/[0.08] rounded-xl p-2 text-center font-semibold text-sm text-[#1d1d1f] shadow-2xs"
                />
              </div>
              <div>
                <span className="text-[11px] text-[#86868b] block mb-1">写作 Writing</span>
                <input 
                  type="number" 
                  step="0.5" 
                  min="4.0" 
                  max="9.0" 
                  value={targetWriting} 
                  onChange={(e) => setTargetWriting(parseFloat(e.target.value) || 6.5)}
                  className="w-full bg-white border border-black/[0.08] rounded-xl p-2 text-center font-semibold text-sm text-[#1d1d1f] shadow-2xs"
                />
              </div>
              <div>
                <span className="text-[11px] text-[#86868b] block mb-1">口语 Speaking</span>
                <input 
                  type="number" 
                  step="0.5" 
                  min="4.0" 
                  max="9.0" 
                  value={targetSpeaking} 
                  onChange={(e) => setTargetSpeaking(parseFloat(e.target.value) || 6.5)}
                  className="w-full bg-white border border-black/[0.08] rounded-xl p-2 text-center font-semibold text-sm text-[#1d1d1f] shadow-2xs"
                />
              </div>
            </div>
            <span className="text-[10px] text-[#86868b] block mt-2 text-center">
              雅思总分计算规则：四科平均后按 0.25 进位制向上进阶（如 6.75 ➔ 7.0 分）
            </span>
          </div>

          {/* Weakness Checklist */}
          <div>
            <label className="block text-xs font-semibold text-[#1d1d1f] mb-2">
              选择重点突破弱项（针对性生成学习模块重点）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {weaknessOptions.map((w) => {
                const checked = focusWeaknesses.includes(w);
                return (
                  <div 
                    key={w}
                    onClick={() => toggleWeakness(w)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      checked 
                        ? 'bg-[#1d1d1f] border-transparent text-white font-medium shadow-xs' 
                        : 'bg-white border-black/[0.06] text-[#1d1d1f] hover:bg-[#f5f5f7]'
                    }`}
                  >
                    <span>{w}</span>
                    {checked && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-black/[0.04]">
            <button
              type="button"
              onClick={handleQuickReset}
              className="text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors cursor-pointer"
            >
              恢复 4.0➔7.0 (178天) 默认方案
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-black/[0.08] text-[#1d1d1f] hover:bg-[#f5f5f7] text-xs font-medium transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                保存并应用方案
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
