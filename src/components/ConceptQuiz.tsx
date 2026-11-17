import {useState} from 'react';
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import {QUIZ_QUESTIONS} from '../data/oopContent';

export function ConceptQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Map questionId -> chosen option index
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const selectedOption = answers[currentQuestion.id];
  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && selectedOption === currentQuestion.correctIndex;

  const answeredCount = Object.keys(answers).length;
  const totalScore = QUIZ_QUESTIONS.reduce((acc, q) => {
    return answers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const handleChooseOption = (optionIndex: number) => {
    if (isAnswered) return; // Lock answer once chosen for immediate scoring integrity
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowSummary(false);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#2DD4BF] tracking-wide">
            模組 04 · 隨堂觀念挑戰測驗
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white text-balance">
            Python OOP 基礎觀念實戰驗收（共 5 題）
          </h1>
          <p className="text-sm text-[#94A3B8]">
            點選答案後將立即批改並展開白話文觀念解析，即時檢驗 class、self、__init__ 與繼承掌握度。
          </p>
        </div>

        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-2.5 text-right shrink-0">
          <div className="text-[11px] text-[#64748B]">目前累計得分</div>
          <div className="font-mono-tabular text-lg font-bold text-[#38BDF8]">
            {totalScore} / {QUIZ_QUESTIONS.length} 題
          </div>
        </div>
      </div>

      {/* Question Stepper Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const ans = answers[q.id];
            const answered = ans !== undefined;
            const correct = answered && ans === q.correctIndex;
            const active = !showSummary && idx === currentIndex;

            let styleClass =
              'bg-[#0B111A] border-[#1E293B] text-[#94A3B8] hover:text-white';
            if (active) {
              styleClass = 'bg-[#131D33] border-[#38BDF8] text-[#38BDF8]';
            } else if (answered && correct) {
              styleClass =
                'bg-[#2DD4BF]/10 border-[#2DD4BF]/50 text-[#2DD4BF]';
            } else if (answered && !correct) {
              styleClass =
                'bg-[#FB7185]/10 border-[#FB7185]/50 text-[#FB7185]';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setShowSummary(false);
                  setCurrentIndex(idx);
                }}
                className={`h-9 px-3 rounded-lg border text-xs font-mono-tabular font-semibold transition-colors cursor-pointer whitespace-nowrap ${styleClass}`}
              >
                Q{idx + 1}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-[#94A3B8] tabular-nums">
          已完成 {answeredCount} / {QUIZ_QUESTIONS.length} 題
        </span>
      </div>

      {showSummary ? (
        /* Final Score Summary Card */
        <section
          aria-label="測驗成績總結"
          className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#131D33] border border-[#38BDF8]/40 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-[#38BDF8]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  隨堂測驗總結報告
                </h2>
                <p className="text-sm text-[#94A3B8] mt-0.5">
                  {totalScore === 5
                    ? '太棒了！你已經完全掌握 Python 類別與物件的核心邏輯！'
                    : totalScore >= 3
                      ? '觀念不錯！可以針對答錯的題目回到「藍圖與實體」或「語法與繼承」再複習一次。'
                      : '建議先回到「藍圖與實體」多建立幾個角色觀察 self 變化，再回來挑戰！'}
                </p>
              </div>
            </div>

            <div className="font-mono-tabular text-3xl font-bold text-[#2DD4BF] shrink-0">
              {totalScore * 20} 分
            </div>
          </div>

          <div className="space-y-3">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const userAns = answers[q.id];
              const qCorrect = userAns === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#070B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs text-[#64748B]">
                      第 {idx + 1} 題 · {q.topic}
                    </div>
                    <div className="text-[#E2E8F0]">{q.question}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {qCorrect ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2DD4BF] whitespace-nowrap">
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        <span>答對</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FB7185] whitespace-nowrap">
                        <XCircle className="w-4 h-4" aria-hidden="true" />
                        <span>答錯</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowSummary(false);
                        setCurrentIndex(idx);
                      }}
                      className="text-xs text-[#38BDF8] hover:underline cursor-pointer whitespace-nowrap"
                    >
                      查看解析
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="px-5 py-2.5 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#070B12] font-semibold text-sm rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>重新挑戰測驗</span>
            </button>
          </div>
        </section>
      ) : (
        /* Active Question Card */
        <section
          aria-label={`第 ${currentIndex + 1} 題`}
          className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#38BDF8] font-medium">
              <span className="font-mono-tabular">
                第 {currentIndex + 1} / {QUIZ_QUESTIONS.length} 題
              </span>
              <span aria-hidden="true">·</span>
              <span>{currentQuestion.topic}</span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-white leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          {currentQuestion.codeSnippet && (
            <pre className="bg-[#070B12] border border-[#1E293B] rounded-lg p-4 font-mono text-xs sm:text-sm text-[#E2E8F0] overflow-x-auto leading-relaxed">
              <code>{currentQuestion.codeSnippet}</code>
            </pre>
          )}

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((optionText, optIdx) => {
              const isThisSelected = selectedOption === optIdx;
              const isThisCorrect = currentQuestion.correctIndex === optIdx;

              let buttonStyle =
                'bg-[#070B12] border-[#1E293B] hover:border-[#38BDF8] text-[#E2E8F0]';
              let statusLabel: string | null = null;

              if (isAnswered) {
                if (isThisCorrect) {
                  buttonStyle =
                    'bg-[#2DD4BF]/10 border-[#2DD4BF] text-white';
                  statusLabel = '正確答案';
                } else if (isThisSelected && !isThisCorrect) {
                  buttonStyle =
                    'bg-[#FB7185]/10 border-[#FB7185] text-[#FDA4AF]';
                  statusLabel = '你的選擇';
                } else {
                  buttonStyle =
                    'bg-[#070B12] border-[#1E293B] text-[#64748B] opacity-75';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleChooseOption(optIdx)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border transition-colors flex items-start justify-between gap-4 min-h-[48px] ${
                    isAnswered ? 'cursor-default' : 'cursor-pointer'
                  } ${buttonStyle} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold mt-0.5 text-[#38BDF8] shrink-0">
                      {optionLetters[optIdx]}.
                    </span>
                    <span className="text-sm leading-relaxed">{optionText}</span>
                  </div>

                  {statusLabel && (
                    <span
                      className={`text-xs font-semibold whitespace-nowrap shrink-0 mt-0.5 ${
                        isThisCorrect ? 'text-[#2DD4BF]' : 'text-[#FB7185]'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Immediate Grading & Plain-Language Explanation */}
          {isAnswered && (
            <div
              role="status"
              className={`rounded-xl p-5 border space-y-2 ${
                isCorrect
                  ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/40'
                  : 'bg-[#FB7185]/10 border-[#FB7185]/40'
              }`}
            >
              <div
                className={`flex items-center gap-2 text-sm font-bold ${
                  isCorrect ? 'text-[#2DD4BF]' : 'text-[#FB7185]'
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>答對了！觀念非常清晰</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" aria-hidden="true" />
                    <span>
                      答錯了，正確答案為選項 {optionLetters[currentQuestion.correctIndex]}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-[#E2E8F0] leading-relaxed">
                <strong className="text-white font-semibold mr-1.5">
                  白話文解析：
                </strong>
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Footer Navigation inside Quiz Card */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-[#070B12] border border-[#1E293B] hover:border-[#334155] disabled:opacity-40 text-[#CBD5E1] cursor-pointer disabled:cursor-not-allowed inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span>上一題</span>
            </button>

            <div className="flex items-center gap-3">
              {answeredCount === QUIZ_QUESTIONS.length && (
                <button
                  type="button"
                  onClick={() => setShowSummary(true)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#070B12] transition-colors cursor-pointer whitespace-nowrap"
                >
                  查看總成績單
                </button>
              )}

              {currentIndex < QUIZ_QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((i) =>
                      Math.min(QUIZ_QUESTIONS.length - 1, i + 1)
                    )
                  }
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#070B12] transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>下一題</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSummary(true)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#070B12] transition-colors cursor-pointer whitespace-nowrap"
                >
                  完成並檢視總分
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
