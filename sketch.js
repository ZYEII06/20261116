// Constants for the grid and effect
const numb = 70;
const step = 10;
const distThreshold = 70;
const distortionAmount = 20;
let dots = [];
let profileImage; 

// 🌟 新增：波紋效果陣列
let ripples = [];


// 🌟 新增：互動對話系統
const extraDialogues = {
  'openWork': [
    "你點開了一個新作品呢！",
    "㊗️ 玩得愉快！有問題歡迎回首頁問我喔～"
  ],
  'hoverMenu': [
    "這是選單，可以切換作品或筆記～",
    "每個按鈕都能試試看喔！"
  ],
  'returnHome': [
    "歡迎回到首頁！需要我幫忙嗎？",
    "多和我聊天互動吧～"
  ]
};
let currentDialogue = null; // 當前要顯示的特殊對話
let dialogueTimer = 0; // 用於計時，讓對話自動消失
const dialogueAutoHideMs = 1600; // 🌟 恢復原始設定
// 可由特定事件覆蓋的最小停留時間（毫秒），例如選單 hover 要求至少停 3000ms
let dialogueMinMsOverride = 0;

let hoveredMenu = null; // 紀錄目前滑鼠懸停在哪個選單上

// 🌟 作品連結和新的名稱對應 (已更新連結)
const externalLinks = {
    '單元一作品': 'https://zyeii06.github.io/pop/',
    '單元一筆記': 'https://hackmd.io/@lcienz/BJBl5dyngg',
    '測驗系統': 'https://zyeii06.github.io/test/', // 保持不變
    '測驗卷筆記': 'https://hackmd.io/@lcienz/rkESw6dk-l',
    '作品筆記': '#',
    '淡江大學': {
        '淡江大學官網': 'https://www.tku.edu.tw/',
        '教育科技學系官網': 'https://www.et.tku.edu.tw/',
    }
};

// 每個按鈕的有趣提示文字（用於 tooltip）
const tooltipTexts = {
    '回到首頁': '想回首頁看看更多嗎？點這裡就好！',
    '單元一作品': '想要玩遊戲嗎? 快來看看我是如何做出作品的!',
    '單元一筆記': '筆記裡藏了製作過程的祕訣，快打開看看～',
    '測驗系統': '想挑戰測驗能力？來試試看！',
    '測驗卷筆記': '這裡是做題筆記，幫你複習要點～',
    '作品筆記': '作品筆記：我的創作想法與流程',
    '淡江大學': '淡江相關連結，看看學校資訊～',
    '淡江大學官網': '官網在這裡，想了解學校嗎？',
    '教育科技學系官網': '教育科技學系官網，點進去看看系上消息！'
};

// 在 tooltip 文本中加入 emoji/icon 示範（可以使用 emoji 或 <img> 標籤）
tooltipTexts['單元一作品'] = '📸 想要玩遊戲嗎? 快來看看我是如何做出作品的!';
tooltipTexts['單元一筆記'] = '📚 筆記裡藏了製作過程的祕訣，快打開看看～';
tooltipTexts['測驗系統'] = '🧠 想挑戰測驗能力？來試試看！';
tooltipTexts['淡江大學'] = '🎓 淡江相關連結，看看學校資訊～';
// 更新：測驗卷筆記的提示文字
tooltipTexts['測驗卷筆記'] = '想知道如何做測驗系統嗎?快點我參考!';

// 貓咪點擊反應動畫狀態
let tailWagging = false;
let tailWagStart = 0;
let tailWagDuration = 900; // ms

let eyeBlinking = false;
let eyeBlinkStart = 0;
let eyeBlinkDuration = 350; // ms

const interactiveTexts = [
    "教科一A 呂俞錚 414730670",
    "大家好，我是呂俞錚",
    "畢業於內湖高工應用英文科",
    "我喜歡記錄生活和追劇"
];
let currentTextIndex = 0;
// 🌟 文字動畫相關變數
let isTextAnimating = false;
let textAnimationStart = 0;
const textAnimationDuration = 600; // 動畫總時長 (毫秒) - 延長時間以顯示彈簧效果
const textJumpHeight = 20; // 跳動高度 (像素)
let textYOffset = 0;
let textChangedDuringAnimation = false;

// 🌟 貓咪耳朵動畫相關變數
let isEarAnimating = false;
let earAnimationStart = 0;
const earAnimationDuration = 400; // 耳朵動畫時長
let earOffsetY = 0; // 耳朵垂直位移

// 瞳孔追蹤平滑變數
let lastPupilOffsetL = { x: 0, y: 0 };
let lastPupilOffsetR = { x: 0, y: 0 };

// 可愛互動效果狀態
let blushing = false;
let blushStart = 0;
const blushDuration = 900; // 毫秒

let headNod = false;
let headNodStart = 0;
const headNodDuration = 480;

// 口型動態（在顯示對話時啟動）
let mouthTalking = false;
let mouthTalkStart = 0;
const mouthTalkPeriod = 220; // 口型振幅週期

// 🌟 新增：貓咪顏色變數
let catBodyColor;
let catStrokeColor;
let catInnerEarColor;

// 🌟 新增：貓咪點擊變色的調色盤
const catColorPalette = [
  '#eae2b7', // 米黃
  '#22223b', // 🌟 深藍紫
  '#250902', // 🌟 深棕
  '#463f3a', // 🌟 咖啡
  '#edf2f4', // 淺灰藍
  '#0a0908'  // 近黑
];

// iframe 相關變數
let contentFrame; 
const iframeScale = 0.8; 
let iframeLoadingEl = null;
let iframeLoadTimeout = null;

// iframe 面板 DOM 與拖曳/縮放狀態
let iframePanel = null;
let panelCloseBtn = null;
let panelResizeHandle = null;
let isDraggingPanel = false;
let dragOffset = { x: 0, y: 0 };
let isResizing = false;
let startSize = { w: 0, h: 0 };
let startMouse = { x: 0, y: 0 };
const IFRAME_LOAD_TIMEOUT_MS = 8000;

// 選單相關變數
let menuContainer;
let hamburger; 

// 🌟 更新：作品樣式配置
const styles = {
    '單元一作品': { // 馬卡龍粉 + 奶油白
        background: [255, 204, 204],    
        dotColor: [255, 255, 240]     
    },
    '單元一筆記': { // 馬卡龍藍 + 檸檬黃
        background: [173, 216, 230], 
        dotColor: [253, 253, 150]   
    },
    '測驗系統': { // 薄荷綠 + 奶油白
        background: [189, 236, 182],
        dotColor: [255, 255, 240]
    },
    '測驗卷筆記': { // 蜜桃粉 + 天空藍
        background: [255, 218, 185],
        dotColor: [135, 206, 250]
    },
    '作品筆記': { // 淺灰 + 柔粉
        background: [211, 211, 211],
        dotColor: [255, 192, 203]
    },
    // 🌟 淡江大學父選單使用與關閉作品相同的柔和色調
    '淡江大學': { 
        background: [255, 248, 220], // 奶油黃 (與關閉作品一致)
        dotColor: [200, 162, 200] // 薰衣草紫 (與關閉作品一致)
    },
    '淡江大學官網': { // 淺紫 + 奶油白
        background: [221, 160, 221],
        dotColor: [255, 255, 240]
    },
    '教育科技學系官網': { // 鵝黃 + 深藍
        background: [255, 255, 204],
        dotColor: [0, 0, 139]
    },
    '關閉作品': { // 奶油黃 + 薰衣草紫
        background: [255, 248, 220], 
        dotColor: [200, 162, 200]      
    }
};

let currentWork = '關閉作品'; // 初始為關閉作品，顯示動畫

// 🌟 定義首頁按鈕的名稱
const homeButtonName = '回到首頁';
styles['回到首頁'] = styles['關閉作品']; // 讓「回到首頁」使用與「關閉作品」相同的樣式


// The Dot class
class Dot {
    constructor(x, y) {
        this.pos = createVector(x, y); 
        this.origin = this.pos.copy(); 
        this.speed = createVector(0, 0); 
    }
    
    update(m) {
        let mouseToOrigin = this.origin.copy();
        mouseToOrigin.sub(m);
        const d = mouseToOrigin.mag();
        const c = map(d, 0, distThreshold, 0, PI);
        
        // 🌟 新增：計算所有波紋效果的總位移
        let rippleDisplacement = createVector(0, 0);
        for (let i = ripples.length - 1; i >= 0; i--) {
            const ripple = ripples[i];
            const elapsed = millis() - ripple.startTime;
            if (elapsed > ripple.duration) {
                ripples.splice(i, 1); // 移除舊的波紋
                continue;
            }

            const currentRadius = (elapsed / ripple.duration) * ripple.maxRadius;
            const distToRipple = dist(this.origin.x, this.origin.y, ripple.x, ripple.y);
            
            // 檢查點是否在波紋的環上
            if (abs(distToRipple - currentRadius) < ripple.waveWidth) {
                const angle = atan2(this.origin.y - ripple.y, this.origin.x - ripple.x);
                const moveAmount = ripple.amplitude * sin(PI * (abs(distToRipple - currentRadius) / ripple.waveWidth));
                rippleDisplacement.add(p5.Vector.fromAngle(angle, moveAmount));
            }
        }

        mouseToOrigin.normalize();
        mouseToOrigin.mult(distortionAmount * sin(c));
        const target = createVector(this.origin.x + mouseToOrigin.x, this.origin.y + mouseToOrigin.y);

        let strokeWidth;
        
        let acceleration = this.pos.copy();
        acceleration.sub(target);
        acceleration.mult(-map(m.dist(this.pos), 0, 2 * max(width, height), 0.1, 0.01));
        
        this.speed.add(acceleration);
        this.speed.mult(0.87);
        this.pos.add(this.speed).add(rippleDisplacement); // 🌟 將波紋位移加入最終位置

        // 🌟 點陣圖的「色彩脈衝」互動 (新功能)
        const baseColor = styles[currentWork].dotColor;
        
        let dotColorR = baseColor[0];
        let dotColorG = baseColor[1];
        let dotColorB = baseColor[2];

        // 距離越近，脈衝強度越大 (從 distThreshold 映射到 1)
        if (d < distThreshold) {
            const pulseStrength = map(d, 0, distThreshold, 1, 0); 
            
            // 顏色混合：從基礎色朝白色 (255, 255, 255) 混合
            dotColorR = lerp(baseColor[0], 255, pulseStrength * 0.5); // 0.5 避免變成純白
            dotColorG = lerp(baseColor[1], 255, pulseStrength * 0.5);
            dotColorB = lerp(baseColor[2], 255, pulseStrength * 0.5);
            
            strokeWidth = 1 + 10 * abs(cos(c / 2));
        } else {
            // 保持不變
            strokeWidth = map(min(d, max(width, height)), 0, max(width, height), 5, 0.1);
        }
        
        stroke(dotColorR, dotColorG, dotColorB); // 使用計算後的新顏色
        strokeWeight(strokeWidth);
        point(this.pos.x, this.pos.y);
    }
}

// 初始化點陣列，確保置中
function initializeDots() {
    dots = []; 
    const gridDim = numb * step;
    const dx = (width - gridDim) / 2; 
    const dy = (height - gridDim) / 2; 
    
    for (let i = 0; i < numb; i++) {
        dots[i] = [];
        for (let j = 0; j < numb; j++) {
            const x = i * step + dx;
            const y = j * step + dy;
            dots[i][j] = new Dot(x, y);
        }
    }
}

// 核心切換邏輯：控制 iframe
// 立即在 iframe 開啟對應連結（用於點擊時立即載入）
function openLinkImmediate(workName) {
    if (!contentFrame) return;

    let link;
    if (externalLinks['淡江大學'] && externalLinks['淡江大學'][workName]) {
        link = externalLinks['淡江大學'][workName];
    } else {
        link = externalLinks[workName];
    }

    if (typeof link === 'object' && link !== null) {
        // 父選單，沒有直接連結 -> 隱藏 iframe
        contentFrame.style.display = 'none';
        contentFrame.src = '';
        return;
    }

    if (link) {
        // 立即在 iframe 載入並顯示 loading overlay
        contentFrame.src = link;
        // 顯示整個面板並置中
        if (iframePanel) {
            iframePanel.style.display = 'flex';
            // 將 panel 置中
            iframePanel.style.left = '50%';
            iframePanel.style.top = '50%';
            iframePanel.style.transform = 'translate(-50%, -50%)';
        }
        if (iframeLoadingEl) iframeLoadingEl.style.display = 'flex';
        // 設定超時備援（避免永久顯示 loading）
        if (iframeLoadTimeout) clearTimeout(iframeLoadTimeout);
        iframeLoadTimeout = setTimeout(() => {
            if (iframeLoadingEl) iframeLoadingEl.style.display = 'none';
            iframeLoadTimeout = null;
        }, IFRAME_LOAD_TIMEOUT_MS);
    } else {
        if (iframePanel) iframePanel.style.display = 'none';
        contentFrame.src = '';
    }
}

function changeWork(workName) {
    // 🌟 根據不同操作，觸發不同的對話
    if (workName === homeButtonName) {
        currentWork = '關閉作品';
        // 觸發「回到首頁」的對話
        currentDialogue = extraDialogues['returnHome'];
        dialogueTimer = millis(); // 重置計時器
    } else {
        currentWork = workName;
        // 只要不是回首頁，都觸發「打開作品」的對話
        // (即使是 HackMD 在新分頁打開，也算是一種操作)
        currentDialogue = extraDialogues['openWork'];
        dialogueTimer = millis(); // 重置計時器
    }

    let link;
    // 檢查是否為巢狀連結
    if (externalLinks['淡江大學'] && externalLinks['淡江大學'][workName]) {
        link = externalLinks['淡江大學'][workName];
    } else {
        link = externalLinks[workName]; // 取得對應的連結
    }

    // 處理巢狀連結，如果 currentWork 是父選單的名稱 (例如 '淡江大學')
    if (typeof link === 'object' && link !== null) { 
        if (iframePanel) iframePanel.style.display = 'none';
        contentFrame.src = '';
        return; 
    }

    // 1. 如果是筆記連結，強制在新分頁開啟 (HackMD 不允許嵌入)
    // 2. 否則，都嘗試在 iframe 中開啟，包括淡江大學的網站。
    
    if (workName.includes('筆記')) {
        contentFrame.src = link;
        if (iframePanel) iframePanel.style.display = 'flex';
    } else if (link) {
        contentFrame.src = link;
        if (iframePanel) iframePanel.style.display = 'flex';
    } else {
        if (iframePanel) iframePanel.style.display = 'none';
        contentFrame.src = '';
    }
}

// 調整 iframe 尺寸的函式
function resizeIframe() {
    if (!contentFrame) return;

    // 將 iframe 大小設為容器內百分比（由 panel 的大小決定）
    if (iframePanel) {
        // 當 panel 有 max/min 限制時，讓 iframe 充滿 panel 除了 header 的高度
        const panelRect = iframePanel.getBoundingClientRect();
        const headerH = 44; // 與 CSS 同步
        const availW = Math.max(200, panelRect.width - 0);
        const availH = Math.max(120, panelRect.height - headerH - 20);
        contentFrame.style.width = availW + 'px';
        contentFrame.style.height = availH + 'px';
    } else {
        const newWidth = windowWidth * iframeScale;
        const newHeight = windowHeight * iframeScale;
        contentFrame.style.width = newWidth + 'px';
        contentFrame.style.height = newHeight + 'px';
    }
}

// --- p5.js Preload Function ---
function preload() {
    // 🌟 預先載入圖片，請確保 'assets/profile.png' 存在
    try {
        profileImage = loadImage('assets/profile.png');
    } catch(e) {
        console.error("無法載入圖片: assets/profile.png", e);
        profileImage = null; // 載入失敗則設為 null
    }
}


// --- p5.js Setup Function ---
function setup() {
    createCanvas(displayWidth, displayHeight); 
    initializeDots();
    
    // 🌟 新增：初始化貓咪顏色
    catBodyColor = color('#463f3a'); // 🌟 初始為溫暖的咖啡色
    catBodyColor.setAlpha(230);
    catStrokeColor = lerpColor(catBodyColor, color(255), 0.3); // 🌟 初始邊框為身體的亮色，以在深色上突顯
    catInnerEarColor = color('#ffa5ab'); // 🌟 改為指定的粉紅色

    // 獲取 iframe 元素並調整尺寸
    contentFrame = document.getElementById('contentFrame');
    if (contentFrame) {
        resizeIframe(); 
    }
    // 取得 loading overlay 元素並註冊 load 事件
    iframeLoadingEl = document.getElementById('iframe-loading');
    if (contentFrame) {
        contentFrame.onload = () => {
            if (iframeLoadingEl) iframeLoadingEl.style.display = 'none';
            if (iframeLoadTimeout) {
                clearTimeout(iframeLoadTimeout);
                iframeLoadTimeout = null;
            }
        };
    }
    
    // 創建漢堡圖示
    hamburger = createDiv(''); 
    hamburger.id('hamburger');
    hamburger.child(createDiv(''));
    hamburger.child(createDiv(''));
    hamburger.child(createDiv(''));
    hamburger.mousePressed(toggleMenu);

    // 創建選單容器
    menuContainer = createDiv();
    menuContainer.id('menu-container'); 
    
    // 創建按鈕並添加到容器中
    // 合併所有頂層連結和父選單名稱
    const topLevelLinks = { ...externalLinks, '回到首頁': '#' };
    delete topLevelLinks['作品筆記']; // 假設我們暫時不顯示這個

    for (const name in topLevelLinks) {
        const link = topLevelLinks[name];
        if (typeof link === 'object' && link !== null) {
            // 這是父選單 (例如 '淡江大學')
            const parentDiv = createDiv(name);
            parentDiv.addClass('parent-menu');
            const subMenu = createDiv('');
            subMenu.addClass('sub-menu');
            parentDiv.child(subMenu);
            menuContainer.child(parentDiv);

            // 創建子選單按鈕
            for (const subName in link) {
                let subButton = createButton(subName);
                subButton.addClass('menu-btn'); // 🌟 為子按鈕添加 class
                
                // 🌟 為子選單按鈕添加懸停事件
                subButton.mouseOver(() => {
                    // 設置當前懸停的選單名稱，用於繪製提示泡泡
                    hoveredMenu = subName; 
                    // 觸發「懸停選單」的對話
                    currentDialogue = extraDialogues['hoverMenu'];
                    dialogueTimer = millis();
                    // 確保懸停訊息至少顯示 3000ms
                    dialogueMinMsOverride = 3000;
                    // 顯示 tooltip
                    const tooltip = document.getElementById('menu-tooltip');
                    if (tooltip) {
                        const rect = subButton.elt.getBoundingClientRect();
                        const tip = tooltipTexts[subName] || ('這是「' + subName + '」');
                        tooltip.textContent = tip;
                        tooltip.style.left = (rect.right + 12) + 'px';
                        tooltip.style.top = Math.max(12, rect.top + rect.height/2 - 18) + 'px';
                        tooltip.style.display = 'block';
                    }
                });
                subButton.mouseOut(() => {
                    // 滑鼠移開時，清除懸停狀態
                    hoveredMenu = null; 
                    // 如果當前對話是「懸停選單」，則清除它
                    if (currentDialogue === extraDialogues['hoverMenu']) {
                        currentDialogue = null;
                        dialogueMinMsOverride = 0;
                    }
                    const tooltip = document.getElementById('menu-tooltip');
                    if (tooltip) tooltip.style.display = 'none';
                });

                subButton.mousePressed(() => {
                    // 觸發貓咪點擊反應動畫
                    tailWagging = true; tailWagStart = millis();
                    eyeBlinking = true; eyeBlinkStart = millis();
                    // 🌟 新增：點擊選單時，在畫面中央產生一個波紋
                    ripples.push({
                        x: width / 2,
                        y: height / 2,
                        startTime: millis(),
                        maxRadius: max(width, height) * 0.8,
                        duration: 1200, // 波紋持續時間 (毫秒)
                        amplitude: 30,   // 波紋振幅
                        waveWidth: 50    // 波紋寬度
                    });
                    // 立即在 iframe 開啟連結（不等待其他動作）
                    openLinkImmediate(subName);
                    // 更新內部狀態並關閉選單
                    changeWork(subName);
                    toggleMenu();
                });
                subMenu.child(subButton);
            }
        } else {
            // 一般按鈕
            let button = createButton(name);
            button.addClass('menu-btn'); // 🌟 為一般按鈕添加 class

            // 🌟 為一般按鈕添加懸停事件
            button.mouseOver(() => {
                hoveredMenu = name;
                currentDialogue = extraDialogues['hoverMenu'];
                dialogueTimer = millis();
                dialogueMinMsOverride = 3000;
                const tooltip = document.getElementById('menu-tooltip');
                if (tooltip) {
                    const rect = button.elt.getBoundingClientRect();
                    const tip = tooltipTexts[name] || ('這是「' + name + '」');
                    tooltip.textContent = tip;
                    tooltip.style.left = (rect.right + 12) + 'px';
                    tooltip.style.top = Math.max(12, rect.top + rect.height/2 - 18) + 'px';
                    tooltip.style.display = 'block';
                }
            });
            button.mouseOut(() => {
                hoveredMenu = null;
                if (currentDialogue === extraDialogues['hoverMenu']) {
                    currentDialogue = null;
                    dialogueMinMsOverride = 0;
                }
                const tooltip = document.getElementById('menu-tooltip');
                if (tooltip) tooltip.style.display = 'none';
            });

            button.mousePressed(() => {
                tailWagging = true; tailWagStart = millis();
                eyeBlinking = true; eyeBlinkStart = millis();
                // 🌟 新增：點擊選單時，在畫面中央產生一個波紋
                ripples.push({
                    x: width / 2,
                    y: height / 2,
                    startTime: millis(),
                    maxRadius: max(width, height) * 0.8,
                    duration: 1200,
                    amplitude: 30,
                    waveWidth: 50
                });
                // 立即在 iframe 開啟連結
                openLinkImmediate(name);
                changeWork(name);
                toggleMenu();
            });
            menuContainer.child(button);
        }
    }
    
    // 確保初始狀態下 iframe 是隱藏的
    if (contentFrame) {
        contentFrame.style.display = 'block'; // iframe 本身 always block; panel 控制顯示
        // 取得 panel DOM 元素與控制項
        iframePanel = document.getElementById('iframe-panel');
        panelCloseBtn = document.getElementById('iframe-panel-close');
        panelResizeHandle = document.getElementById('iframe-resize-handle');
        if (iframePanel) {
            iframePanel.style.display = 'none';
            // 置中初始位置
            iframePanel.style.left = '50%';
            iframePanel.style.top = '50%';
            iframePanel.style.transform = 'translate(-50%, -50%)';
        }
        if (panelCloseBtn) panelCloseBtn.addEventListener('click', () => { if (iframePanel) iframePanel.style.display = 'none'; contentFrame.src = ''; if (iframeLoadingEl) iframeLoadingEl.style.display = 'none'; });
        // 拖曳邏輯（透過 header）
        const header = document.getElementById('iframe-panel-header');
        if (header && iframePanel) {
            header.style.cursor = 'grab';
            header.addEventListener('mousedown', (ev) => {
                isDraggingPanel = true;
                const rect = iframePanel.getBoundingClientRect();
                dragOffset.x = ev.clientX - rect.left;
                dragOffset.y = ev.clientY - rect.top;
                header.style.cursor = 'grabbing';
            });
        }
        // 縮放手把
        if (panelResizeHandle && iframePanel) {
            panelResizeHandle.addEventListener('mousedown', (ev) => {
                isResizing = true;
                startSize.w = iframePanel.offsetWidth;
                startSize.h = iframePanel.offsetHeight;
                startMouse.x = ev.clientX;
                startMouse.y = ev.clientY;
                ev.preventDefault();
            });
        }
        // 全域滑鼠事件用於拖曳/縮放
        window.addEventListener('mousemove', (ev) => {
            if (isDraggingPanel && iframePanel) {
                // 計算新的左上角
                let nx = ev.clientX - dragOffset.x;
                let ny = ev.clientY - dragOffset.y;
                // 限制邊界
                const pad = 8;
                const wRect = iframePanel.offsetWidth;
                const hRect = iframePanel.offsetHeight;
                nx = Math.min(window.innerWidth - pad - wRect, Math.max(pad, nx));
                ny = Math.min(window.innerHeight - pad - hRect, Math.max(pad, ny));
                iframePanel.style.left = nx + 'px';
                iframePanel.style.top = ny + 'px';
                iframePanel.style.transform = 'translate(0, 0)';
            }
            if (isResizing && iframePanel) {
                const dx = ev.clientX - startMouse.x;
                const dy = ev.clientY - startMouse.y;
                const newW = Math.max(280, startSize.w + dx);
                const newH = Math.max(180, startSize.h + dy);
                iframePanel.style.width = newW + 'px';
                iframePanel.style.height = newH + 'px';
                // 重新計算 iframe 大小
                resizeIframe();
            }
        });
        window.addEventListener('mouseup', () => {
            if (isDraggingPanel) {
                isDraggingPanel = false;
                const header = document.getElementById('iframe-panel-header');
                if (header) header.style.cursor = 'grab';
            }
            if (isResizing) {
                isResizing = false;
            }
        });
    }
}

// 漢堡選單開關功能
function toggleMenu() {
    menuContainer.toggleClass('open');
    if (hamburger) {
        // 切換漢堡的 open 類別，以觸發 CSS 動畫
        if (menuContainer.hasClass('open')) hamburger.addClass('open');
        else hamburger.removeClass('open');
    }
}

// --- p5.js Draw Function ---
function draw() {
    // --- 繪製點動畫 ---
    const currentStyle = styles[currentWork];

    // 1. 繪製背景
    fill(currentStyle.background);
    noStroke();
    rect(0, 0, width, height);

    // 2. 設定點的顏色 (注意：實際顏色在 Dot.update() 中動態設定)
    stroke(currentStyle.dotColor);

    // 繪製點的動畫
    const m = createVector(mouseX, mouseY);
    for (let i = 0; i < numb; i++) {
        for (let j = 0; j < numb; j++) {
            dots[i][j].update(m);
        }
    }

    // 🌟 在動畫中間添加貓咪對話框和圖片（僅在首頁）
    if (currentWork === '關閉作品') {
        // 懸浮呼吸偏移量
        const breathOffset = sin(frameCount * 0.03) * 5;

        const bubbleW = 380;
        const bubbleH = 180;
        const bubbleX = width / 2 + 350;
        // textYOffset 會由文字動畫影響，這裡把它加進來
        const bubbleY = height / 2 - 200 + textYOffset + breathOffset;

        // 偵測滑鼠是否在對話框原始位置（使用未加動態偏移的基準 Y）
        const baseBubbleY = height / 2 - 200;
        const isHovering = mouseX > bubbleX - bubbleW / 2 && mouseX < bubbleX + bubbleW / 2 &&
                          mouseY > baseBubbleY - bubbleH / 2 && mouseY < baseBubbleY + bubbleH / 2;

        // 觸發耳朵動畫
        if (isHovering && !isEarAnimating) {
            isEarAnimating = true;
            earAnimationStart = millis();
        }
        if (isEarAnimating) {
            let elapsed = millis() - earAnimationStart;
            if (elapsed < earAnimationDuration) {
                let progress = elapsed / earAnimationDuration;
                earOffsetY = -20 * sin(progress * PI);
            } else {
                isEarAnimating = false;
                earOffsetY = 0;
            }
        }

        // 文字彈跳動畫
        if (isTextAnimating) {
            let elapsed = millis() - textAnimationStart;
            if (elapsed < textAnimationDuration) {
                const progress = elapsed / textAnimationDuration;
                // 彈簧式跳動（衰減）
                const bounce = sin(progress * PI * 2) * (1 - progress);
                textYOffset = -textJumpHeight * bounce;
            } else {
                // 動畫結束
                isTextAnimating = false;
                textYOffset = 0;
                if (!textChangedDuringAnimation) {
                    currentTextIndex = (currentTextIndex + 1) % interactiveTexts.length;
                    textChangedDuringAnimation = true;
                }
            }
        } else {
            textChangedDuringAnimation = false;
        }

        // 繪製圖片 (個人頭像)
        if (profileImage) {
            const imgHeight = 300;
            const imgWidth = imgHeight * (profileImage.width / profileImage.height);
            imageMode(CENTER);
            image(profileImage, width / 2, height / 2, imgWidth, imgHeight);
        }

        // 繪製貓咪對話框
        fill(255, 255, 240, 230);
        stroke(200, 162, 200);
        strokeWeight(3);
        drawCatBubble(bubbleX, bubbleY, bubbleW, bubbleH, earOffsetY);

        // 在貓咪下方顯示對話文字（改為顯示在貓咪下面）
        noStroke();
        fill(150, 112, 150);
        textStyle(BOLD);
        textSize(24);
        textAlign(CENTER, CENTER);

        const minDisplayMs = Math.max(dialogueAutoHideMs, dialogueMinMsOverride || 0);
        if (currentDialogue && millis() - dialogueTimer < minDisplayMs) {
            let dialogueToShow = currentDialogue[0];
            if (currentDialogue[1] && (millis() - dialogueTimer > dialogueAutoHideMs / 2)) {
                dialogueToShow = currentDialogue[1];
            }
            text(dialogueToShow, bubbleX, bubbleY + bubbleH / 2 + 28);
        } else {
            text(interactiveTexts[currentTextIndex], bubbleX, bubbleY + bubbleH / 2 + 28);
        }

        // 點擊提示文字（小字）
        fill(120);
        textSize(12);
        textStyle(NORMAL);
        text('(點擊對話框)', bubbleX, bubbleY + bubbleH / 2 + 56);
    }

    // 處理滑鼠懸停時的選單自動開關與 UI 更新
    handleMenuHover();
    updateUI();
}

/**
* 繪製貓咪頭形狀的對話框 (包含耳朵動畫和尾巴)
*/
function drawCatBubble(x, y, w, h, earOffset) {
    const earHeight = h / 2;
    const earWidth = w / 4;
    const earYPos = y - h * 0.3; // 耳朵底部Y座標

    // 計算頭部輕微旋轉（根據滑鼠位置與點頭動畫）
    let headAngle = 0;
    // 當滑鼠接近貓咪時往滑鼠方向微轉
    const dx = mouseX - x;
    const dy = mouseY - y;
    const distToMouse = sqrt(dx*dx + dy*dy);
    if (distToMouse < w * 1.2) {
        headAngle = map(dx, -w, w, -0.06, 0.06);
    }
    // 加入點頭動畫（優先）
    if (headNod) {
        const hnElapsed = millis() - headNodStart;
        if (hnElapsed > headNodDuration) {
            headNod = false;
        } else {
            const p = hnElapsed / headNodDuration;
            // 做一個小幅度的上下擺動轉角
            headAngle += sin(p * PI * 2) * 0.06 * (1 - p);
        }
    }

    // 臉部（含旋轉）
    push();
    translate(x, y);
    rotate(headAngle);
    stroke(catStrokeColor); // 使用變數
    strokeWeight(3);
    fill(catBodyColor); // 使用變數
    ellipse(0, 0, w, h);

    // 耳朵填充（在旋轉後的座標系，需以相對值繪製）
    noStroke();
    fill(catBodyColor); // 使用變數
    const leftEarX = -w * 0.25; // 貓咪左耳中心X
    const rightEarX = w * 0.25;
    const earYPosLocal = -h * 0.3;
    triangle(leftEarX - earWidth / 2, earYPosLocal,
             leftEarX + earWidth / 2, earYPosLocal,
             leftEarX, earYPosLocal - earHeight + earOffset);
    triangle(rightEarX - earWidth / 2, earYPosLocal,
             rightEarX + earWidth / 2, earYPosLocal,
             rightEarX, earYPosLocal - earHeight + earOffset);

    // 🌟 新增：繪製粉紅色內耳
    noStroke();
    fill(catInnerEarColor);
    const innerEarHeight = earHeight * 0.6;
    const innerEarWidth = earWidth * 0.6;
    const innerEarYPos = earYPosLocal + earHeight * 0.2;
    triangle(leftEarX - innerEarWidth / 2, innerEarYPos,
             leftEarX + innerEarWidth / 2, innerEarYPos,
             leftEarX, innerEarYPos - innerEarHeight + earOffset * 0.8);
    triangle(rightEarX - innerEarWidth / 2, innerEarYPos,
             rightEarX + innerEarWidth / 2, innerEarYPos,
             rightEarX, innerEarYPos - innerEarHeight + earOffset * 0.8);

    // 耳朵外邊線
    stroke(catStrokeColor); // 使用變數
    noFill();
    line(leftEarX - earWidth / 2, earYPosLocal, leftEarX, earYPosLocal - earHeight + earOffset);
    line(leftEarX, earYPosLocal - earHeight + earOffset, leftEarX + earWidth / 2, earYPosLocal);
    line(rightEarX - earWidth / 2, earYPosLocal, rightEarX, earYPosLocal - earHeight + earOffset);
    line(rightEarX, earYPosLocal - earHeight + earOffset, rightEarX + earWidth / 2, earYPosLocal);

    stroke(catStrokeColor); // 使用變數
    strokeWeight(3);
    noFill();
    const tailStartX = -w * 0.45;
    const tailStartY = h * 0.22;
    const tailEndX = tailStartX - 30;
    const tailEndY = h * 1.0;
    // 搖尾巴效果
    let tailOffset = 0;
    if (tailWagging) {
        const tElapsed = millis() - tailWagStart;
        if (tElapsed > tailWagDuration) {
            tailWagging = false;
        } else {
            const tNorm = tElapsed / tailWagDuration;
            tailOffset = sin(tNorm * PI * 6) * 18 * (1 - tNorm);
        }
    }
    const control1X = tailStartX - 20 + tailOffset;
    const control1Y = tailStartY + 30;
    const control2X = tailStartX - 40 + tailOffset * 0.5;
    const control2Y = tailStartY + 60;
    bezier(tailStartX, tailStartY, control1X, control1Y, control2X, control2Y, tailEndX, tailEndY);

    // 繪製 Q 版大圓眼（含高光），支援眨眼
    const eyeY = -h * 0.08;
    const leftEyeX = -w * 0.18;
    const rightEyeX = w * 0.18;
    const eyeR = w * 0.16; // 大眼半徑

    let blinkProgress = 0;
    if (eyeBlinking) {
        const eElapsed = millis() - eyeBlinkStart;
        if (eElapsed > eyeBlinkDuration) {
            eyeBlinking = false;
            blinkProgress = 0;
        } else {
            const p = eElapsed / eyeBlinkDuration;
            blinkProgress = sin(p * PI);
        }
    }

    const eyeOpen = max(0, 1 - blinkProgress);

    // 畫眼白與瞳孔與高光（含目光追蹤）
    if (eyeOpen > 0.12) {
        noStroke();
        // 眼白
        fill(255);
        ellipse(leftEyeX, eyeY, eyeR, eyeR * (0.9 * eyeOpen + 0.1));
        ellipse(rightEyeX, eyeY, eyeR, eyeR * (0.9 * eyeOpen + 0.1));

        // 計算瞳孔偏移（從眼中心指向滑鼠），並限制在眼球內
        const pupilR = eyeR * 0.52;
        const maxOffset = eyeR * 0.28; // 最大偏移距離

        // 為了在 head rotate/translate 的座標系下正確追蹤，需要把全域滑鼠座標轉換到當前座標系
        // 先取得相對於旋轉中心 (x,y) 的向量
        const mx = mouseX - x;
        const my = mouseY - y;
        // 把該向量逆轉 rotate(headAngle)
        const cosA = cos(-headAngle);
        const sinA = sin(-headAngle);
        const localMouseX = mx * cosA - my * sinA;
        const localMouseY = mx * sinA + my * cosA;

        const targetVecL = { x: localMouseX - leftEyeX, y: localMouseY - eyeY };
        const targetVecR = { x: localMouseX - rightEyeX, y: localMouseY - eyeY };

        const distL = sqrt(targetVecL.x * targetVecL.x + targetVecL.y * targetVecL.y);
        const distR = sqrt(targetVecR.x * targetVecR.x + targetVecR.y * targetVecR.y);

        const normL = distL > 0 ? { x: targetVecL.x / distL, y: targetVecL.y / distL } : { x: 0, y: 0 };
        const normR = distR > 0 ? { x: targetVecR.x / distR, y: targetVecR.y / distR } : { x: 0, y: 0 };

        let desiredOffsetL = { x: normL.x * min(maxOffset, distL), y: normL.y * min(maxOffset, distL) };
        let desiredOffsetR = { x: normR.x * min(maxOffset, distR), y: normR.y * min(maxOffset, distR) };

        // 當眨眼時不追蹤（平滑回中心）
        if (eyeBlinking) {
            desiredOffsetL = { x: 0, y: 0 };
            desiredOffsetR = { x: 0, y: 0 };
        }

        // 線性差值平滑上一幀的偏移，避免跳動
        const smoothSpeed = 0.22; // 0..1，越高越跟隨
        lastPupilOffsetL.x = lerp(lastPupilOffsetL.x, desiredOffsetL.x, smoothSpeed);
        lastPupilOffsetL.y = lerp(lastPupilOffsetL.y, desiredOffsetL.y, smoothSpeed);
        lastPupilOffsetR.x = lerp(lastPupilOffsetR.x, desiredOffsetR.x, smoothSpeed);
        lastPupilOffsetR.y = lerp(lastPupilOffsetR.y, desiredOffsetR.y, smoothSpeed);

        const pupilCenterLX = leftEyeX + lastPupilOffsetL.x;
        const pupilCenterLY = eyeY + lastPupilOffsetL.y;
        const pupilCenterRX = rightEyeX + lastPupilOffsetR.x;
        const pupilCenterRY = eyeY + lastPupilOffsetR.y;

        // 瞳孔
        fill(30, 28, 30);
        ellipse(pupilCenterLX, pupilCenterLY, pupilR, pupilR);
        ellipse(pupilCenterRX, pupilCenterRY, pupilR, pupilR);

        // 高光（大），依照瞳孔位置偏移，保持在瞳孔左上方相對位置
        fill(255);
        ellipse(pupilCenterLX - pupilR * 0.28, pupilCenterLY - pupilR * 0.36, pupilR * 0.46, pupilR * 0.46);
        ellipse(pupilCenterRX - pupilR * 0.28, pupilCenterRY - pupilR * 0.36, pupilR * 0.46, pupilR * 0.46);
        // 高光（小）
        fill(255, 255, 255, 200);
        ellipse(pupilCenterLX + pupilR * 0.22, pupilCenterLY - pupilR * 0.12, pupilR * 0.18, pupilR * 0.18);
        ellipse(pupilCenterRX + pupilR * 0.22, pupilCenterRY - pupilR * 0.12, pupilR * 0.18, pupilR * 0.18);
    } else {
        // 閉眼（簡單畫一條彎線）
        stroke(50, 40, 50);
        strokeWeight(3);
        noFill();
        arc(leftEyeX, eyeY, eyeR * 0.9, 6, 0, PI);
        arc(rightEyeX, eyeY, eyeR * 0.9, 6, 0, PI);
    }

    // 🌟 新增：根據身體顏色決定五官顏色，確保對比度
    let facialFeatureColor;
    const bodyColorHex = catBodyColor.toString('#rrggbb');
    if (bodyColorHex === '#eae2b7' || bodyColorHex === '#edf2f4') {
        facialFeatureColor = color('#472d30'); // 對淺色身體使用深色五官
    } else {
        facialFeatureColor = color('#edede9'); // 對深色身體使用淺色五官
    }

    // 鼻子：圓弧三角形 (在旋轉後的座標系中繪製)
    const noseY = h * 0.02;
    const noseW = w * 0.06;
    const noseH = noseW * 0.8;
    const cornerR = noseW * 0.14; // 圓角半徑

    noStroke();
    fill(facialFeatureColor);
    // 三個頂點（以尖端向下為基準，座標相對於 translate/rotate 的中心）
    const vTop = { x: 0, y: noseY - noseH / 2 };
    const vBL = { x: -noseW / 2, y: noseY + noseH / 2 };
    const vBR = { x: noseW / 2, y: noseY + noseH / 2 };

    beginShape();
    vertex(vTop.x, vTop.y + cornerR);
    quadraticVertex(vTop.x + noseW * 0.28, vTop.y, vBR.x, vBR.y - cornerR);
    quadraticVertex(vBR.x, vBR.y, vBR.x - cornerR, vBR.y);
    quadraticVertex(vBR.x - noseW * 0.28, vBR.y + noseH * 0.06, vBL.x + cornerR, vBL.y);
    quadraticVertex(vBL.x, vBL.y, vBL.x, vBL.y - cornerR);
    quadraticVertex(vTop.x - noseW * 0.28, vTop.y, vTop.x, vTop.y + cornerR);
    endShape(CLOSE);

    // Y 字嘴巴（簡潔線條）
    const noseBottomY = noseY + noseH / 2;
    const mouthY = noseBottomY + 6;
    const mouthW = w * 0.16;
    const mouthH = w * 0.08;
    stroke(facialFeatureColor); // 🌟 嘴巴顏色改為淺灰色
    strokeWeight(2);
    noFill();

    // 如果正在顯示對話，啟動口型小動畫
    let mouthYOffset = 0;
    if (mouthTalking) {
        const mtElapsed = millis() - mouthTalkStart;
        // 週期性上下變化
        mouthYOffset = sin(mtElapsed / mouthTalkPeriod * TWO_PI) * 2;
        // 停止條件由外部決定（例如停止對話時）
    }

    // 中間豎線（注意在旋轉的本地座標系中）
    line(0, noseBottomY, 0, mouthY + mouthYOffset);
    // 左右分叉（用 bezier 畫柔和的弧）
    bezier(0, mouthY + mouthYOffset, -mouthW * 0.12, mouthY + mouthH * 0.5 + mouthYOffset, -mouthW * 0.5, mouthY + mouthH + mouthYOffset, -mouthW * 0.5, mouthY + mouthH + mouthYOffset);
    bezier(0, mouthY + mouthYOffset, mouthW * 0.12, mouthY + mouthH * 0.5 + mouthYOffset, mouthW * 0.5, mouthY + mouthH + mouthYOffset, mouthW * 0.5, mouthY + mouthH + mouthYOffset);

    // 腮紅（若觸發則漸變顯示）
    if (blushing) {
        const bElapsed = millis() - blushStart;
        let t = constrain(bElapsed / blushDuration, 0, 1);
        let alpha = lerp(200, 40, t); // 從比較飽和到淡出
        noStroke();
        fill(255, 165, 171, alpha); // 🌟 腮紅顏色改為 #ffa5ab
        const blushRX = w * 0.28;
        const blushRY = h * 0.12;
        ellipse(-w * 0.36, noseY, blushRX, blushRY);
        ellipse(w * 0.36, noseY, blushRX, blushRY);
        if (bElapsed > blushDuration) blushing = false;
    }

    // 🌟 新增：繪製鬍鬚
    noFill();
    stroke(139, 69, 19); // 🌟 改為不透明的暖棕色 (SaddleBrown)
    strokeWeight(1.5);
    const whiskerY = noseY + h * 0.05;
    const whiskerStartX = w * 0.15; // 🌟 將鬍鬚分開一點
    const whiskerLen = w * 0.15;
    // 左邊鬍鬚
    line(-whiskerStartX, whiskerY, -whiskerStartX - whiskerLen, whiskerY - 5);
    line(-whiskerStartX, whiskerY + 5, -whiskerStartX - whiskerLen, whiskerY + 5);
    // 右邊鬍鬚
    line(whiskerStartX, whiskerY, whiskerStartX + whiskerLen, whiskerY - 5);
    line(whiskerStartX, whiskerY + 5, whiskerStartX + whiskerLen, whiskerY + 5);

    // 完成旋轉座標系的繪製
    pop();
}

/**
* 🌟 新增：處理滑鼠懸停自動開關選單的邏輯
*/
function handleMenuHover() {
    if (!menuContainer) return; // 確保選單已初始化

    const menuWidth = 250; // 選單的寬度
    // 將 activationZone 設為 0：在滑鼠沒有真正滑到最左側時，選單不會自動露出
    const activationZone = 0; // 左側觸發區域的寬度 (像素)

    const isMenuOpen = menuContainer.hasClass('open');

    // 條件 1: 如果滑鼠在左側觸發區，且選單是關閉的 -> 就打開選單
    if (mouseX <= activationZone && !isMenuOpen) {
        menuContainer.addClass('open');
    }
    // 條件 2: 如果滑鼠已經離開選單區域，且選單是打開的 -> 就關閉選單
    // (這裡的 menuWidth 剛好是選單展開後的寬度)
    else if (mouseX > menuWidth && isMenuOpen) {
        menuContainer.removeClass('open');
    }
}

/**
* 在每一幀中更新 UI 元素
*/
function updateUI() {
    // --- 1. 動態調整漢堡圖示顏色 ---
    if (!hamburger) return;

    const currentStyle = styles[currentWork];
    let bgColor = currentStyle.background;
    let hamburgerColor;

    // 判斷背景亮度
    let brightness = Array.isArray(bgColor) ? (bgColor[0] + bgColor[1] + bgColor[2]) / 3 : bgColor;
    
    // 如果背景偏暗，圖示設為白色；亮背景時使用可愛但醒目的粉色
    hamburgerColor = brightness < 128 ? 'white' : '#FF8DAA';

    // 將顏色寫入 CSS 變數，由 CSS 控制呈現
    try {
        document.documentElement.style.setProperty('--hamburger-color', hamburgerColor);
        // 若選單開啟，將陰影加強
        const shadow = menuContainer && menuContainer.hasClass('open') ? '0 12px 36px rgba(193,86,128,0.28)' : '0 4px 14px rgba(193,86,128,0.12)';
        document.documentElement.style.setProperty('--hamburger-shadow', shadow);
    } catch (e) {
        // fallback: 若無法設變數，仍嘗試直接改每個 bar
        const bars = hamburger.elt.getElementsByTagName('div');
        for (let bar of bars) {
            bar.style.backgroundColor = hamburgerColor;
            bar.style.boxShadow = menuContainer && menuContainer.hasClass('open') ? '0 12px 36px rgba(193,86,128,0.28)' : '0 4px 14px rgba(193,86,128,0.12)';
        }
    }
}

/**
* 🌟 新增：在指定位置創建一個隨機參數的波紋
*/
function createRandomRipple(x, y) {
    ripples.push({
        x: x,
        y: y,
        startTime: millis(),
        // 隨機化波紋的最終大小、持續時間、振幅和寬度
        maxRadius: random(300, max(width, height) * 0.6),
        duration: random(800, 1500),
        amplitude: random(20, 45),
        waveWidth: random(40, 80)
    });
}


/**
* 處理視窗大小改變
*/
function windowResized() {
    resizeCanvas(displayWidth, displayHeight);
    initializeDots();
    
    resizeIframe();
}

function mousePressed() {
    // 🌟 新增：無論點擊何處，都產生一個隨機的波紋效果
    createRandomRipple(mouseX, mouseY);

    // 只在首頁時觸發文字點擊
    if (currentWork === '關閉作品' && !isTextAnimating) { 
        // 檢查點擊是否在雲朵對話框的範圍內
        const bubbleW = 380;
        const bubbleH = 180;
        const bubbleX = width / 2 + 350;
        const bubbleY = height / 2 - 200; // 使用動畫前的原始Y值來偵測

        if (
            mouseX > bubbleX - bubbleW / 2 &&
            mouseX < bubbleX + bubbleW / 2 &&
            mouseY > bubbleY - bubbleH / 2 &&
            mouseY < bubbleY + bubbleH / 2
        ) {
            // 🌟 新增：點擊貓咪時隨機改變顏色
            const newCatColorHex = random(catColorPalette);
            const newCatP5Color = color(newCatColorHex);
            catBodyColor = newCatP5Color;
            catBodyColor.setAlpha(230); // 保持半透明
            catStrokeColor = lerpColor(newCatP5Color, color(255), 0.3); // 🌟 邊框設為身體的亮色，以在深色上突顯

            // 啟動動畫
            isTextAnimating = true;
            textAnimationStart = millis();
            textChangedDuringAnimation = false;
            // 同步觸發可愛互動效果：腮紅與點頭，與短暫口型動作
            blushing = true;
            blushStart = millis();

            headNod = true;
            headNodStart = millis();

            mouthTalking = true;
            mouthTalkStart = millis();
            // 自動在一段時間後關閉口型（以免長期持續）
            setTimeout(() => { mouthTalking = false; }, 1200);
        }
    }
}
