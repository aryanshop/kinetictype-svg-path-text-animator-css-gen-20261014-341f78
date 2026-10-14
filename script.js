document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const textInput = document.getElementById('text-input');
  const fontSizeInput = document.getElementById('font-size');
  const valFontSize = document.getElementById('val-font-size');
  const letterSpacingInput = document.getElementById('letter-spacing');
  const valSpacing = document.getElementById('val-spacing');
  const fontFamilySelect = document.getElementById('font-family');
  
  const pathPresetSelect = document.getElementById('path-preset');
  const curveDepthInput = document.getElementById('curve-depth');
  const valDepth = document.getElementById('val-depth');
  const curveSkewInput = document.getElementById('curve-skew');
  const valSkew = document.getElementById('val-skew');
  
  const animSpeedInput = document.getElementById('anim-speed');
  const valSpeed = document.getElementById('val-speed');
  const animDirectionSelect = document.getElementById('anim-direction');
  const textColorInput = document.getElementById('text-color');
  const showPathToggle = document.getElementById('show-path-toggle');
  
  const dynamicPath = document.getElementById('dynamic-path');
  const guidePath = document.getElementById('guide-path');
  const textPathRef = document.getElementById('text-path-ref');
  const stageWrapper = document.getElementById('stage-wrapper');
  
  // Handles
  const handleStart = document.getElementById('handle-start');
  const handleControl = document.getElementById('handle-control');
  const handleEnd = document.getElementById('handle-end');
  
  // Code export
  const codeSvg = document.querySelector('#code-svg code');
  const codeCss = document.querySelector('#code-css code');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const codePanes = document.querySelectorAll('.code-pane');
  const copyBtn = document.getElementById('copy-code-btn');

  // State variables for coordinates (viewBox 800 x 400)
  let state = {
    p1: { x: 50, y: 200 },
    cp: { x: 400, y: 150 },
    p2: { x: 750, y: 200 },
    text: 'Flowing along the digital curve ✨',
    fontSize: 28,
    spacing: 0,
    fontFamily: 'system-ui, sans-serif',
    speed: 5,
    direction: 'normal',
    color: '#6366f1',
    showPath: true,
    curveType: 'wave'
  };

  // Update SVG Path & Text rendering
  function updateGraphic() {
    // Build path string (Quadratic bezier)
    const pathString = `M ${state.p1.x} ${state.p1.y} Q ${state.cp.x} ${state.cp.y} ${state.p2.x} ${state.p2.y}`;
    dynamicPath.setAttribute('d', pathString);
    guidePath.setAttribute('d', pathString);
    guidePath.style.opacity = state.showPath ? '1' : '0';

    // Update text content & styling
    textPathRef.textContent = state.text || ' '; 
    
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--live-font-size', state.fontSize + 'px');
    rootStyle.setProperty('--live-spacing', state.spacing + 'px');
    rootStyle.setProperty('--live-color', state.color);
    rootStyle.setProperty('--live-font', state.fontFamily);

    // Position DOM Handles relative to stage wrapper dimensions
    positionHandle(handleStart, state.p1);
    positionHandle(handleControl, state.cp);
    positionHandle(handleEnd, state.p2);

    // Generate Code Snippets
    updateCodeSnippets(pathString);
  }

  function positionHandle(handleElem, pt) {
    const rect = stageWrapper.getBoundingClientRect();
    // Map SVG coordinates (0-800, 0-400) to pixel positions
    const pxX = (pt.x / 800) * rect.width;
    const pxY = (pt.y / 400) * rect.height;
    handleElem.style.left = pxX + 'px';
    handleElem.style.top = pxY + 'px';
  }

  function updateCodeSnippets(pathStr) {
    const svgCodeSnippet = `<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="curve" d="${pathStr}" />
  </defs>
  <style>
    textPath {
      font-size: ${state.fontSize}px;
      fill: ${state.color};
      font-family: ${state.fontFamily};
      letter-spacing: ${state.spacing}px;
      animation: flow ${state.speed}s linear infinite ${state.direction};
    }
    @keyframes flow {
      0% { startOffset: 0%; }
      100% { startOffset: 100%; }
    }
  </style>
  <text>
    <textPath href="#curve" startOffset="0%">${escapeHtml(state.text)}</textPath>
  </text>
</svg>`;

    const cssCodeSnippet = `@keyframes textFlow {
  0% { startOffset: 0%; }
  100% { startOffset: 100%; }
}

textPath {
  animation: textFlow ${state.speed}s linear infinite ${state.direction};
  font-size: ${state.fontSize}px;
  fill: ${state.color};
  letter-spacing: ${state.spacing}px;
  font-family: ${state.fontFamily};
}`;

    codeSvg.textContent = svgCodeSnippet;
    codeCss.textContent = cssCodeSnippet;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Event Listeners for UI Controls
  textInput.addEventListener('input', (e) => {
    state.text = e.target.value;
    updateGraphic();
  });

  fontSizeInput.addEventListener('input', (e) => {
    state.fontSize = parseInt(e.target.value);
    valFontSize.textContent = state.fontSize;
    updateGraphic();
  });

  letterSpacingInput.addEventListener('input', (e) => {
    state.spacing = parseInt(e.target.value);
    valSpacing.textContent = state.spacing;
    updateGraphic();
  });

  fontFamilySelect.addEventListener('change', (e) => {
    state.fontFamily = e.target.value;
    updateGraphic();
  });

  curveDepthInput.addEventListener('input', (e) => {
    const depth = parseInt(e.target.value);
    valDepth.textContent = depth;
    // Adjust control point y based on depth
    const skewFactor = parseInt(curveSkewInput.value) / 100;
    state.cp.y = 200 + depth;
    state.cp.x = 50 + (750 - 50) * skewFactor;
    updateGraphic();
  });

  curveSkewInput.addEventListener('input', (e) => {
    const skew = parseInt(e.target.value);
    valSkew.textContent = skew;
    const skewFactor = skew / 100;
    state.cp.x = 50 + (750 - 50) * skewFactor;
    updateGraphic();
  });

  pathPresetSelect.addEventListener('change', (e) => {
    const preset = e.target.value;
    state.curveType = preset;
    if (preset === 'wave') {
      state.p1 = { x: 50, y: 250 };
      state.cp = { x: 400, y: 100 };
      state.p2 = { x: 750, y: 250 };
      curveDepthInput.value = -100;
      valDepth.textContent = -100;
      curveSkewInput.value = 50;
      valSkew.textContent = 50;
    } else if (preset === 'arch') {
      state.p1 = { x: 80, y: 300 };
      state.cp = { x: 400, y: 80 };
      state.p2 = { x: 720, y: 300 };
      curveDepthInput.value = -120;
      valDepth.textContent = -120;
      curveSkewInput.value = 50;
      valSkew.textContent = 50;
    } else if (preset === 'loop') {
      state.p1 = { x: 50, y: 120 };
      state.cp = { x: 400, y: 320 };
      state.p2 = { x: 750, y: 120 };
      curveDepthInput.value = 120;
      valDepth.textContent = 120;
      curveSkewInput.value = 50;
      valSkew.textContent = 50;
    } else if (preset === 'flat') {
      state.p1 = { x: 50, y: 200 };
      state.cp = { x: 400, y: 200 };
      state.p2 = { x: 750, y: 200 };
      curveDepthInput.value = 0;
      valDepth.textContent = 0;
      curveSkewInput.value = 50;
      valSkew.textContent = 50;
    }
    updateGraphic();
  });

  animSpeedInput.addEventListener('input', (e) => {
    state.speed = e.target.value;
    valSpeed.textContent = state.speed;
    applyTextAnimation();
    updateGraphic();
  });

  animDirectionSelect.addEventListener('change', (e) => {
    state.direction = e.target.value;
    applyTextAnimation();
    updateGraphic();
  });

  textColorInput.addEventListener('input', (e) => {
    state.color = e.target.value;
    updateGraphic();
  });

  showPathToggle.addEventListener('change', (e) => {
    state.showPath = e.target.checked;
    updateGraphic();
  });

  function applyTextAnimation() {
    textPathRef.style.animation = `textFlow ${state.speed}s linear infinite ${state.direction}`;
  }

  // Inject keyframe style for live animation preview
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes textFlow {
      0% { startOffset: 0%; }
      100% { startOffset: 100%; }
    }
  `;
  document.head.appendChild(styleSheet);
  applyTextAnimation();

  // Dragging interaction for handles
  let activeHandle = null;

  function initDrag(handle, pointKey) {
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      activeHandle = pointKey;
    });
    handle.addEventListener('touchstart', (e) => {
      e.preventDefault();
      activeHandle = pointKey;
    });
  }

  initDrag(handleStart, 'p1');
  initDrag(handleControl, 'cp');
  initDrag(handleEnd, 'p2');

  window.addEventListener('mousemove', (e) => {
    if (!activeHandle) return;
    const rect = stageWrapper.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Calculate relative position within SVG viewBox (800x400)
    let x = ((clientX - rect.left) / rect.width) * 800;
    let y = ((clientY - rect.top) / rect.height) * 400;

    // Clamp within bounds
    x = Math.max(0, Math.min(800, x));
    y = Math.max(0, Math.min(400, y));

    state[activeHandle].x = x;
    state[activeHandle].y = y;

    // If control point moves, update depth slider approximately
    if (activeHandle === 'cp') {
      curveDepthInput.value = Math.round(y - 200);
      valDepth.textContent = curveDepthInput.value;
      const skew = Math.round(((x - 50) / 700) * 100);
      curveSkewInput.value = Math.max(0, Math.min(100, skew));
      valSkew.textContent = curveSkewInput.value;
    }

    updateGraphic();
  });

  window.addEventListener('mouseup', () => {
    activeHandle = null;
  });

  window.addEventListener('touchend', () => {
    activeHandle = null;
  });

  window.addEventListener('touchmove', (e) => {
    if (!activeHandle || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = stageWrapper.getBoundingClientRect();

    let x = ((touch.clientX - rect.left) / rect.width) * 800;
    let y = ((touch.clientY - rect.top) / rect.height) * 400;

    x = Math.max(0, Math.min(800, x));
    y = Math.max(0, Math.min(400, y));

    state[activeHandle].x = x;
    state[activeHandle].y = y;
    updateGraphic();
  });

  // Tab switching for code output
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      codePanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target).classList.add('active');
    });
  });

  // Copy code button
  copyBtn.addEventListener('click', () => {
    const activePane = document.querySelector('.code-pane.active code');
    if (activePane) {
      navigator.clipboard.writeText(activePane.textContent).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!` ;
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      });
    }
  });

  // Initial render on load
  window.addEventListener('resize', updateGraphic);
  updateGraphic();
});
