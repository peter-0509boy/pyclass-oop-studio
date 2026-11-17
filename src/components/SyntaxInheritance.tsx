import {useState} from 'react';
import {
  ArrowDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import {SYNTAX_LESSONS} from '../data/oopContent';
import {SyntaxLesson} from '../types/oop';

export function SyntaxInheritance() {
  const [activeLessonId, setActiveLessonId] =
    useState<SyntaxLesson['id']>('basic');
  const [activeLineNumber, setActiveLineNumber] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const activeLesson =
    SYNTAX_LESSONS.find((l) => l.id === activeLessonId) ?? SYNTAX_LESSONS[0];

  const activeLine =
    activeLesson.lines.find((l) => l.lineNumber === activeLineNumber) ??
    activeLesson.lines[0];

  const handleSelectLesson = (id: SyntaxLesson['id']) => {
    setActiveLessonId(id);
    setActiveLineNumber(1);
    setCopied(false);
  };

  const handleCopyCode = async () => {
    const fullCode = activeLesson.lines.map((l) => l.code).join('\n');
    try {
      await navigator.clipboard.writeText(fullCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy via textarea if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = fullCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStepLine = (delta: number) => {
    const nonEmptyLines = activeLesson.lines.filter((l) => l.code.trim() !== '');
    const currentIdx = nonEmptyLines.findIndex(
      (l) => l.lineNumber === activeLineNumber
    );
    const nextIdx = Math.max(
      0,
      Math.min(nonEmptyLines.length - 1, currentIdx + delta)
    );
    setActiveLineNumber(nonEmptyLines[nextIdx].lineNumber);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs font-medium text-[#2DD4BF] tracking-wide">
            模組 02 · 語法解剖與繼承
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white text-balance">
            封裝防護罩與 super().__init__() 繼承脈絡
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            點擊程式碼中的任何一行，右側會即時顯示該行的白話文重點解析；切換上方範例頁籤，循序掌握基礎類別、私有封裝與父子類別繼承。
          </p>
        </div>
      </div>

      {/* Lesson Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {SYNTAX_LESSONS.map((lesson) => {
          const isActive = lesson.id === activeLesson.id;
          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => handleSelectLesson(lesson.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
                isActive
                  ? 'bg-[#0F172A] border-[#38BDF8] text-[#38BDF8]'
                  : 'bg-[#0B111A] border-[#1E293B] text-[#94A3B8] hover:text-white hover:border-[#334155]'
              }`}
            >
              <span>{lesson.title}</span>
              <span className="ml-2 font-mono text-xs text-[#64748B]">
                {lesson.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Two-Column Anatomy View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Code Card */}
        <section
          aria-label="Python 範例程式碼"
          className="lg:col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-xl flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#1E293B] bg-[#0B111A]">
            <div className="min-w-0">
              <h2 className="font-display text-base font-semibold text-white truncate">
                {activeLesson.title}
              </h2>
              <p className="text-xs text-[#94A3B8] truncate">
                {activeLesson.summary}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                copied
                  ? 'bg-[#2DD4BF]/15 border-[#2DD4BF] text-[#2DD4BF]'
                  : 'bg-[#0F172A] border-[#1E293B] hover:border-[#38BDF8] text-[#CBD5E1] hover:text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>已複製</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>複製程式碼</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 sm:p-4 overflow-x-auto flex-1 bg-[#070B12]">
            <div className="min-w-[460px] space-y-0.5 font-mono text-xs sm:text-[13px]">
              {activeLesson.lines.map((line) => {
                const isSelected = line.lineNumber === activeLineNumber;
                const isBlank = line.code.trim() === '';
                return (
                  <button
                    key={line.lineNumber}
                    type="button"
                    onClick={() => setActiveLineNumber(line.lineNumber)}
                    className={`w-full text-left flex items-start gap-3 px-2.5 py-1.5 rounded transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#131D33] text-white'
                        : 'hover:bg-[#0F172A]/80 text-[#CBD5E1]'
                    }`}
                  >
                    <span
                      className={`w-6 text-right select-none shrink-0 tabular-nums ${
                        isSelected ? 'text-[#38BDF8] font-semibold' : 'text-[#475569]'
                      }`}
                    >
                      {line.lineNumber}
                    </span>
                    <span
                      className={`flex-1 whitespace-pre ${
                        isBlank ? 'text-[#334155]' : ''
                      }`}
                    >
                      {isBlank ? ' ' : line.code}
                    </span>
                    {line.conceptTag && (
                      <span
                        className={`text-[11px] font-sans whitespace-nowrap shrink-0 ${
                          isSelected ? 'text-[#2DD4BF]' : 'text-[#64748B]'
                        }`}
                      >
                        {line.conceptTag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right: Line-by-line Explanation + Structural Diagram */}
        <aside className="lg:col-span-5 flex flex-col gap-5">
          {/* Active Line Explanation Card */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#38BDF8] font-semibold tabular-nums">
                  第 {activeLine.lineNumber} 行解剖
                </span>
                {activeLine.conceptTag && (
                  <>
                    <span className="text-[#475569]" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-[#2DD4BF] font-sans">
                      {activeLine.conceptTag}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleStepLine(-1)}
                  aria-label="上一行解說"
                  className="p-1.5 rounded bg-[#070B12] border border-[#1E293B] hover:border-[#38BDF8] text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => handleStepLine(1)}
                  aria-label="下一行解說"
                  className="p-1.5 rounded bg-[#070B12] border border-[#1E293B] hover:border-[#38BDF8] text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {activeLine.code.trim() !== '' && (
              <pre className="bg-[#070B12] border border-[#1E293B] rounded-lg px-3.5 py-2.5 font-mono text-xs text-[#38BDF8] overflow-x-auto">
                <code>{activeLine.code.trim()}</code>
              </pre>
            )}

            <p className="text-sm text-[#E2E8F0] leading-relaxed">
              {activeLine.note}
            </p>
          </div>

          {/* Visual Structural Diagram matching current lesson */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 flex-1 flex flex-col justify-between space-y-4">
            <h3 className="font-display text-sm font-semibold text-white">
              結構關係圖解
            </h3>

            {activeLesson.id === 'basic' && (
              <div className="space-y-3 text-xs">
                <div className="bg-[#070B12] border border-[#38BDF8]/40 rounded-lg p-3.5 space-y-2">
                  <div className="font-mono text-[#38BDF8] font-semibold">
                    class Hero (設計藍圖)
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[#94A3B8]">
                    <div className="bg-[#0F172A] p-2 rounded border border-[#1E293B]">
                      <div className="text-white font-medium mb-1">
                        資料屬性
                      </div>
                      <div className="font-mono text-[11px]">
                        self.name, self.hp, self.atk
                      </div>
                    </div>
                    <div className="bg-[#0F172A] p-2 rounded border border-[#1E293B]">
                      <div className="text-white font-medium mb-1">
                        行為方法
                      </div>
                      <div className="font-mono text-[11px]">
                        __init__(), attack()
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center text-[#2DD4BF]">
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#070B12] border border-[#2DD4BF]/40 rounded-lg p-3 font-mono">
                    <div className="text-[#2DD4BF] font-semibold">arthur</div>
                    <div className="text-[#94A3B8] mt-1">hp: 180, atk: 30</div>
                  </div>
                  <div className="bg-[#070B12] border border-[#2DD4BF]/40 rounded-lg p-3 font-mono">
                    <div className="text-[#2DD4BF] font-semibold">goblin</div>
                    <div className="text-[#94A3B8] mt-1">hp: 100, atk: 12</div>
                  </div>
                </div>
              </div>
            )}

            {activeLesson.id === 'encapsulation' && (
              <div className="space-y-3 text-xs">
                <div className="bg-[#070B12] border border-[#1E293B] rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[#CBD5E1]">
                    <span className="font-medium">外部程式碼存取</span>
                    <span className="font-mono text-[#FB7185]">
                      hero.__hp = -999 (阻擋)
                    </span>
                  </div>
                  <p className="text-[#64748B]">
                    雙底線私有屬性會被隱藏起來，防止外部直接破壞血量邏輯。
                  </p>
                </div>

                <div className="bg-[#070B12] border border-[#2DD4BF]/40 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-[#2DD4BF] font-semibold">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    <span>安全窗口：@property 與 heal()</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#CBD5E1]">
                    <Lock className="w-3.5 h-3.5 text-[#38BDF8]" aria-hidden="true" />
                    <span>
                      先檢查邊界（不可小於 0、不超過上限），再寫入私有變數{' '}
                      <code className="font-mono text-[#2DD4BF]">self.__hp</code>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeLesson.id === 'inheritance' && (
              <div className="space-y-3 text-xs">
                <div className="bg-[#070B12] border border-[#38BDF8]/40 rounded-lg p-3.5 space-y-1">
                  <div className="font-mono text-[#38BDF8] font-semibold">
                    父類別：class Hero
                  </div>
                  <div className="text-[#94A3B8]">
                    提供共通基礎：name、hp、atk
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[#2DD4BF] font-mono">
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  <span>super().__init__(name, hp, atk)</span>
                </div>

                <div className="bg-[#070B12] border border-[#2DD4BF]/40 rounded-lg p-3.5 space-y-1.5">
                  <div className="font-mono text-[#2DD4BF] font-semibold">
                    子類別：class Mage(Hero)
                  </div>
                  <div className="text-[#CBD5E1]">
                    自動擁有父類別全部屬性 + 擴充專屬{' '}
                    <code className="font-mono text-[#38BDF8]">self.mana</code>{' '}
                    與{' '}
                    <code className="font-mono text-[#38BDF8]">
                      cast_fireball()
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
