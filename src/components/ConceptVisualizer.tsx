import {useState} from 'react';
import {
  Dices,
  Heart,
  Plus,
  RotateCcw,
  Shield,
  Sparkles,
  Swords,
  Trash2,
  TrendingUp,
  Wand2,
  Crosshair,
} from 'lucide-react';
import {CONCEPT_NODES, HERO_ROLE_OPTIONS} from '../data/oopContent';
import {ConceptNode, HeroInstance, HeroRole} from '../types/oop';

const RANDOM_NAMES = [
  '凱爾 Kael',
  '希瓦娜 Shyvana',
  '艾希 Ashe',
  '諾克薩斯 Nox',
  '賽勒斯 Sylas',
  '索拉卡 Soraka',
  '伊澤瑞爾 Ezreal',
  '嘉文 Jarvan',
];

function formatHexAddress(index: number): string {
  const base = 0x10a4f0 + index * 0x48;
  return `0x${base.toString(16).toUpperCase()}`;
}

function createInitialInstances(): HeroInstance[] {
  return [
    {
      id: 'inst-1',
      varName: 'hero_1',
      memAddress: formatHexAddress(0),
      name: '亞瑟 Arthur',
      role: 'Knight',
      level: 5,
      hp: 180,
      maxHp: 180,
      atk: 28,
      lastAction: '透過 __init__ 完成出生初始化',
      actionCount: 0,
    },
    {
      id: 'inst-2',
      varName: 'hero_2',
      memAddress: formatHexAddress(1),
      name: '莉娜 Lina',
      role: 'Mage',
      level: 4,
      hp: 120,
      maxHp: 120,
      atk: 42,
      lastAction: '透過 __init__ 完成出生初始化',
      actionCount: 0,
    },
  ];
}

function RoleIcon({role}: {role: HeroRole}) {
  if (role === 'Knight') {
    return <Shield className="w-4 h-4 text-[#38BDF8]" aria-hidden="true" />;
  }
  if (role === 'Mage') {
    return <Wand2 className="w-4 h-4 text-[#2DD4BF]" aria-hidden="true" />;
  }
  return <Crosshair className="w-4 h-4 text-[#38BDF8]" aria-hidden="true" />;
}

export function ConceptVisualizer() {
  const [activeConceptId, setActiveConceptId] =
    useState<ConceptNode['id']>('class');

  // Blueprint form state
  const [heroName, setHeroName] = useState('羅賓 Robin');
  const [selectedRole, setSelectedRole] = useState<HeroRole>('Ranger');
  const [level, setLevel] = useState(3);
  const [maxHp, setMaxHp] = useState(145);
  const [atk, setAtk] = useState(34);
  const [nameError, setNameError] = useState('');

  // Memory arena state
  const [instances, setInstances] = useState<HeroInstance[]>(() =>
    createInitialInstances()
  );
  const [nextAddressIndex, setNextAddressIndex] = useState(2);
  const [activeTrace, setActiveTrace] = useState<string>(
    '提示：試著點擊任一張角色卡片的方法按鈕，觀察 self 如何只影響該記憶體位址的物件。'
  );
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const activeConcept =
    CONCEPT_NODES.find((c) => c.id === activeConceptId) ?? CONCEPT_NODES[0];

  const handleSelectRole = (role: HeroRole) => {
    setSelectedRole(role);
    const preset = HERO_ROLE_OPTIONS.find((r) => r.id === role);
    if (preset) {
      setMaxHp(preset.defaultHp);
      setAtk(preset.defaultAtk);
    }
  };

  const handleRandomName = () => {
    const pick = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    setHeroName(pick);
    setNameError('');
  };

  const triggerHighlight = (id: string) => {
    setHighlightedId(id);
    window.setTimeout(() => {
      setHighlightedId((prev) => (prev === id ? null : prev));
    }, 450);
  };

  const handleInstantiate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = heroName.trim();
    if (!trimmed) {
      setNameError('請輸入角色名稱後再建立實體');
      return;
    }
    setNameError('');

    const memAddress = formatHexAddress(nextAddressIndex);
    const varIndex = nextAddressIndex + 1;
    const newHero: HeroInstance = {
      id: `inst-${Date.now()}-${varIndex}`,
      varName: `hero_${varIndex}`,
      memAddress,
      name: trimmed,
      role: selectedRole,
      level,
      hp: maxHp,
      maxHp,
      atk,
      lastAction: `呼叫 __init__(self, "${trimmed}", "${selectedRole}", Lv.${level})`,
      actionCount: 0,
    };

    setInstances((prev) => [newHero, ...prev]);
    setNextAddressIndex((n) => n + 1);
    setActiveTrace(
      `執行 ${newHero.varName} = Hero("${trimmed}", "${selectedRole}", ${level}, ${maxHp}, ${atk}) → 已配置記憶體位址 ${memAddress}`
    );
    triggerHighlight(newHero.id);
  };

  const handleInvokeMethod = (
    id: string,
    method: 'attack' | 'level_up' | 'heal' | 'damage'
  ) => {
    let traceMsg = '';
    setInstances((prev) =>
      prev.map((hero) => {
        if (hero.id !== id) return hero;

        const roleInfo = HERO_ROLE_OPTIONS.find((r) => r.id === hero.role);
        const skill = roleInfo?.skillName ?? '普通攻擊';

        if (method === 'attack') {
          const msg = `${hero.varName}.attack() → self 指向 ${hero.memAddress} (${hero.name})，施展「${skill}」造成 ${hero.atk} 點傷害！`;
          traceMsg = msg;
          return {
            ...hero,
            lastAction: `發動 ${skill} (-${hero.atk} HP 傷害)`,
            actionCount: hero.actionCount + 1,
          };
        }

        if (method === 'level_up') {
          const nextLv = hero.level + 1;
          const nextMaxHp = hero.maxHp + 20;
          const nextHp = Math.min(nextMaxHp, hero.hp + 20);
          const nextAtk = hero.atk + 5;
          traceMsg = `${hero.varName}.level_up() → self 指向 ${hero.memAddress} (${hero.name})，等級提升為 Lv.${nextLv}，ATK 升至 ${nextAtk}`;
          return {
            ...hero,
            level: nextLv,
            maxHp: nextMaxHp,
            hp: nextHp,
            atk: nextAtk,
            lastAction: `升級至 Lv.${nextLv} (ATK +5, MaxHP +20)`,
            actionCount: hero.actionCount + 1,
          };
        }

        if (method === 'heal') {
          const healedHp = Math.min(hero.maxHp, hero.hp + 30);
          const diff = healedHp - hero.hp;
          traceMsg = `${hero.varName}.heal(30) → self 指向 ${hero.memAddress} (${hero.name})，回復 ${diff} 點 HP（目前 ${healedHp}/${hero.maxHp}）`;
          return {
            ...hero,
            hp: healedHp,
            lastAction: `執行 heal(30) · 回復 ${diff} HP`,
            actionCount: hero.actionCount + 1,
          };
        }

        // damage
        const damagedHp = Math.max(0, hero.hp - 25);
        traceMsg = `${hero.varName}.take_damage(25) → self 指向 ${hero.memAddress} (${hero.name})，承受 25 傷害（剩餘 ${damagedHp}/${hero.maxHp}）`;
        return {
          ...hero,
          hp: damagedHp,
          lastAction: `受到 25 點傷害 · 剩餘 ${damagedHp} HP`,
          actionCount: hero.actionCount + 1,
        };
      })
    );

    if (traceMsg) {
      setActiveTrace(traceMsg);
    }
    triggerHighlight(id);
  };

  const handleDeleteInstance = (id: string) => {
    setInstances((prev) => prev.filter((item) => item.id !== id));
    setActiveTrace('已釋放該英雄物件的記憶體參考（Garbage Collection）。');
  };

  const handleResetArena = () => {
    setInstances(createInitialInstances());
    setNextAddressIndex(2);
    setActiveTrace('已重置記憶體空間為預設兩位 Hero 實體。');
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs font-medium text-[#38BDF8] tracking-wide">
            模組 01 · 核心觀念視覺化
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white text-balance">
            從「Hero 設計藍圖」到記憶體中的獨立物件實體
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            理解物件導向的第一步，是分清楚「設計圖（class）」與「真正造出來的角色（object）」。點擊下方五個核心關鍵字切換圖解，再親手產生多個英雄驗證記憶體隔離性。
          </p>
        </div>
      </div>

      {/* 5-Concept Interactive Selector */}
      <section aria-label="OOP 核心名詞比喻拆解" className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {CONCEPT_NODES.map((node) => {
            const isActive = node.id === activeConcept.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setActiveConceptId(node.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
                  isActive
                    ? 'bg-[#0F172A] border-[#38BDF8] text-[#38BDF8]'
                    : 'bg-[#0B111A] border-[#1E293B] text-[#94A3B8] hover:text-white hover:border-[#334155]'
                }`}
              >
                <span className="font-mono text-xs mr-1.5">{node.keyword}</span>
                <span>{node.titleZh}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 sm:p-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#2DD4BF] font-mono">
                <span>{activeConcept.keyword}</span>
                <span aria-hidden="true">·</span>
                <span className="font-sans">{activeConcept.titleZh}</span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-white leading-snug">
                {activeConcept.metaphor}
              </p>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                {activeConcept.explanation}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#070B12] border border-[#1E293B] rounded-lg p-4 flex flex-col justify-center">
            <div className="text-xs text-[#64748B] mb-2 font-mono">
              Hero 語法對照
            </div>
            <pre className="font-mono text-xs sm:text-sm text-[#E2E8F0] leading-relaxed overflow-x-auto">
              <code>{activeConcept.codePreview}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Main Split Interactive Workspace: Blueprint Configurator + Instance Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Hero Class Blueprint Instantiator */}
        <section
          aria-label="Hero 實體產生器"
          className="lg:col-span-5 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 sm:p-6 space-y-5"
        >
          <div className="flex items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-white">
                Hero 實體產生器（藍圖）
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                設定傳入 __init__ 的參數並生成新物件
              </p>
            </div>
            <span className="font-mono text-xs text-[#38BDF8] whitespace-nowrap shrink-0">
              class Hero
            </span>
          </div>

          <form onSubmit={handleInstantiate} className="space-y-4">
            {/* Hero Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="hero-name-input"
                className="block text-xs font-medium text-[#CBD5E1]"
              >
                角色名稱（self.name）
              </label>
              <div className="flex gap-2">
                <input
                  id="hero-name-input"
                  type="text"
                  value={heroName}
                  onChange={(e) => {
                    setHeroName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  maxLength={20}
                  placeholder="輸入英雄名稱，例如：亞瑟"
                  className="flex-1 min-w-0 bg-[#070B12] border border-[#1E293B] focus:border-[#38BDF8] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleRandomName}
                  title="隨機產生名稱"
                  className="px-3 py-2.5 bg-[#070B12] border border-[#1E293B] hover:border-[#38BDF8] text-[#94A3B8] hover:text-white rounded-lg transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5 text-xs whitespace-nowrap"
                >
                  <Dices className="w-4 h-4" aria-hidden="true" />
                  <span>隨機</span>
                </button>
              </div>
              {nameError && (
                <p className="text-xs text-[#FB7185]">{nameError}</p>
              )}
            </div>

            {/* Role Selector */}
            <div className="space-y-1.5">
              <span className="block text-xs font-medium text-[#CBD5E1]">
                職業定位（self.role）
              </span>
              <div className="grid grid-cols-3 gap-2">
                {HERO_ROLE_OPTIONS.map((roleOpt) => {
                  const active = selectedRole === roleOpt.id;
                  return (
                    <button
                      key={roleOpt.id}
                      type="button"
                      onClick={() => handleSelectRole(roleOpt.id)}
                      className={`px-2.5 py-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                        active
                          ? 'bg-[#131D33] border-[#38BDF8] text-white'
                          : 'bg-[#070B12] border-[#1E293B] text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      <RoleIcon role={roleOpt.id} />
                      <span>{roleOpt.titleZh}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders with Explicit Labels, Numeric Value & Units */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="hero-level" className="text-[#CBD5E1]">
                    初始等級（self.level）
                  </label>
                  <span className="font-mono-tabular text-[#38BDF8] font-semibold">
                    Lv.{level}
                  </span>
                </div>
                <input
                  id="hero-level"
                  type="range"
                  min={1}
                  max={20}
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full accent-[#38BDF8] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="hero-hp" className="text-[#CBD5E1]">
                    最大生命值（self.hp）
                  </label>
                  <span className="font-mono-tabular text-[#2DD4BF] font-semibold">
                    {maxHp} HP
                  </span>
                </div>
                <input
                  id="hero-hp"
                  type="range"
                  min={80}
                  max={300}
                  step={5}
                  value={maxHp}
                  onChange={(e) => setMaxHp(Number(e.target.value))}
                  className="w-full accent-[#2DD4BF] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="hero-atk" className="text-[#CBD5E1]">
                    基礎攻擊力（self.atk）
                  </label>
                  <span className="font-mono-tabular text-[#38BDF8] font-semibold">
                    {atk} ATK
                  </span>
                </div>
                <input
                  id="hero-atk"
                  type="range"
                  min={10}
                  max={70}
                  step={2}
                  value={atk}
                  onChange={(e) => setAtk(Number(e.target.value))}
                  className="w-full accent-[#38BDF8] cursor-pointer"
                />
              </div>
            </div>

            {/* Live Instantiation Call Preview */}
            <div className="bg-[#070B12] border border-[#1E293B] rounded-lg p-3 space-y-1">
              <div className="text-[11px] text-[#64748B]">
                即將執行的實體化語法：
              </div>
              <code className="block font-mono text-xs text-[#2DD4BF] break-all">
                hero_{nextAddressIndex + 1} = Hero("{heroName || '未命名'}", "
                {selectedRole}", {level}, {maxHp}, {atk})
              </code>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#070B12] font-semibold text-sm rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>建立實體（Instantiate）</span>
            </button>
          </form>
        </section>

        {/* Right: Memory Space & Live Instance Cards */}
        <section
          aria-label="執行時期記憶體空間"
          className="lg:col-span-7 blueprint-grid border border-[#1E293B] rounded-xl p-5 sm:p-6 space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-white">
                記憶體實體區（Objects in Memory）
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5 tabular-nums">
                目前共有 {instances.length} 個獨立 Hero 實體
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetArena}
              className="px-3 py-1.5 text-xs font-medium text-[#94A3B8] hover:text-white bg-[#0F172A] border border-[#1E293B] hover:border-[#334155] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>重置為預設實體</span>
            </button>
          </div>

          {/* Live self pointer trace bar */}
          <div
            role="status"
            aria-live="polite"
            className="bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-xs text-[#E2E8F0] font-mono leading-relaxed"
          >
            <span className="text-[#2DD4BF] font-semibold mr-2">
              self 追蹤：
            </span>
            <span>{activeTrace}</span>
          </div>

          {instances.length === 0 ? (
            <div className="py-16 text-center space-y-3 border border-dashed border-[#1E293B] rounded-xl bg-[#070B12]/60">
              <Sparkles
                className="w-8 h-8 text-[#38BDF8] mx-auto"
                aria-hidden="true"
              />
              <p className="text-sm text-[#CBD5E1]">
                記憶體空間目前是空的
              </p>
              <p className="text-xs text-[#64748B]">
                請在左側配置角色參數，點擊「建立實體（Instantiate）」生成 Hero 物件。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {instances.map((hero) => {
                const hpPct = Math.round((hero.hp / hero.maxHp) * 100);
                const roleLabel =
                  HERO_ROLE_OPTIONS.find((r) => r.id === hero.role)?.titleZh ??
                  hero.role;
                const isFlash = highlightedId === hero.id;

                return (
                  <article
                    key={hero.id}
                    className={`bg-[#0F172A] rounded-xl p-4 space-y-4 border transition-colors ${
                      isFlash
                        ? 'border-[#2DD4BF]'
                        : 'border-[#1E293B] hover:border-[#334155]'
                    }`}
                  >
                    {/* Card Top Metadata: Variable + Memory Address */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-mono">
                          <span className="text-[#38BDF8] font-semibold">
                            {hero.varName}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#2DD4BF] tabular-nums">
                            {hero.memAddress}
                          </span>
                        </div>
                        <h3 className="font-display text-base font-bold text-white mt-1 flex items-center gap-2 truncate">
                          <RoleIcon role={hero.role} />
                          <span className="truncate">{hero.name}</span>
                        </h3>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          {roleLabel} · 操作次數 {hero.actionCount}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteInstance(hero.id)}
                        aria-label={`刪除實體 ${hero.name}`}
                        className="p-1.5 text-[#64748B] hover:text-[#FB7185] transition-colors cursor-pointer rounded"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Instance Attributes */}
                    <div className="space-y-2.5 bg-[#070B12] border border-[#1E293B] rounded-lg p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#94A3B8] font-mono">
                          self.hp
                        </span>
                        <span className="font-mono-tabular font-semibold text-white">
                          {hero.hp} / {hero.maxHp}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[#1E293B] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-200 ${
                            hpPct > 50
                              ? 'bg-[#2DD4BF]'
                              : hpPct > 20
                                ? 'bg-[#FBBF24]'
                                : 'bg-[#FB7185]'
                          }`}
                          style={{width: `${hpPct}%`}}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="flex items-center justify-between bg-[#0F172A] px-2.5 py-1.5 rounded border border-[#1E293B]">
                          <span className="text-[#64748B] font-mono">
                            level
                          </span>
                          <span className="font-mono-tabular text-[#38BDF8] font-semibold">
                            Lv.{hero.level}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-[#0F172A] px-2.5 py-1.5 rounded border border-[#1E293B]">
                          <span className="text-[#64748B] font-mono">atk</span>
                          <span className="font-mono-tabular text-white font-semibold">
                            {hero.atk}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recent action feedback */}
                    <p className="text-xs text-[#94A3B8] truncate">
                      狀態：{hero.lastAction}
                    </p>

                    {/* Method Call Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleInvokeMethod(hero.id, 'attack')}
                        className="px-3 py-2 text-xs font-mono font-medium bg-[#131D33] hover:bg-[#1E293B] text-[#38BDF8] border border-[#1E293B] hover:border-[#38BDF8]/50 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <Swords className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>attack()</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInvokeMethod(hero.id, 'level_up')}
                        className="px-3 py-2 text-xs font-mono font-medium bg-[#131D33] hover:bg-[#1E293B] text-[#2DD4BF] border border-[#1E293B] hover:border-[#2DD4BF]/50 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <TrendingUp
                          className="w-3.5 h-3.5"
                          aria-hidden="true"
                        />
                        <span>level_up()</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInvokeMethod(hero.id, 'heal')}
                        className="px-3 py-2 text-xs font-mono font-medium bg-[#070B12] hover:bg-[#131D33] text-[#CBD5E1] border border-[#1E293B] rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <Heart className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>heal(30)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInvokeMethod(hero.id, 'damage')}
                        className="px-3 py-2 text-xs font-mono font-medium bg-[#070B12] hover:bg-[#131D33] text-[#CBD5E1] border border-[#1E293B] rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <span>take_damage(25)</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
