import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  RotateCcw, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Award, 
  Volume2, 
  FileText,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { SPEAKING_TOPICS } from '../../data/speakingTopics';
import { saveSpeakingRecording, getSpeakingRecordings } from '../../services/storage';
import { SpeakingRecording } from '../../types/ielts';

interface SpeakingViewProps {
  selectedTopicId?: string;
  onOpenSearch?: () => void;
}

export const SpeakingView: React.FC<SpeakingViewProps> = ({
  selectedTopicId: initialTopicId,
  onOpenSearch
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId || SPEAKING_TOPICS[0].id);

  useEffect(() => {
    if (initialTopicId) {
      setSelectedTopicId(initialTopicId);
    }
  }, [initialTopicId]);
  const currentTopic = SPEAKING_TOPICS.find(t => t.id === selectedTopicId) || SPEAKING_TOPICS[1];

  // Part 2 Prep & Speech Timers
  const [prepSeconds, setPrepSeconds] = useState(60);
  const [isPrepping, setIsPrepping] = useState(false);
  const [scratchNotes, setScratchNotes] = useState('');

  const [speechSeconds, setSpeechSeconds] = useState(120);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Audio Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [savedRecordings, setSavedRecordings] = useState<SpeakingRecording[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    setSavedRecordings(getSpeakingRecordings());
  }, []);

  // 1-minute prep timer
  useEffect(() => {
    if (!isPrepping) return;
    const interval = setInterval(() => {
      setPrepSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPrepping(false);
          // Play notification sound
          playNotificationBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPrepping]);

  // 2-minute speech timer
  useEffect(() => {
    if (!isSpeaking) return;
    const interval = setInterval(() => {
      setSpeechSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSpeaking(false);
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  const playNotificationBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio context not supported or user gesture needed');
    }
  };

  const startPrep = () => {
    setPrepSeconds(60);
    setIsPrepping(true);
  };

  // Start native audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const newRec: SpeakingRecording = {
          id: `sp_rec_${Date.now()}`,
          topicId: currentTopic.id,
          topicTitle: currentTopic.title,
          part: currentTopic.part,
          createdAt: new Date().toISOString(),
          durationSeconds: 120 - speechSeconds,
          audioBlobUrl: url
        };
        saveSpeakingRecording(newRec);
        setSavedRecordings(prev => [newRec, ...prev]);

        // Stop media stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsSpeaking(true);
      setSpeechSeconds(120);
    } catch (err) {
      alert('请允许浏览器麦克风权限以录制口语答题。');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header & Topic Switcher */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-1">
            <Mic className="w-4 h-4" />
            <span>IELTS Speaking Examination Studio</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">
            Part {currentTopic.part}: {currentTopic.title}
          </h1>
          <span className="text-xs text-slate-400 mt-0.5 inline-block">
            {currentTopic.category} · 真实考官 1 对 1 仿真互动体验
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="px-3 py-2 bg-rose-950/40 text-rose-300 hover:text-rose-200 border border-rose-800/40 rounded-lg text-xs font-semibold"
            >
              搜题库
            </button>
          )}

          <select
            value={selectedTopicId}
            onChange={(e) => {
              setSelectedTopicId(e.target.value);
              setIsPrepping(false);
              setIsSpeaking(false);
              setPrepSeconds(60);
              setSpeechSeconds(120);
              setAudioUrl(null);
            }}
            className="bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-rose-500"
          >
            {SPEAKING_TOPICS.map(t => (
              <option key={t.id} value={t.id}>
                PART {t.part}: {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cue Card / Questions & Preparation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Part 2 Cue Card Mode */}
          {currentTopic.part === 2 && currentTopic.cueCard && (
            <div className="bg-white rounded-2xl p-6 border-2 border-rose-100 shadow-sm space-y-5">
              <div className="border-b border-rose-100 pb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  CANDIDATE CUE CARD (考生命题卡)
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700">
                  Part 2 独白陈述
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">
                  {currentTopic.cueCard.topic}
                </h2>
                <p className="text-xs text-slate-500 italic">
                  You should say:
                </p>
                <ul className="space-y-2 pl-5 list-disc text-xs text-slate-700 font-medium leading-relaxed">
                  {currentTopic.cueCard.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* 1-Minute Prep Section */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800">
                      1 分钟备考草稿时间:
                    </span>
                    <span className="font-mono font-bold text-sm text-amber-600">
                      {prepSeconds} 秒
                    </span>
                  </div>

                  {!isPrepping && prepSeconds === 60 ? (
                    <button
                      onClick={startPrep}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded shadow-sm transition-colors"
                    >
                      开始 1 分钟准备
                    </button>
                  ) : (
                    <span className={`text-xs font-semibold ${isPrepping ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`}>
                      {isPrepping ? '正在计时中...' : '准备时间已结束'}
                    </span>
                  )}
                </div>

                <textarea
                  value={scratchNotes}
                  onChange={(e) => setScratchNotes(e.target.value)}
                  placeholder="在此草稿区快速写下 3-4 个答题关键词（如 device name, features, benefit 等）..."
                  rows={3}
                  className="w-full p-2.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* 2-Minute Speech Recording Bar */}
              <div className="bg-gradient-to-r from-slate-900 to-rose-950 text-white rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-rose-300 font-medium">Part 2 答题录音</span>
                    <div className="text-lg font-bold">2 分钟个人陈述</div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-sm font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                    <Clock className="w-4 h-4 text-rose-400" />
                    <span>{speechSeconds}s / 120s</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-1.5 bg-rose-500 transition-all duration-1000"
                    style={{ width: `${((120 - speechSeconds) / 120) * 100}%` }}
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <Mic className="w-4 h-4" />
                      <span>开始录音作答</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-2 transition-all animate-pulse"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      <span>停止录音并保存</span>
                    </button>
                  )}

                  {audioUrl && !isRecording && (
                    <div className="flex-1 flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                      <audio src={audioUrl} controls className="w-full h-8" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Part 1 & Part 3 Questions View */}
          {(currentTopic.part === 1 || currentTopic.part === 3) && currentTopic.questions && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  考官问题列表 (Examiner Questions)
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  Part {currentTopic.part}
                </span>
              </div>

              <div className="space-y-3">
                {currentTopic.questions.map((q, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {q}
                    </p>
                  </div>
                ))}
              </div>

              {/* Part 1/3 Quick Recorder */}
              <div className="pt-2 flex items-center gap-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2 transition-all"
                  >
                    <Mic className="w-4 h-4" />
                    <span>录制我的作答</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2 transition-all animate-pulse"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>结束录音</span>
                  </button>
                )}

                {audioUrl && !isRecording && (
                  <div className="flex-1">
                    <audio src={audioUrl} controls className="w-full h-8" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Band 8+ Sample & Vocabulary Highlights (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Model Answer Showcase */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Band 8.5+ 考官推荐高分示范
              </span>
              <span className="text-[11px] text-indigo-600 font-semibold">Native Flow</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-serif bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-line">
              {currentTopic.highBandSample}
            </p>

            {/* High-Scoring Collocations */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-rose-500" />
                高分地道句型与习语积累:
              </span>
              <div className="space-y-2">
                {currentTopic.vocabularyAndIdioms.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100 text-xs space-y-0.5">
                    <div className="font-bold text-rose-900">{item.term}</div>
                    <div className="text-[11px] text-rose-700">{item.definition}</div>
                    <div className="text-[11px] text-slate-600 italic">例: "{item.example}"</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Past Recordings List */}
          {savedRecordings.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-slate-600" />
                我的录音复盘记录 ({savedRecordings.length})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savedRecordings.slice(0, 5).map(rec => (
                  <div key={rec.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">Part {rec.part} - {rec.topicTitle.slice(0, 20)}...</div>
                      <div className="text-[10px] text-slate-400">{new Date(rec.createdAt).toLocaleString()}</div>
                    </div>
                    {rec.audioBlobUrl && (
                      <audio src={rec.audioBlobUrl} controls className="h-6 w-36" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
