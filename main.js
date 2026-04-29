const canvas = document.getElementById('canvasContainer');
const mainImage = document.getElementById('mainImage');

const imageInput = document.getElementById('imageInput');
const addTagBtn = document.getElementById('addTagBtn');
const addRemarkBtn = document.getElementById('addRemarkBtn');

const originalInput = document.getElementById('originalPrice');
const saleInput = document.getElementById('salePrice');
const remarkInput = document.getElementById('remark');

// 上传图片
imageInput.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => mainImage.src = ev.target.result;
    reader.readAsDataURL(file);
};

// 添加价签
addTagBtn.onclick = () => {
    if (!originalInput.value && !saleInput.value) return;

    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.style.left = '50px';
    tag.style.top = '50px';

    const box = document.createElement('div');
    box.className = 'price-box';

    if (originalInput.value) {
        const op = document.createElement('div');
        op.innerText = '原价: ' + originalInput.value;
        box.appendChild(op);
    }

    if (saleInput.value) {
        const sp = document.createElement('div');
        sp.innerText = '惊爆价: ' + saleInput.value;
        sp.style.fontSize = '20px';
        box.appendChild(sp);
    }

    tag.appendChild(box);

    addDeleteButton(tag);
    canvas.appendChild(tag);
    enableTransform(tag);
};

// 添加备注
addRemarkBtn.onclick = () => {
    if (!remarkInput.value) return;

    const el = document.createElement('div');
    el.className = 'remark';
    el.innerText = remarkInput.value;

    el.style.left = '50px';
    el.style.top = '120px';

    addDeleteButton(el);
    canvas.appendChild(el);
    enableTransform(el);
};

// ❌ 删除按钮
function addDeleteButton(el) {
    const btn = document.createElement('div');
    btn.innerText = '×';
    btn.style.position = 'absolute';
    btn.style.top = '0';
    btn.style.right = '0';
    btn.style.background = 'red';
    btn.style.color = '#fff';
    btn.style.width = '20px';
    btn.style.height = '20px';
    btn.style.textAlign = 'center';
    btn.style.lineHeight = '20px';
    btn.style.cursor = 'pointer';

    btn.onclick = () => el.remove();

    el.appendChild(btn);
}

// 拖拽 + 缩放（修复滑动冲突）
function enableTransform(el) {

    let startX, startY, startW, startH, startL, startT;
    let dragging = false;
    let resizing = false;

    const handle = document.createElement('div');
    handle.className = 'handle';
    el.appendChild(handle);

    el.addEventListener('touchstart', e => {
        if (e.target === handle) return;

        dragging = true;

        document.body.style.overflow = 'hidden'; // ❗禁止页面滚动

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        startL = el.offsetLeft;
        startT = el.offsetTop;
    });

    handle.addEventListener('touchstart', e => {
        e.stopPropagation();

        resizing = true;

        document.body.style.overflow = 'hidden'; // ❗禁止页面滚动

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        startW = el.offsetWidth;
        startH = el.offsetHeight;
    });

    document.addEventListener('touchmove', e => {

        if (dragging) {
            e.preventDefault(); // ❗关键：阻止页面滚动

            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;

            el.style.left = startL + dx + 'px';
            el.style.top = startT + dy + 'px';
        }

        if (resizing) {
            e.preventDefault();

            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;

            el.style.width = startW + dx + 'px';
            el.style.height = startH + dy + 'px';
        }

    }, { passive: false }); // ❗必须加

    document.addEventListener('touchend', () => {
        dragging = false;
        resizing = false;

        document.body.style.overflow = ''; // ✅恢复滚动
    });
}