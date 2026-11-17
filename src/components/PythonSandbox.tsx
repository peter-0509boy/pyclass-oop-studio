import {useEffect, useRef, useState} from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Play,
  RotateCcw,
  Terminal,
  Trash2,
} from 'lucide-react';
import {SANDBOX_PRESETS} from '../data/oopContent';
import {
  executePythonCode,
  getPyodide,
  isPyodideLoaded,
} from '../services/pyodideRunner';
import {PyodideEngineState, PythonExecutionResult} from '../types/oop';

export function PythonSandbox() {
  const [selectedPresetId, setSelectedPresetId] = useState(
    SANDBOX_PRESETS[0].id
  );
  const [code, setCode] = useState(SANDBOX_PRESETS[0].code);
  const [engineState, setEngineState] = useState<PyodideEngineState>(() =>
    isPyodideLoaded() ? 'ready' : 'idle'
  );
  const [engineError, setEngineError] = useState<string | null>(null);
  const [result, setResult] = useState<PythonExecutionResult | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);

  const activePreset =
    SANDBOX_PRESETS.find((p) => p.id === selectedPresetId) ??
    SANDBOX_PRESETS[0];

  // Warm up Pyodide WebAssembly engine when user enters Sandbox
  useEffect(() => {
    let mounted = true;
    if (isPyodideLoaded()) {
      setEngineState('ready');
      return;
    }

    setEngineState('loading');
    getPyodide()
      .then(() => {
        if (mounted) {
          setEngineState('ready');
          setEngineError(null);
        }
      })
      .catch((err) => {
        if (mounted) {
          setEngineState('error');
          setEngineError(
            err instanceof Error ? err.message : 'Pyodide 載入失敗'
          );
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSelectPreset = (presetId: string) => {
    const found = SANDBOX_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setSelectedPresetId(found.id);
    setCode(found.code);
    setResult(null);
  };

  const handleResetCode = () => {
    setCode(activePreset.code);
    setResult(null);
  };

  const handleRunCode = async () => {
    if (engineState === 'running') return;
    setEngineState('running');
    setEngineError(null);

    try {
      const execResult = await executePythonCode(code);
      setResult(execResult);
      setEngineState('ready');
    } catch (err) {
      setEngineState('error');
      setEngineError(
        err instanceof Error ? err.message : '無法執行 Python 程式碼'
      );
    }
  };

  // Support Tab -> 4 spaces and Ctrl/Cmd+Enter -> Run
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const updated = code.slice(0, start) + '    ' + code.slice(end);
      setCode(updated);

      window.requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4;
          textareaRef.current.selectionEnd = start + 4;
        }
      });
    }
  };

  const handleScrollSync = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lineCount = Math.max(1, code.split('\n').length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs font-medium text-[#38BDF8] tracking-wide">
            模組 03 · 瀏覽器端真實 Python 執行沙盒
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white text-balance">
            Python 互動程式碼實驗室（Pyodide WebAssembly）
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            直接在瀏覽器內撰寫與修改 class 程式碼，按下「執行程式（Run）」即可透過真實 Python 直譯器執行；若遇到語法或縮排問題，終端機下方會附上繁體中文除錯建議。
          </p>
        </div>
      </div>

      {/* Preset Selector & Run Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0F172A] border border-[#1E293B] rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          {SANDBOX_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#131D33] border-[#38BDF8] text-[#38BDF8]'
                    : 'bg-[#070B12] border-[#1E293B] text-[#94A3B8] hover:text-white'
                }`}
              >
                {preset.title}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-[#94A3B8] whitespace-nowrap">
            {engineState === 'loading' && '正在載入 Pyodide WebAssembly 引擎...'}
            {engineState === 'ready' && 'Python 引擎已就緒（Ctrl + Enter 執行）'}
            {engineState === 'running' && '程式執行中...'}
            {engineState === 'error' && '引擎連線異常'}
          </span>

          <button
            type="button"
            onClick={handleResetCode}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-[#070B12] border border-[#1E293B] hover:border-[#334155] text-[#CBD5E1] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>重設範例</span>
          </button>

          <button
            type="button"
            onClick={handleRunCode}
            disabled={engineState === 'running'}
            className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#38BDF8] hover:bg-[#0EA5E9] disabled:opacity-60 text-[#070B12] transition-colors cursor-pointer inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            {engineState === 'running' || engineState === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Play className="w-4 h-4" aria-hidden="true" />
            )}
            <span>
              {engineState === 'loading'
                ? '載入後執行'
                : engineState === 'running'
                  ? '執行中...'
                  : '執行程式（Run）'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Split IDE Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Code Editor */}
        <section
          aria-label="Python 程式碼編輯器"
          className="lg:col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-xl flex flex-col overflow-hidden min-h-[460px]"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-[#1E293B] bg-[#0B111A]">
            <span className="font-mono text-xs text-[#CBD5E1]">
              main.py · {activePreset.description}
            </span>
            <span className="font-mono-tabular text-[11px] text-[#64748B] whitespace-nowrap shrink-0">
              {lineCount} 行
            </span>
          </div>

          <div className="relative flex flex-1 bg-[#070B12] min-h-[400px]">
            {/* Line Numbers Gutter */}
            <div
              ref={gutterRef}
              aria-hidden="true"
              className="w-11 py-4 pr-2 text-right font-mono-tabular text-xs leading-6 text-[#475569] bg-[#080D16] border-r border-[#1E293B] select-none overflow-hidden shrink-0"
            >
              {Array.from({length: lineCount}, (_, idx) => (
                <div key={idx + 1}>{idx + 1}</div>
              ))}
            </div>

            {/* Editable Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleEditorKeyDown}
              onScroll={handleScrollSync}
              spellCheck={false}
              aria-label="Python 程式碼輸入區"
              className="flex-1 w-full h-full min-h-[400px] p-4 bg-transparent text-[#E2E8F0] font-mono text-[13px] leading-6 resize-none focus:outline-none overflow-auto"
            />
          </div>
        </section>

        {/* Right: Terminal Output & Chinese Debugger */}
        <section
          aria-label="終端機執行輸出視窗"
          className="lg:col-span-5 bg-[#0F172A] border border-[#1E293B] rounded-xl flex flex-col overflow-hidden min-h-[460px]"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-[#1E293B] bg-[#0B111A]">
            <div className="flex items-center gap-2 text-xs font-medium text-white">
              <Terminal className="w-4 h-4 text-[#2DD4BF]" aria-hidden="true" />
              <span>終端機輸出（Terminal）</span>
            </div>

            <div className="flex items-center gap-3">
              {result && (
                <span className="font-mono-tabular text-[11px] text-[#64748B]">
                  {result.durationMs} ms
                </span>
              )}
              <button
                type="button"
                onClick={() => setResult(null)}
                aria-label="清除終端機輸出"
                className="text-xs text-[#64748B] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>清除</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 bg-[#070B12] flex flex-col justify-between gap-4 overflow-y-auto">
            {engineError && (
              <div className="bg-[#FB7185]/10 border border-[#FB7185]/40 rounded-lg p-4 text-xs text-[#FDA4AF] space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-[#FB7185]">
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                  <span>Pyodide 引擎載入失敗</span>
                </div>
                <p>{engineError}</p>
              </div>
            )}

            {!result && !engineError && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 space-y-2">
                <Terminal
                  className="w-8 h-8 text-[#334155]"
                  aria-hidden="true"
                />
                <p className="text-sm text-[#94A3B8]">
                  點擊上方「執行程式（Run）」查看 Python 輸出結果
                </p>
                <p className="text-xs text-[#64748B]">
                  小提示：試著切換到「練習三：除錯挑戰」體驗自動中文除錯提示！
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Explicit Status Header (Icon + Text, never hue-only) */}
                <div
                  className={`flex items-center gap-2 text-xs font-medium pb-2 border-b border-[#1E293B] ${
                    result.success ? 'text-[#2DD4BF]' : 'text-[#FB7185]'
                  }`}
                >
                  {result.success ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      <span>執行成功 · 正常結束</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                      <span>執行失敗 · 偵測到程式錯誤</span>
                    </>
                  )}
                </div>

                {/* Standard Output */}
                {result.stdout && (
                  <pre className="font-mono text-xs sm:text-[13px] text-[#E2E8F0] whitespace-pre-wrap leading-relaxed">
                    {result.stdout}
                  </pre>
                )}

                {result.success && !result.stdout && (
                  <p className="text-xs text-[#64748B] font-mono">
                    （程式執行完畢，沒有使用 print() 輸出內容）
                  </p>
                )}

                {/* Raw Python Traceback on Failure */}
                {result.stderr && (
                  <pre className="font-mono text-xs text-[#FDA4AF] bg-[#1A0D12] border border-[#FB7185]/30 rounded-lg p-3 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                    {result.stderr}
                  </pre>
                )}

                {/* Friendly Chinese Debugging Guide */}
                {result.zhHint && (
                  <div className="bg-[#0F172A] border border-[#38BDF8]/40 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#38BDF8]">
                        中文除錯提示 · {result.zhHint.errorType}
                      </span>
                      {result.zhHint.lineNumber !== null && (
                        <span className="font-mono-tabular text-[#2DD4BF]">
                          第 {result.zhHint.lineNumber} 行附近
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {result.zhHint.title}
                    </p>
                    <p className="text-xs text-[#CBD5E1] leading-relaxed">
                      {result.zhHint.suggestion}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
