import {
  ConceptNode,
  HeroRoleOption,
  QuizQuestion,
  SandboxPreset,
  SyntaxLesson,
} from '../types/oop';

export const HERO_ROLE_OPTIONS: HeroRoleOption[] = [
  {
    id: 'Knight',
    label: 'Knight',
    titleZh: '聖殿騎士',
    defaultHp: 180,
    defaultAtk: 28,
    skillName: '聖盾斬擊',
  },
  {
    id: 'Mage',
    label: 'Mage',
    titleZh: '秘法法師',
    defaultHp: 120,
    defaultAtk: 42,
    skillName: '星辰爆裂',
  },
  {
    id: 'Ranger',
    label: 'Ranger',
    titleZh: '疾風遊俠',
    defaultHp: 145,
    defaultAtk: 34,
    skillName: '穿透連射',
  },
];

export const CONCEPT_NODES: ConceptNode[] = [
  {
    id: 'class',
    keyword: 'class Hero:',
    titleZh: '類別（設計藍圖）',
    metaphor: '就像遊戲開發者的「英雄設計圖」，本身不是能上場打怪的角色，而是規定每位英雄該有什麼資料與技能。',
    explanation:
      'class 定義了一種新的資料類型。一份 Hero 藍圖可以重複「實體化（Instantiate）」出無數個彼此獨立的英雄物件。',
    codePreview: `class Hero:
    # 藍圖本身不佔用角色的個別數值
    pass`,
  },
  {
    id: 'init',
    keyword: 'def __init__(self, ...):',
    titleZh: '建構子（初始化出生設定）',
    metaphor: '當你按下「建立角色」按鈕的瞬間，系統會自動觸發的「新手村出生儀式」，幫新角色裝上名字、職業與初始血量。',
    explanation:
      '__init__ 會在呼叫 Hero(...) 建立實體時自動執行一次，負責接收傳入的參數，並將它們寫入剛誕生的物件記憶體中。',
    codePreview: `def __init__(self, name, role, level, hp, atk):
    self.name = name
    self.role = role
    self.level = level
    self.hp = hp
    self.atk = atk`,
  },
  {
    id: 'self',
    keyword: 'self',
    titleZh: '實體本身（我自己的代名詞）',
    metaphor: '戰場上有十位英雄時，用來指明「正在操作的那一位」的身分證，對應到該物件在記憶體中的專屬位址。',
    explanation:
      '在類別的方法裡，第一個參數永遠是 self。當 hero_1.attack() 被呼叫時，Python 會自動把 hero_1 的記憶體位址傳給 self。',
    codePreview: `def attack(self):
    # self 指向呼叫這個方法的「那個物件」
    print(f"{self.name} 發動攻擊，造成 {self.atk} 傷害！")`,
  },
  {
    id: 'attributes',
    keyword: 'self.hp / self.atk',
    titleZh: '屬性（角色身上的數值欄位）',
    metaphor: '角色狀態欄裡記錄的姓名、等級、血量與攻擊力。每個實體各自擁有一份，A 受傷不會扣到 B 的血量。',
    explanation:
      '綁定在 self 上的變數稱為「實體屬性（Instance Attributes）」，它們儲存在各自的記憶體區塊中，彼此完全隔離。',
    codePreview: `hero_1 = Hero("亞瑟", "Knight", 5, 180, 28)
hero_2 = Hero("莉娜", "Mage", 3, 120, 42)
# hero_1.hp 與 hero_2.hp 互不干擾`,
  },
  {
    id: 'methods',
    keyword: 'def level_up(self):',
    titleZh: '方法（角色能做的動作技能）',
    metaphor: '定義在藍圖裡的「技能按鈕」，例如攻擊 attack()、升級 level_up()、治療 heal()，能讀取並改寫該物件的屬性。',
    explanation:
      '寫在 class 裡面的函式稱為「方法（Methods）」。方法透過 self 來存取或修改屬於該實體的狀態數值。',
    codePreview: `def level_up(self):
    self.level += 1
    self.atk += 5
    self.hp += 20`,
  },
];

export const SYNTAX_LESSONS: SyntaxLesson[] = [
  {
    id: 'basic',
    title: '1. 基礎類別與建構子',
    subtitle: 'class / __init__ / self',
    summary:
      '了解如何從零定義一個 Hero 類別，透過 __init__ 設定初始屬性，並撰寫可以改變物件狀態的方法。',
    lines: [
      {
        lineNumber: 1,
        code: 'class Hero:',
        conceptTag: '類別定義',
        note: '宣告一個名為 Hero 的設計藍圖，Python 慣例類別名稱每個單字首字母大寫（PascalCase）。',
      },
      {
        lineNumber: 2,
        code: '    def __init__(self, name: str, hp: int, atk: int):',
        conceptTag: '建構子',
        note: '建立物件時自動呼叫的初始化函式；self 代表剛誕生的實體，後面則是外部傳入的初始資料。',
      },
      {
        lineNumber: 3,
        code: '        self.name = name',
        conceptTag: '實體屬性',
        note: '將參數 name 存進「這個物件自己」的 name 屬性中，讓它出生後就能一直記住自己的名字。',
      },
      {
        lineNumber: 4,
        code: '        self.hp = hp',
        conceptTag: '實體屬性',
        note: '設定這個英雄當下的生命值，每個英雄實體都會有獨立的 self.hp 記憶體空間。',
      },
      {
        lineNumber: 5,
        code: '        self.atk = atk',
        conceptTag: '實體屬性',
        note: '設定這個英雄的基礎攻擊力。',
      },
      {
        lineNumber: 6,
        code: '',
        note: '空行用來區隔建構子與一般方法，提升程式可讀性。',
      },
      {
        lineNumber: 7,
        code: '    def attack(self, target):',
        conceptTag: '方法定義',
        note: '定義攻擊技能：第一個參數必須是 self（發動攻擊者），target 則是被攻擊的另一個 Hero 物件。',
      },
      {
        lineNumber: 8,
        code: '        target.hp = max(0, target.hp - self.atk)',
        conceptTag: '物件互動',
        note: '讀取攻擊者自身的 self.atk，扣除目標物件的 target.hp，並用 max(0, ...) 確保血量不會變成負數。',
      },
      {
        lineNumber: 9,
        code: '        return f"{self.name} 攻擊 {target.name}，剩餘 HP: {target.hp}"',
        conceptTag: '回傳結果',
        note: '回傳攻擊戰報字串，清楚顯示雙方狀態變化。',
      },
      {
        lineNumber: 10,
        code: '',
        note: '類別定義區塊結束（接下來的程式碼取消縮排）。',
      },
      {
        lineNumber: 11,
        code: 'arthur = Hero("亞瑟", 180, 30)',
        conceptTag: '實體化',
        note: '呼叫 Hero(...) 建立第一個英雄實體 arthur，Python 會自動將 arthur 傳入 __init__ 的 self。',
      },
      {
        lineNumber: 12,
        code: 'goblin = Hero("哥布林", 100, 12)',
        conceptTag: '實體化',
        note: '用同一張 Hero 藍圖再建出第二個完全獨立的實體 goblin。',
      },
      {
        lineNumber: 13,
        code: 'print(arthur.attack(goblin))',
        conceptTag: '呼叫方法',
        note: '讓 arthur 呼叫 attack() 攻擊 goblin，goblin 的 hp 會從 100 降為 70，而 arthur 的血量不受影響。',
      },
    ],
  },
  {
    id: 'encapsulation',
    title: '2. 封裝與屬性保護',
    subtitle: '__私有屬性 / @property',
    summary:
      '避免外部程式碼隨意將英雄血量改成負數或爆表！透過雙底線私有屬性與 @property 打造安全防護罩。',
    lines: [
      {
        lineNumber: 1,
        code: 'class Hero:',
        conceptTag: '藍圖定義',
        note: '建立帶有封裝保護機制的 Hero 類別。',
      },
      {
        lineNumber: 2,
        code: '    def __init__(self, name: str, max_hp: int):',
        conceptTag: '建構子',
        note: '初始化角色名稱與生命上限。',
      },
      {
        lineNumber: 3,
        code: '        self.name = name',
        conceptTag: '公開屬性',
        note: '沒有底線開頭的屬性屬於公開屬性，外部可以直接讀取。',
      },
      {
        lineNumber: 4,
        code: '        self._max_hp = max_hp',
        conceptTag: '保護慣例',
        note: '單底線 _ 開頭代表「內部使用慣例」，提醒其他工程師不要直接從外部改寫它。',
      },
      {
        lineNumber: 5,
        code: '        self.__hp = max_hp',
        conceptTag: '私有屬性',
        note: '雙底線 __ 開頭會觸發 Python 名稱修飾（Name Mangling），防止外部直接用 hero.__hp = -999 惡意竄改。',
      },
      {
        lineNumber: 6,
        code: '',
        note: '區隔建構子與封裝讀取器。',
      },
      {
        lineNumber: 7,
        code: '    @property',
        conceptTag: '唯讀裝飾器',
        note: '@property 讓方法可以像屬性一樣用 hero.hp 讀取，卻不能直接賦值修改，兼顧便利與安全。',
      },
      {
        lineNumber: 8,
        code: '    def hp(self) -> int:',
        conceptTag: 'Getter',
        note: '安全地對外提供私有屬性 self.__hp 的目前數值。',
      },
      {
        lineNumber: 9,
        code: '        return self.__hp',
        conceptTag: '回傳私有值',
        note: '在類別內部的方法中，可以正常存取 self.__hp。',
      },
      {
        lineNumber: 10,
        code: '',
        note: '接下來定義合法修改血量的窗口方法。',
      },
      {
        lineNumber: 11,
        code: '    def heal(self, amount: int):',
        conceptTag: '受控修改',
        note: '所有想改變血量的操作都必須經過這個方法，方便我們在裡面加上檢查規則。',
      },
      {
        lineNumber: 12,
        code: '        if amount <= 0:',
        conceptTag: '邊界檢查',
        note: '防呆機制：如果傳入 0 或負數補血量，直接忽略不處理。',
      },
      {
        lineNumber: 13,
        code: '            return',
        conceptTag: '提早結束',
        note: '條件不符時提前離開方法。',
      },
      {
        lineNumber: 14,
        code: '        self.__hp = min(self._max_hp, self.__hp + amount)',
        conceptTag: '上限鎖定',
        note: '補血後保證不會超過 _max_hp，這就是「封裝」保護資料正確性的核心價值！',
      },
    ],
  },
  {
    id: 'inheritance',
    title: '3. 子類別繼承與 super()',
    subtitle: '繼承父類別 / 方法覆寫',
    summary:
      '不用重寫重複的程式碼！讓 Warrior 與 Mage 繼承 Hero 的共通屬性，再用 super().__init__() 接手父類別建構流程。',
    lines: [
      {
        lineNumber: 1,
        code: 'class Hero:',
        conceptTag: '父類別 (Parent)',
        note: '將所有職業共通的屬性（名字、血量、攻擊力）抽取到父類別 Hero 中。',
      },
      {
        lineNumber: 2,
        code: '    def __init__(self, name: str, hp: int, atk: int):',
        conceptTag: '父類別建構子',
        note: '負責初始化基礎英雄資料。',
      },
      {
        lineNumber: 3,
        code: '        self.name = name',
        conceptTag: '共通屬性',
        note: '所有子類別英雄都會自動擁有 name。',
      },
      {
        lineNumber: 4,
        code: '        self.hp = hp',
        conceptTag: '共通屬性',
        note: '所有子類別英雄都會自動擁有 hp。',
      },
      {
        lineNumber: 5,
        code: '        self.atk = atk',
        conceptTag: '共通屬性',
        note: '所有子類別英雄都會自動擁有 atk。',
      },
      {
        lineNumber: 6,
        code: '',
        note: '接下來定義繼承自 Hero 的子類別。',
      },
      {
        lineNumber: 7,
        code: 'class Mage(Hero):',
        conceptTag: '繼承語法',
        note: '括號內寫入 Hero，代表 Mage（法師）繼承 Hero 的所有屬性與方法，是一個「is-a」的關係。',
      },
      {
        lineNumber: 8,
        code: '    def __init__(self, name: str, hp: int, atk: int, mana: int):',
        conceptTag: '擴充參數',
        note: '法師除了基礎資料外，還多了一個專屬屬性 mana（魔力值）。',
      },
      {
        lineNumber: 9,
        code: '        super().__init__(name, hp, atk)',
        conceptTag: 'super() 呼叫',
        note: '關鍵語法！呼叫父類別 Hero 的 __init__，請爸爸幫忙把 name、hp、atk 設好，避免重複寫三行賦值。',
      },
      {
        lineNumber: 10,
        code: '        self.mana = mana',
        conceptTag: '子類別專屬屬性',
        note: '爸爸處理完共通欄位後，子類別再補上自己獨有的 self.mana 屬性。',
      },
      {
        lineNumber: 11,
        code: '',
        note: '區隔建構子與專屬技能方法。',
      },
      {
        lineNumber: 12,
        code: '    def cast_fireball(self):',
        conceptTag: '子類別專屬方法',
        note: '只有 Mage 實例才能施放火球術，一般的 Hero 物件不會有這個方法。',
      },
      {
        lineNumber: 13,
        code: '        if self.mana >= 20:',
        conceptTag: '消耗檢核',
        note: '檢查法師魔力是否足夠。',
      },
      {
        lineNumber: 14,
        code: '            self.mana -= 20',
        conceptTag: '扣除魔力',
        note: '成功施法後扣除 20 點魔力。',
      },
      {
        lineNumber: 15,
        code: '            return f"{self.name} 施放爆裂火球！造成 {self.atk * 2} 魔法傷害"',
        conceptTag: '整合父屬性',
        note: '子類別的方法可以直接使用從父類別繼承而來的 self.name 與 self.atk！',
      },
      {
        lineNumber: 16,
        code: '        return f"{self.name} 魔力不足！"',
        conceptTag: '防呆回傳',
        note: '魔力不足時的提示訊息。',
      },
    ],
  },
];

export const SANDBOX_PRESETS: SandboxPreset[] = [
  {
    id: 'hero-basic',
    title: '練習一：Hero 類別與多實體對戰',
    description: '建立兩位獨立的 Hero 實體，練習呼叫 attack() 與 level_up() 觀察屬性變化。',
    code: `class Hero:
    def __init__(self, name, role, hp, atk):
        self.name = name
        self.role = role
        self.hp = hp
        self.atk = atk
        self.level = 1

    def attack(self, target):
        target.hp = max(0, target.hp - self.atk)
        print(f"⚔️ {self.name}({self.role}) 攻擊 {target.name}，造成 {self.atk} 點傷害！")
        print(f"   → {target.name} 剩餘 HP：{target.hp}")

    def level_up(self):
        self.level += 1
        self.hp += 30
        self.atk += 8
        print(f"✨ {self.name} 升級至 Lv.{self.level}！(HP={self.hp}, ATK={self.atk})")

# 1. 從同一份 Hero 藍圖建立兩個獨立實體
arthur = Hero("亞瑟", "騎士", 180, 28)
lina = Hero("莉娜", "法師", 120, 42)

# 2. 互動執行方法，觀察 self 如何區分不同物件
arthur.attack(lina)
lina.level_up()
lina.attack(arthur)

# 挑戰任務：試著在下方新增第三位英雄，並讓他升級一次！`,
  },
  {
    id: 'hero-inheritance',
    title: '練習二：super().__init__() 繼承實戰',
    description: '透過 Mage(Hero) 子類別繼承父類別屬性，並覆寫或擴充專屬技能。',
    code: `class Hero:
    def __init__(self, name, hp, atk):
        self.name = name
        self.hp = hp
        self.atk = atk

    def status(self):
        return f"[{self.name}] HP:{self.hp} | ATK:{self.atk}"

class Mage(Hero):
    def __init__(self, name, hp, atk, mana):
        # 呼叫父類別 Hero 的建構子
        super().__init__(name, hp, atk)
        self.mana = mana

    def cast_spell(self, target):
        if self.mana < 25:
            print(f"{self.name} 魔力不足，無法施法！")
            return
        self.mana -= 25
        damage = int(self.atk * 1.8)
        target.hp = max(0, target.hp - damage)
        print(f"🔮 {self.name} 施放星辰爆裂，造成 {damage} 傷害！剩餘魔力：{self.mana}")

boss = Hero("深淵魔像", 260, 22)
mage = Mage("芙莉蓮", 130, 35, 60)

print(mage.status())
mage.cast_spell(boss)
print("Boss 狀態 →", boss.status())`,
  },
  {
    id: 'hero-debug',
    title: '練習三：除錯挑戰（找出隱藏錯誤）',
    description: '這段程式碼刻意藏了 OOP 常見錯誤（例如漏寫 self），試著執行並看中文提示修復它！',
    code: `class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    # 故意忘記在方法第一個參數加上 self 👇
    def greet():
        print(f"你好，我是 {self.name}！")

hero_1 = Hero("亞瑟", 150)
hero_1.greet()`,
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: '類別與實體（Class vs Instance）',
    question: '在 Python 物件導向中，關於 class（類別）與 object（實體物件）的關係，下列哪一項敘述最正確？',
    options: [
      'class 是設計藍圖，透過呼叫 class 可以建立出多個記憶體位址彼此獨立的物件實體',
      '每次建立新物件都必須重新複製一份 class 原始碼並改名',
      '修改其中一個物件實體的屬性數值，其他由同一個 class 建立的實體也會全部跟著改變',
      'class 只能用來建立一個全域唯一的物件，無法重複使用',
    ],
    correctIndex: 0,
    explanation:
      'class 就像英雄設計藍圖，而每次呼叫 Hero(...) 都是在記憶體中打造一個獨立的英雄實體。每個實體的屬性都存放在自己的記憶體區塊，修改 hero_1 的 HP 完全不會影響 hero_2。',
  },
  {
    id: 2,
    topic: '建構子（__init__）時機',
    question: '執行下方程式碼後，螢幕上會印出什麼結果？',
    codeSnippet: `class Hero:
    def __init__(self, name):
        self.name = name
        print(f"英雄 {self.name} 誕生了！")

h1 = Hero("亞瑟")`,
    options: [
      '不會印出任何東西，因為沒有呼叫 h1.__init__()',
      '印出「英雄 亞瑟 誕生了！」',
      '發生 NameError，因為 self 沒有被傳入',
      '只會建立物件，直到呼叫 h1.name 才會印出文字',
    ],
    correctIndex: 1,
    explanation:
      '__init__ 是 Python 的建構子方法。只要執行 Hero("亞瑟") 建立實體，Python 就會自動觸發 __init__ 完成初始化設定，不需要手動再去呼叫 h1.__init__()。',
  },
  {
    id: 3,
    topic: '認識 self 參數',
    question: '在類別的方法定義中，例如 def attack(self, damage):，為什麼必須把 self 放在第一個參數？',
    options: [
      'self 是 Python 的強制保留字，不寫叫做 self 就無法通過編譯',
      'self 用來代表父類別本身，讓方法可以存取全域變數',
      'self 指向「正在呼叫該方法的那個物件實體」，讓方法知道要讀取或修改誰的屬性',
      '只有在需要回傳數值的方法才需要加上 self，純粹 print 不用寫',
    ],
    correctIndex: 2,
    explanation:
      '當你寫 arthur.attack(30) 時，Python 在底層其實會自動轉換成 Hero.attack(arthur, 30)。第一個參數 self 就是用來接收 arthur 這個物件本身，讓函式知道該去讀誰的 self.name 與 self.hp。',
  },
  {
    id: 4,
    topic: '常見錯誤除錯',
    question: '觀察下方程式碼，執行 hero.heal(20) 時最有可能發生什麼錯誤？',
    codeSnippet: `class Hero:
    def __init__(self, hp):
        self.hp = hp

    def heal(amount):
        self.hp += amount

hero = Hero(100)
hero.heal(20)`,
    options: [
      'SyntaxError：heal 裡面不能使用 += 運算子',
      'TypeError：Hero.heal() 只需要 1 個參數，但實際上被傳入了 2 個參數（self 與 20）',
      'AttributeError：Hero 沒有 __init__ 方法',
      '程式正常執行，hero.hp 會變成 120',
    ],
    correctIndex: 1,
    explanation:
      '這是最經典的新手陷阱！因為 def heal(amount) 漏寫了 self，當呼叫 hero.heal(20) 時，Python 自動把 hero 當作第 1 個參數、20 當作第 2 個參數傳進去，導致參數數量不符而報出 TypeError。正確寫法應為 def heal(self, amount):。',
  },
  {
    id: 5,
    topic: '繼承與 super().__init__()',
    question: '子類別 Warrior 繼承自父類別 Hero 時，在 Warrior 的 __init__ 中呼叫 super().__init__(name, hp) 的主要目的是什麼？',
    options: [
      '刪除父類別原有的所有屬性，讓子類別從頭重新定義',
      '將子類別強行轉換成父類別型態，使子類別無法新增自己的方法',
      '重用父類別的建構子邏輯來初始化共通屬性（如 name 與 hp），避免重複撰寫相同程式碼',
      '讓父類別可以直接存取子類別尚未建立的區域變數',
    ],
    correctIndex: 2,
    explanation:
      'super() 代表取得父類別的參照。透過 super().__init__(name, hp)，子類別可以直接沿用父類別已經寫好的初始化步驟，接著只需專注補充子類別自己的新屬性（例如 self.armor）即可。',
  },
];
