const allCountries = [
    { code: "966", flag: "🇸🇦", name: "السعودية" },
    { code: "971", flag: "🇦🇪", name: "الإمارات" },
    { code: "965", flag: "🇰🇼", name: "الكويت" },
    { code: "974", flag: "🇶🇦", name: "قطر" },
    { code: "973", flag: "🇧🇭", name: "البحرين" },
    { code: "968", flag: "🇴🇲", name: "عمان" },
    { code: "20", flag: "🇪🇬", name: "مصر" },
    { code: "962", flag: "🇯🇴", name: "الأردن" },
    { code: "961", flag: "🇱🇧", name: "لبنان" },
    { code: "963", flag: "🇸🇾", name: "سوريا" },
    { code: "964", flag: "🇮🇶", name: "العراق" },
    { code: "970", flag: "🇵🇸", name: "فلسطين" },
    { code: "967", flag: "🇾🇪", name: "اليمن" },
    { code: "249", flag: "🇸🇩", name: "السودان" },
    { code: "212", flag: "🇲🇦", name: "المغرب" },
    { code: "213", flag: "🇩🇿", name: "الجزائر" },
    { code: "216", flag: "🇹🇳", name: "تونس" },
    { code: "218", flag: "🇱🇾", name: "ليبيا" },
    { code: "1", flag: "🇺🇸", name: "الولايات المتحدة" },
    { code: "1", flag: "🇨🇦", name: "كندا" },
    { code: "44", flag: "🇬🇧", name: "بريطانيا" },
    { code: "33", flag: "🇫🇷", name: "فرنسا" },
    { code: "49", flag: "🇩🇪", name: "ألمانيا" },
    { code: "39", flag: "🇮🇹", name: "إيطاليا" },
    { code: "34", flag: "🇪🇸", name: "إسبانيا" },
    { code: "90", flag: "🇹🇷", name: "تركيا" },
    { code: "98", flag: "🇮🇷", name: "إيران" },
    { code: "91", flag: "🇮🇳", name: "الهند" },
    { code: "92", flag: "🇵🇰", name: "باكستان" },
    { code: "86", flag: "🇨🇳", name: "الصين" },
    { code: "81", flag: "🇯🇵", name: "اليابان" },
    { code: "82", flag: "🇰🇷", name: "كوريا الجنوبية" },
    { code: "7", flag: "🇷🇺", name: "روسيا" },
    { code: "61", flag: "🇦🇺", name: "أستراليا" },
    { code: "55", flag: "🇧🇷", name: "البرازيل" },
    { code: "52", flag: "🇲🇽", name: "المكسيك" },
    { code: "27", flag: "🇿🇦", name: "جنوب أفريقيا" }
];

function getCountrySelectHTML(id, onChangeEvent) {
    let optionsHTML = allCountries.map(c => `<option value="${c.code}">${c.flag} +${c.code}</option>`).join('');
    return `
        <select id="${id}" onchange="${onChangeEvent}" class="country-select bg-gray-50 border border-gray-300 rounded-xl px-2 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-blue-600 cursor-pointer rtl:pr-8 rtl:pl-3" dir="ltr">
            ${optionsHTML}
        </select>
    `;
}

let appState = {
    step: 1,
    selectedType: 'website',
    typeName: 'موقع إلكتروني',
    contentValue: '',
    color: '#000000',
    bodyShape: 'square',
    eyeFrameShape: 'square',
    eyeDotShape: 'square',
    frameStyle: 'none',
    frameText: 'امسح الكود',
    logo: 'none',
    customLogoData: null,
    waPhone: '',
    waMsg: '',
    social: { links: [] },
    multilinks: { links: [] }, // تمت إضافة الحالة هنا لتجنب الأخطاء
    passwordProtected: false,
    password: '',
    schedule: { activation: 'now', expiry: 'none', limit: 'unlimited' },
    lastGeneratedSvg: ''
};

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    updatePreviewState();
});

function goToStep(stepNum) {
    appState.step = stepNum;
    
    document.getElementById('screen-1').classList.add('hidden');
    document.getElementById('screen-2').classList.add('hidden');
    document.getElementById('screen-3').classList.add('hidden');

    document.getElementById(`screen-${stepNum}`).classList.remove('hidden');

    for (let i = 1; i <= 3; i++) {
        const badge = document.getElementById(`step-badge-${i}`);
        const text = document.getElementById(`step-text-${i}`);
        
        if (i < stepNum) {
            badge.className = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-emerald-600 text-white transition-all shadow-md";
            if(text) text.className = "text-sm font-semibold text-emerald-600 hidden sm:inline";
        } else if (i === stepNum) {
            badge.className = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-blue-600 text-white transition-all shadow-md";
            if(text) text.className = "text-sm font-semibold text-blue-600 hidden sm:inline";
        } else {
            badge.className = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-gray-200 text-gray-600 transition-all";
            if(text) text.className = "text-sm font-medium text-gray-400 hidden sm:inline";
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectQRType(typeKey, typeName) {
    // تصفير جميع الحالات لمنع تداخل البيانات (تم تضمين multilinks هنا)
    appState.contentValue = '';
    appState.vcard = null;
    appState.social = { links: [] };
    appState.multilinks = { links: [] };
    appState.waPhone = '';
    appState.waMsg = '';
    
    appState.selectedType = typeKey;
    appState.typeName = typeName;
    document.getElementById('preview-type-badge').innerText = typeName;

    const titleEl = document.getElementById('content-screen-title');
    const fieldsEl = document.getElementById('content-form-fields');

    if (typeKey === 'website') {
        titleEl.innerText = "إدخال رابط موقعك الإلكتروني";
        fieldsEl.innerHTML = `
            <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">أدخل رابط موقعك <span class="text-red-500">*</span></label>
                <div class="relative">
                    <input type="url" id="input-url" value="${appState.contentValue}" placeholder="https://example.com" oninput="updateQRData()" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 text-left" dir="ltr">
                    <i data-lucide="globe" class="w-5 h-5 text-gray-400 absolute right-4 top-3.5"></i>
                </div>
            </div>
        `;
    } else if (typeKey === 'whatsapp') {
        titleEl.innerText = "إعداد رسالة واتساب";
        fieldsEl.innerHTML = `
            <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">رقم الهاتف <span class="text-red-500">*</span></label>
                <div class="flex gap-2 mb-3" dir="ltr">
                    ${getCountrySelectHTML('wa-country-code', 'updateWhatsAppContent()')}
                    <input type="text" id="input-wa-phone" value="${appState.waPhone || ''}" placeholder="500000000" oninput="updateWhatsAppContent()" class="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 text-left">
                </div>
                <label class="block text-sm font-bold text-gray-700 mb-1">الرسالة التلقائية (اختياري)</label>
                <textarea id="input-wa-msg" placeholder="مرحباً، أود الاستفسار عن..." oninput="updateWhatsAppContent()" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 h-24 resize-none">${appState.waMsg || ''}</textarea>
            </div>
        `;
    } else if (typeKey === 'social') {
        titleEl.innerText = "إضافة روابط وسائل التواصل الاجتماعي";
        
        const platforms = [
            { id: 'whatsapp', color: '#25D366', name: 'WhatsApp', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.086 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' },
            { id: 'telegram', color: '#0088cc', name: 'Telegram', path: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' },
            { id: 'facebook', color: '#1877F2', name: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
            { id: 'twitter', color: '#000000', name: 'X (Twitter)', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
            { id: 'instagram', color: '#E1306C', name: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
            { id: 'youtube', color: '#FF0000', name: 'YouTube', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
            { id: 'linkedin', color: '#0A66C2', name: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
            { id: 'tiktok', color: '#000000', name: 'TikTok', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
            { id: 'snapchat', color: '#FFFC00', name: 'Snapchat', path: 'M12.01 0C8.243.013 5.434 2.215 5.347 5.753c-.024.96.223 1.954.743 2.805-.333.155-.724.282-1.124.364-1.503.31-2.991.2-3.791-.122-.767-.308-.948-.79-.982-1.116-.011-.11.024-.229.07-.333.111-.25.32-.472.502-.676.115-.129.213-.244.24-.356.052-.213-.075-.46-.352-.682-.361-.29-.915-.42-1.53-.358-.874.086-1.564.558-1.884 1.286-.184.417-.187.975-.01 1.631.391 1.455 1.776 2.656 3.655 3.167 1.092.296 2.378.36 3.593.18 1.198.812 2.673 1.554 4.549 2.257.433.163.456.401.442.548-.035.344-.393.75-.928 1.054-1.025.584-2.607.729-3.351.782-.016.002-.033.004-.047.006-.576.082-.871.303-.984.74-.083.32-.013.684.225.922.316.315 1.018.423 2.159.333h.007c.288-.024.59-.05 1.002-.05 1.572 0 3.731.523 5.148 1.721.229.193.385.347.502.47.164.172.261.272.441.272s.278-.1.442-.271c.117-.123.273-.277.501-.47 1.417-1.198 3.576-1.721 5.148-1.721.412 0 .714.026 1.002.05h.007c1.141.09 1.843-.018 2.159-.333.238-.238.308-.602.225-.922-.113-.437-.408-.658-.984-.74-.014-.002-.031-.004-.047-.006-.744-.053-2.326-.198-3.351-.782-.535-.304-.893-.71-.928-1.054-.014-.147.009-.385.442-.548 1.876-.703 3.35-1.445 4.549-2.257 1.215.18 2.501.116 3.593-.18 1.879-.511 3.264-1.712 3.655-3.167.177-.656.174-1.214-.01-1.631-.32-.728-1.01-1.2-1.884-1.286-.615-.062-1.169.068-1.53.358-.277.222-.404.469-.352.682.027.112.125.227.24.356.182.204.391.426.502.676.046.104.081.223.07.333-.034.326-.215.808-.982 1.116-.8.322-2.288.432-3.791.122-.4-.082-.791-.209-1.124-.364.52-.851.767-1.845.743-2.805C18.576 2.215 15.767.013 12.01 0z' }
        ];

        let iconsHtml = platforms.map(p => `
            <button type="button" onclick="addSocialLink('${p.name}')" class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:shadow-md transition-all bg-white text-gray-700 hover:text-black" title="${p.name}">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="${p.color}"><path d="${p.path}"/></svg>
            </button>
        `).join('');

        fieldsEl.innerHTML = `
            <div class="space-y-6">
                <div class="mb-2 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
                    <i data-lucide="info" class="w-5 h-5 shrink-0 mt-0.5"></i>
                    <div>
                        <h5 class="font-bold">ملاحظة حول الرمز الثابت</h5>
                        <p class="text-xs mt-1">الرمز الثابت يطبع النصوص والروابط مباشرة بداخله، لضمان نجاح المسح يرجى عدم إضافة عدد كبير جداً من الروابط الطويلة.</p>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">العنوان <span class="text-red-500">*</span></label>
                    <input type="text" id="soc-title" placeholder="مثال: حساباتي الاجتماعية" oninput="updateSocialContent()" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600">
                </div>
                
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">وسائل التواصل الاجتماعي <span class="text-red-500">*</span></label>
                    <p class="text-xs text-gray-500 mb-3">اختر الأيقونات أدناه لإضافة قنواتك.</p>
                    <div class="flex flex-wrap gap-2.5">
                        ${iconsHtml}
                    </div>
                </div>

                <div id="social-links-wrapper" class="space-y-3"></div>

                <button type="button" onclick="addSocialLink('رابط مخصص')" class="w-full border border-gray-300 bg-white rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-50 font-bold text-sm text-gray-700 transition-all shadow-sm">
                    <i data-lucide="plus" class="w-4 h-4"></i> أضف رابطك الخاص
                </button>

                <div class="border-t border-gray-200 pt-4">
                    <h3 class="font-bold text-gray-800 text-sm flex items-center justify-between cursor-pointer select-none" onclick="toggleSection('soc-desc-sec')">
                        <span>إضافة وصف نصي (اختياري)</span>
                        <span class="text-xs text-gray-400 flex items-center gap-1">إظهار / إخفاء <i data-lucide="chevron-down" class="w-4 h-4"></i></span>
                    </h3>
                    <div id="soc-desc-sec" class="hidden pt-3">
                        <textarea id="soc-desc" placeholder="مثال: تواصل معي عبر الروابط التالية..." oninput="updateSocialContent()" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 h-24 resize-none"></textarea>
                    </div>
                </div>
            </div>
        `;
        
        appState.social.links = [];
        renderSocialLinks();
        updatePreviewState();

    } else if (typeKey === 'vcard') {
        titleEl.innerText = "إنشاء بطاقة أعمال رقمية (vCard)";
        fieldsEl.innerHTML = `
            <div class="space-y-6">
                <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-4">
                    <h3 class="font-bold text-gray-800 text-sm flex items-center justify-between">
                        <span>البيانات الشخصية</span>
                        <span class="text-xs text-blue-600 cursor-pointer select-none" onclick="toggleSection('sec-personal')">إخفاء</span>
                    </h3>
                    <div id="sec-personal" class="space-y-3 pt-2">
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل <span class="text-red-500">*</span></label>
                            <input type="text" id="v-name" value="${appState.vcard?.name || ''}" placeholder="مثال: أحمد محمد" oninput="updateVCard()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600">
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">المسمى الوظيفي</label>
                                <input type="text" id="v-job" value="${appState.vcard?.job || ''}" placeholder="مثال: مهندس برمجيات" oninput="updateVCard()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">البريد الشخصي</label>
                                <input type="email" id="v-email" value="${appState.vcard?.email || ''}" placeholder="name@example.com" oninput="updateVCard()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600" dir="ltr">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-4">
                    <h3 class="font-bold text-gray-800 text-sm flex items-center justify-between">
                        <span>إضافة بيانات التواصل</span>
                        <span class="text-xs text-blue-600 cursor-pointer select-none" onclick="toggleSection('sec-contact')">إخفاء</span>
                    </h3>
                    <div id="sec-contact" class="space-y-3 pt-2">
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">الهاتف</label>
                            <div class="flex gap-2" dir="ltr">
                                ${getCountrySelectHTML('v-phone-code', 'updateVCard()')}
                                <input type="text" id="v-phone" value="${appState.vcard?.phone || ''}" placeholder="500000000" oninput="updateVCard()" class="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">الجوال</label>
                            <div class="flex gap-2" dir="ltr">
                                ${getCountrySelectHTML('v-mobile-code', 'updateVCard()')}
                                <input type="text" id="v-mobile" value="${appState.vcard?.mobile || ''}" placeholder="500000000" oninput="updateVCard()" class="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">العمل</label>
                            <div class="flex gap-2" dir="ltr">
                                ${getCountrySelectHTML('v-work-code', 'updateVCard()')}
                                <input type="text" id="v-work" value="${appState.vcard?.work || ''}" placeholder="500000000" oninput="updateVCard()" class="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">الفاكس</label>
                            <div class="flex gap-2" dir="ltr">
                                ${getCountrySelectHTML('v-fax-code', 'updateVCard()')}
                                <input type="text" id="v-fax" value="${appState.vcard?.fax || ''}" placeholder="500000000" oninput="updateVCard()" class="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-4">
                    <h3 class="font-bold text-gray-800 text-sm flex items-center justify-between">
                        <span>إضافة بيانات الشركة</span>
                        <span class="text-xs text-blue-600 cursor-pointer select-none" onclick="toggleSection('sec-company')">إخفاء</span>
                    </h3>
                    <div id="sec-company" class="space-y-3 pt-2">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">الشركة</label>
                                <input type="text" id="v-company" value="${appState.vcard?.company || ''}" placeholder="مثال: شركة التقنية" oninput="updateVCard()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">المسمى الوظيفي بالشركة</label>
                                <input type="text" id="v-jobtitle" value="${appState.vcard?.jobtitle || ''}" placeholder="مثال: مدير مشروعات" oninput="updateVCard()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">الموقع الإلكتروني</label>
                                <input type="url" id="v-website" value="${appState.vcard?.website || ''}" placeholder="https://example.com" oninput="updateVCard()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600" dir="ltr">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">البريد الإلكتروني للشركة</label>
                                <input type="email" id="v-compemail" value="${appState.vcard?.compemail || ''}" placeholder="ahmed@example.com" oninput="updateVCard()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600" dir="ltr">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">الوصف</label>
                            <textarea id="v-desc" placeholder="نبذة تعريفية سريعة..." oninput="updateVCard()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 h-20 resize-none">${appState.vcard?.desc || ''}</textarea>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-4">
                    <h3 class="font-bold text-gray-800 text-sm flex items-center justify-between">
                        <span>إضافة العنوان</span>
                        <span class="text-xs text-blue-600 cursor-pointer select-none" onclick="toggleSection('sec-address')">إخفاء</span>
                    </h3>
                    <div id="sec-address" class="space-y-3 pt-2">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">الشارع</label>
                                <input type="text" id="v-street" value="${appState.vcard?.street || ''}" placeholder="123 شارع اليرموك" oninput="updateVCard()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">الرمز البريدي</label>
                                <input type="text" id="v-postal" value="${appState.vcard?.postal || ''}" placeholder="12345" oninput="updateVCard()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600" dir="ltr">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">المدينة</label>
                                <input type="text" id="v-city" value="${appState.vcard?.city || ''}" placeholder="الرياض" oninput="updateVCard()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">المنطقة</label>
                                <input type="text" id="v-state" value="${appState.vcard?.state || ''}" placeholder="الرياض" oninput="updateVCard()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (typeKey === 'wifi') {
        titleEl.innerText = "إدخال بيانات شبكة WiFi";
        fieldsEl.innerHTML = `
            <div class="space-y-5">
                <div>
                    <label class="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">
                        اسم شبكة الواي فاي <span class="text-red-500">*</span>
                    </label>
                    <input type="text" id="wifi-ssid" placeholder="MyWiFiNetwork" oninput="updateWiFiContent()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 transition-colors">
                </div>
                <div>
                    <label class="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">نوع أمان الشبكة</label>
                    <div class="relative">
                        <select id="wifi-type" onchange="updateWiFiContent()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 appearance-none cursor-pointer transition-colors" dir="rtl">
                            <option value="WPA">WPA/WPA2 (موصى به)</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">بدون أمان (مفتوحة)</option>
                        </select>
                        <i data-lucide="chevron-down" class="w-5 h-5 text-gray-400 absolute left-4 top-2.5 pointer-events-none"></i>
                    </div>
                </div>
                <div>
                    <label class="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">
                        كلمة مرور الشبكة <span id="wifi-pass-asterisk" class="text-red-500">*</span>
                    </label>
                    <input type="text" id="wifi-pass" placeholder="Password123" oninput="updateWiFiContent()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 transition-colors disabled:bg-gray-100 disabled:text-gray-400">
                </div>
                <div class="flex items-center justify-between border-t border-b border-gray-100 py-4 my-2">
                    <label class="flex items-center gap-1.5 text-sm font-bold text-gray-700">شبكة WiFi الخاصة بي مخفية</label>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="wifi-hidden" onchange="updateWiFiContent()" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600 shadow-sm"></div>
                    </label>
                </div>
                <div>
                    <label class="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">سمّ رمز QR الخاص بك</label>
                    <input type="text" id="wifi-name" placeholder="رمز QR للواي فاي" oninput="updateWiFiContent()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 transition-colors">
                </div>
            </div>
        `;
    } else if (typeKey === 'email') {        
        titleEl.innerText = "إعداد البريد الإلكتروني";
        fieldsEl.innerHTML = `
            <div class="space-y-3">
                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">البريد المستلم <span class="text-red-500">*</span></label>
                    <input type="email" id="mail-to" placeholder="contact@example.com" oninput="updateEmail()" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600" dir="ltr">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">موضوع الرسالة</label>
                    <input type="text" id="mail-subj" placeholder="استفسار بخصوص..." oninput="updateEmail()" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">نص الرسالة</label>
                    <textarea id="mail-body" placeholder="مرحباً، أود التواصل معك..." oninput="updateEmail()" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 h-20 resize-none"></textarea>
                </div>
            </div>
        `;
    } else if (typeKey === 'sms') {
        titleEl.innerText = "إعداد رسالتك النصية";
        fieldsEl.innerHTML = `
            <div class="space-y-5">
                <div>
                    <label class="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">الرقم <span class="text-red-500">*</span></label>
                    <div class="flex gap-2" dir="ltr">
                        ${getCountrySelectHTML('sms-country-code', 'updateSMS()')}
                        <input type="text" id="sms-phone" placeholder="500000000" oninput="updateSMS()" class="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 transition-colors text-left">
                    </div>
                </div>
                <div>
                    <label class="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">رسالة SMS معدّة مسبقاً</label>
                    <textarea id="sms-text" placeholder="اكتب رسالتك هنا..." oninput="updateSMS()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 h-24 resize-none transition-colors"></textarea>
                </div>
                <div>
                    <label class="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">اسم رمز QR الخاص بك</label>
                    <input type="text" id="sms-name" placeholder="رمز QR للرسائل النصية الخاص بي" oninput="updateSMS()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 transition-colors">
                </div>
            </div>
        `;
    } else if (typeKey === 'multilinks') {
        titleEl.innerText = "إضافة روابطك";
        
        const platforms = [
            { id: 'viber', color: '#7360F2', name: 'Viber', path: 'M22.028 16.488c-.688-1.04-1.78-1.583-2.905-1.528-.86.037-1.745.385-2.502 1.057-.206.182-.37.388-.5.58-.23.342-.293.447-.532.32-.424-.22-1.734-.954-3.167-2.385-1.433-1.433-2.166-2.744-2.387-3.168-.124-.24-.02-.303.32-.533.19-.13.398-.293.58-.5.67-.757 1.02-1.642 1.056-2.503.056-1.124-.486-2.215-1.526-2.903-1.018-.675-2.186-.97-3.21-.8-1.127.185-2.26 1.082-3.12 2.656C2.39 10.027 1.55 13.916 3.655 17.65c2.193 3.884 6.136 6.013 11.233 5.485 2.183-.227 4.076-1.157 5.25-2.518 1.488-1.71 1.957-3.345 1.89-4.133-.06-.717-1.106-1.92-2.128-2.628L22.028 16.488z' },
            { id: 'wechat', color: '#09B83E', name: 'WeChat', path: 'M17.065 10.74c.23-.004.453.013.673.045-1.066-4.636-5.836-7.85-10.747-6.246-3.298 1.082-5.748 4.004-6.398 7.373-.787 4.086 1.134 8.083 4.887 9.873 1.033.497 1.25.992.934 2.155-.078.29-.168.577-.247.873 1.42-.516 2.805-1.108 4.144-1.782.355-.178.697-.132 1.05.014a10.605 10.605 0 0 0 6.643.084c4.604-1.255 7.42-5.875 6.22-10.457-.853-3.26-3.692-5.704-6.994-6.19a9.605 9.605 0 0 0-.165 4.258z' },
            { id: 'telegram', color: '#0088cc', name: 'Telegram', path: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' },
            { id: 'pinterest', color: '#E60023', name: 'Pinterest', path: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.148 0 7.382 2.955 7.382 6.903 0 4.128-2.602 7.449-6.216 7.449-1.213 0-2.353-.63-2.742-1.373l-.746 2.842c-.27 1.028-1.002 2.316-1.492 3.104 1.144.352 2.355.542 3.606.542 6.621 0 11.988-5.367 11.988-11.987C24.005 5.367 18.638 0 12.017 0z' },
            { id: 'reddit', color: '#FF4500', name: 'Reddit', path: 'M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .883.175 1.188.465 1.218-.87 2.91-1.442 4.777-1.503l.904-4.234a.434.434 0 0 1 .52-.338l3.189.674c.15-.226.4-.366.654-.366zM7.34 11.954c-.672 0-1.218.547-1.218 1.219 0 .671.546 1.218 1.218 1.218.671 0 1.218-.547 1.218-1.218 0-.672-.547-1.219-1.218-1.219zm9.32 0c-.671 0-1.218.547-1.218 1.219 0 .671.546 1.218 1.218 1.218.672 0 1.218-.547 1.218-1.218 0-.672-.546-1.219-1.218-1.219zm-4.66 4.103c-1.232 0-2.316.326-2.92.835a.43.43 0 1 0 .553.659c.452-.38 1.343-.63 2.367-.63 1.023 0 1.914.25 2.366.63a.43.43 0 1 0 .554-.66c-.604-.509-1.688-.834-2.92-.834z' },
            { id: 'twitter', color: '#000000', name: 'X (Twitter)', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
            { id: 'linkedin', color: '#0A66C2', name: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
            { id: 'snapchat', color: '#FFFC00', name: 'Snapchat', path: 'M12.01 0C8.243.013 5.434 2.215 5.347 5.753c-.024.96.223 1.954.743 2.805-.333.155-.724.282-1.124.364-1.503.31-2.991.2-3.791-.122-.767-.308-.948-.79-.982-1.116-.011-.11.024-.229.07-.333.111-.25.32-.472.502-.676.115-.129.213-.244.24-.356.052-.213-.075-.46-.352-.682-.361-.29-.915-.42-1.53-.358-.874.086-1.564.558-1.884 1.286-.184.417-.187.975-.01 1.631.391 1.455 1.776 2.656 3.655 3.167 1.092.296 2.378.36 3.593.18 1.198.812 2.673 1.554 4.549 2.257.433.163.456.401.442.548-.035.344-.393.75-.928 1.054-1.025.584-2.607.729-3.351.782-.016.002-.033.004-.047.006-.576.082-.871.303-.984.74-.083.32-.013.684.225.922.316.315 1.018.423 2.159.333h.007c.288-.024.59-.05 1.002-.05 1.572 0 3.731.523 5.148 1.721.229.193.385.347.502.47.164.172.261.272.441.272s.278-.1.442-.271c.117-.123.273-.277.501-.47 1.417-1.198 3.576-1.721 5.148-1.721.412 0 .714.026 1.002.05h.007c1.141.09 1.843-.018 2.159-.333.238-.238.308-.602.225-.922-.113-.437-.408-.658-.984-.74-.014-.002-.031-.004-.047-.006-.744-.053-2.326-.198-3.351-.782-.535-.304-.893-.71-.928-1.054-.014-.147.009-.385.442-.548 1.876-.703 3.35-1.445 4.549-2.257 1.215.18 2.501.116 3.593-.18 1.879-.511 3.264-1.712 3.655-3.167.177-.656.174-1.214-.01-1.631-.32-.728-1.01-1.2-1.884-1.286-.615-.062-1.169.068-1.53.358-.277.222-.404.469-.352.682.027.112.125.227.24.356.182.204.391.426.502.676.046.104.081.223.07.333-.034.326-.215.808-.982 1.116-.8.322-2.288.432-3.791.122-.4-.082-.791-.209-1.124-.364.52-.851.767-1.845.743-2.805C18.576 2.215 15.767.013 12.01 0z' },
            { id: 'messenger', color: '#0084FF', name: 'Messenger', path: 'M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.056-3.26-5.963 3.26 6.559-6.963 3.13 3.259 5.888-3.259-6.558 6.963z' },
            { id: 'tiktok', color: '#000000', name: 'TikTok', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
            { id: 'youtube', color: '#FF0000', name: 'YouTube', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
            { id: 'instagram', color: '#E1306C', name: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
            { id: 'whatsapp', color: '#25D366', name: 'WhatsApp', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.086 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' },
            { id: 'facebook', color: '#1877F2', name: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' }
        ];

        let iconsHtml = platforms.map(p => `
            <button type="button" onclick="addMultiLink('${p.name}')" class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:shadow-md transition-all bg-white text-gray-700 hover:text-black" title="${p.name}">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="${p.color}"><path d="${p.path}"/></svg>
            </button>
        `).join('');

        fieldsEl.innerHTML = `
            <div class="space-y-6">
                <div class="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
                    <i data-lucide="info" class="w-5 h-5 shrink-0 mt-0.5"></i>
                    <div>
                        <h5 class="font-bold">تنبيه هام (لأن الرمز ثابت Static)</h5>
                        <p class="text-xs mt-1">خانات الصور أدناه مصممة للعرض فقط لتشبه تصميمك المطلوب. نظراً لأن الرمز ثابت، فإنه سيقوم بتجميع <strong class="font-bold">النصوص والروابط فقط</strong> حتى يظل الرمز قابلاً للمسح السريع ولا يتجاوز سعة الاستيعاب.</p>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">العنوان <span class="text-red-500">*</span></label>
                    <input type="text" id="ml-title" placeholder="مثال: نشاطي التجاري" oninput="updateMultiLinksContent()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600">
                </div>
                
                <div class="pt-2">
                    <h3 class="font-bold text-gray-900 text-sm mb-3">قائمة الروابط</h3>
                    <div id="ml-links-wrapper" class="space-y-4"></div>
                    <div class="flex justify-end mt-4">
                        <button type="button" onclick="addMultiLink('')" class="flex items-center gap-2 border border-gray-300 bg-white rounded-full px-5 py-2.5 hover:bg-gray-50 font-bold text-sm text-gray-700 transition-all shadow-sm">
                            <i data-lucide="plus" class="w-4 h-4"></i> إضافة رابط آخر
                        </button>
                    </div>
                </div>

                <div class="border-t border-gray-200 pt-4">
                    <h3 class="font-bold text-gray-800 text-sm flex items-center justify-between cursor-pointer select-none" onclick="toggleSection('ml-sec-social')">
                        <span>إضافة وسائل التواصل</span>
                        <span class="text-xs text-gray-400 flex items-center gap-1">إخفاء <i data-lucide="chevron-up" class="w-4 h-4"></i></span>
                    </h3>
                    <div id="ml-sec-social" class="pt-4">
                        <p class="text-xs text-gray-500 mb-4">اختر الأيقونات أدناه لإضافة قنواتك على وسائل التواصل.</p>
                        <div class="flex flex-wrap gap-2.5">
                            ${iconsHtml}
                        </div>
                    </div>
                </div>

                <div class="border-t border-gray-200 pt-4">
                    <h3 class="font-bold text-gray-800 text-sm flex items-center justify-between cursor-pointer select-none" onclick="toggleSection('ml-sec-desc')">
                        <span>إضافة وصف</span>
                        <span class="text-xs text-gray-400 flex items-center gap-1">إخفاء <i data-lucide="chevron-up" class="w-4 h-4"></i></span>
                    </h3>
                    <div id="ml-sec-desc" class="pt-4">
                        <textarea id="ml-desc" placeholder="مثال: عن نشاطي التجاري..." oninput="updateMultiLinksContent()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 h-24 resize-none"></textarea>
                    </div>
                </div>

                <div class="border-t border-gray-200 pt-4">
                    <h3 class="font-bold text-gray-800 text-sm flex items-center justify-between cursor-pointer select-none" onclick="toggleSection('ml-sec-image')">
                        <span>إضافة صورة</span>
                        <span class="text-xs text-gray-400 flex items-center gap-1">إخفاء <i data-lucide="chevron-up" class="w-4 h-4"></i></span>
                    </h3>
                    <div id="ml-sec-image" class="pt-4">
                        <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 cursor-pointer hover:border-blue-500 transition-colors">
                            <i data-lucide="upload" class="w-6 h-6 mx-auto mb-2 text-gray-400"></i>
                            <p class="text-sm font-bold text-gray-700">يمكن تحميل صورة بالنقر هنا أو بالسحب والإفلات</p>
                            <p class="text-xs text-gray-400 mt-1">الحد الأقصى: 5 م.ب • PNG, JPG, JPEG, إلخ.</p>
                        </div>
                    </div>
                </div>

                <div class="border-t border-gray-200 pt-4">
                    <h3 class="font-bold text-gray-800 text-sm flex items-center justify-between cursor-pointer select-none" onclick="toggleSection('ml-sec-logo')">
                        <span>إضافة شعار</span>
                        <span class="text-xs text-gray-400 flex items-center gap-1">إخفاء <i data-lucide="chevron-up" class="w-4 h-4"></i></span>
                    </h3>
                    <div id="ml-sec-logo" class="pt-4">
                        <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 cursor-pointer hover:border-blue-500 transition-colors">
                            <i data-lucide="upload" class="w-6 h-6 mx-auto mb-2 text-gray-400"></i>
                            <p class="text-sm font-bold text-gray-700">يمكن تحميل الشعار بالنقر هنا أو بالسحب والإفلات</p>
                            <p class="text-xs text-gray-400 mt-1">الحد الأقصى: 5 م.ب • PNG, JPG, JPEG, إلخ.</p>
                        </div>
                    </div>
                </div>

                <div class="border-t border-gray-200 pt-4">
                    <label class="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">اسم رمز QR الخاص بك <i data-lucide="info" class="w-4 h-4 text-gray-400"></i></label>
                    <input type="text" id="ml-qr-name" placeholder="رمز الروابط المتعددة الخاص بي" oninput="updateMultiLinksContent()" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600">
                </div>
            </div>
        `;
        
        appState.multilinks = { links: [] };
        addMultiLink('');
        updatePreviewState();
    } else {
        titleEl.innerText = `إنشاء محتوى لـ: ${typeName}`;
        fieldsEl.innerHTML = `
            <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">الرابط أو البيانات <span class="text-red-500">*</span></label>
                <input type="text" id="input-generic" value="${appState.contentValue}" placeholder="أدخل الرابط أو التفاصيل هنا..." oninput="updateQRData()" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600">
            </div>
        `;
    }
    lucide.createIcons();
    goToStep(2);
}

function addSocialLink(platform) {
    const id = Date.now().toString();
    let defaultName = '';
    if (platform !== 'custom') {
        defaultName = platform.charAt(0).toUpperCase() + platform.slice(1);
    }
    appState.social.links.push({
        id: id,
        platform: platform,
        name: defaultName,
        url: ''
    });
    renderSocialLinks();
}

function removeSocialLink(id) {
    appState.social.links = appState.social.links.filter(l => l.id !== id);
    renderSocialLinks();
}

function updateSocialLinkData(id, field, value) {
    const link = appState.social.links.find(l => l.id === id);
    if (link) {
        link[field] = value;
        updateSocialContent();
    }
}

function renderSocialLinks() {
    const wrapper = document.getElementById('social-links-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = appState.social.links.map((link, index) => `
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 relative shadow-sm">
            <div class="absolute top-3 right-3 bg-gray-200 text-gray-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">${index + 1}</div>
            
            <div class="flex items-center gap-3 mt-2">
                <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">اسم المنصة</label>
                        <input type="text" value="${link.name}" oninput="updateSocialLinkData('${link.id}', 'name', this.value)" placeholder="مثال: Facebook" class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-600">
                    </div>
                    <div dir="ltr">
                        <label class="block text-xs font-bold text-gray-700 mb-1 text-right" dir="rtl">الرابط (URL)</label>
                        <input type="url" value="${link.url}" oninput="updateSocialLinkData('${link.id}', 'url', this.value)" placeholder="https://" class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-600 text-left">
                    </div>
                </div>
                <button type="button" onclick="removeSocialLink('${link.id}')" class="mt-4 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-2 shadow-sm border border-gray-100">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
    updateSocialContent();
}

function updateSocialContent() {
    const title = document.getElementById('soc-title')?.value || '';
    const desc = document.getElementById('soc-desc')?.value || '';
    
    let contentParts = [];
    
    if(title) contentParts.push(title);
    if(desc) contentParts.push(desc);
    
    if (appState.social.links.length > 0) {
        if (title || desc) contentParts.push("----------------");
        
        appState.social.links.forEach(l => {
            if (l.name || l.url) {
                contentParts.push(`${l.name}: ${l.url}`);
            }
        });
    }

    appState.contentValue = contentParts.join('\n').trim();
    document.getElementById('preview-info-text').innerText = title ? `الروابط: ${title}` : "لم يتم إدخال محتوى بعد";
    updatePreviewState();
}

function updateVCard() {
    // تم تفريغ القيم الافتراضية لمنع طباعة بيانات وهمية إذا تركها المستخدم فارغة
    const name = document.getElementById('v-name')?.value.trim() || '';
    const job = document.getElementById('v-job')?.value.trim() || '';
    
    const phoneCode = document.getElementById('v-phone-code')?.value || '966';
    const phoneInput = document.getElementById('v-phone')?.value.trim() || '';
    const phone = phoneInput ? `+${phoneCode}${phoneInput}` : '';

    const mobileCode = document.getElementById('v-mobile-code')?.value || '966';
    const mobileInput = document.getElementById('v-mobile')?.value.trim() || '';
    const mobile = mobileInput ? `+${mobileCode}${mobileInput}` : '';

    const workCode = document.getElementById('v-work-code')?.value || '966';
    const workInput = document.getElementById('v-work')?.value.trim() || '';
    const work = workInput ? `+${workCode}${workInput}` : '';

    const faxCode = document.getElementById('v-fax-code')?.value || '966';
    const faxInput = document.getElementById('v-fax')?.value.trim() || '';
    const fax = faxInput ? `+${faxCode}${faxInput}` : '';

    const email = document.getElementById('v-email')?.value.trim() || '';
    const company = document.getElementById('v-company')?.value.trim() || '';
    const jobtitle = document.getElementById('v-jobtitle')?.value.trim() || '';
    const website = document.getElementById('v-website')?.value.trim() || '';
    const compemail = document.getElementById('v-compemail')?.value.trim() || '';
    const desc = document.getElementById('v-desc')?.value.trim() || '';
    
    const street = document.getElementById('v-street')?.value.trim() || '';
    const postal = document.getElementById('v-postal')?.value.trim() || '';
    const city = document.getElementById('v-city')?.value.trim() || '';
    const state = document.getElementById('v-state')?.value.trim() || '';

    appState.vcard = { name, job, phone: phoneInput, mobile: mobileInput, work: workInput, fax: faxInput, email, company, jobtitle, website, compemail, desc, street, postal, city, state };

    let vcardStr = `BEGIN:VCARD\nVERSION:3.0`;
    if(name) {
        vcardStr += `\nN;CHARSET=UTF-8:;${name};;;\nFN;CHARSET=UTF-8:${name}`;
    }
    
    if (jobtitle) {
        vcardStr += `\nTITLE;CHARSET=UTF-8:${jobtitle}`;
    } else if (job) {
        vcardStr += `\nTITLE;CHARSET=UTF-8:${job}`;
    }
    
    if (company) vcardStr += `\nORG;CHARSET=UTF-8:${company}`;
    
    if (phone) vcardStr += `\nTEL;TYPE=HOME,VOICE:${phone}`;
    if (mobile) vcardStr += `\nTEL;TYPE=CELL,VOICE:${mobile}`;
    if (work) vcardStr += `\nTEL;TYPE=WORK,VOICE:${work}`;
    if (fax) vcardStr += `\nTEL;TYPE=FAX:${fax}`;
    
    if (email) vcardStr += `\nEMAIL;TYPE=HOME,INTERNET:${email}`;
    if (compemail) vcardStr += `\nEMAIL;TYPE=WORK,INTERNET:${compemail}`;
    
    if (website) vcardStr += `\nURL:${website}`;
    if (desc) vcardStr += `\nNOTE;CHARSET=UTF-8:${desc}`;
    
    if (street || city || state || postal) {
        vcardStr += `\nADR;TYPE=WORK;CHARSET=UTF-8:;;${street};${city};${state};${postal};`;
    }
    
    vcardStr += `\nEND:VCARD`;

    // إذا لم يكتب المستخدم شيئاً، لا تولد الكود
    if (!name && !job && !company && !phone && !mobile && !email && !website) {
        appState.contentValue = '';
    } else {
        appState.contentValue = vcardStr;
    }
    
    document.getElementById('preview-info-text').innerText = name ? `بطاقة: ${name}` : "لم يتم إدخال محتوى بعد";
    updatePreviewState();
}

function toggleSection(secId) {
    const el = document.getElementById(secId);
    if (el) {
        el.classList.toggle('hidden');
    }
}

function updateEmail() {
    const to = document.getElementById('mail-to')?.value || '';
    const subj = document.getElementById('mail-subj')?.value || '';
    const body = document.getElementById('mail-body')?.value || '';
    appState.contentValue = `mailto:${to}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    document.getElementById('preview-info-text').innerText = to || "لم يتم إدخال محتوى بعد";
    updatePreviewState();
}

function updateWiFiContent() {
    const ssid = document.getElementById('wifi-ssid')?.value || '';
    const type = document.getElementById('wifi-type')?.value || 'WPA';
    const pass = document.getElementById('wifi-pass')?.value || '';
    const hidden = document.getElementById('wifi-hidden')?.checked ? 'true' : 'false';
    const name = document.getElementById('wifi-name')?.value || '';

    const passInput = document.getElementById('wifi-pass');
    const passAsterisk = document.getElementById('wifi-pass-asterisk');
    if (type === 'nopass') {
        if (passInput) {
            passInput.disabled = true;
            passInput.value = '';
        }
        if (passAsterisk) passAsterisk.classList.add('hidden');
    } else {
        if (passInput) passInput.disabled = false;
        if (passAsterisk) passAsterisk.classList.remove('hidden');
    }

    if (ssid) {
        let qrString = `WIFI:S:${ssid};T:${type};`;
        if (type !== 'nopass') {
            qrString += `P:${pass};`;
        }
        qrString += `H:${hidden};;`;
        
        appState.contentValue = qrString;
    } else {
        appState.contentValue = '';
    }

    document.getElementById('preview-info-text').innerText = name ? name : (ssid ? `WiFi: ${ssid}` : "لم يتم إدخال محتوى بعد");
    updatePreviewState();
}

function updateSMS() {
    const countryCode = document.getElementById('sms-country-code')?.value || '966';
    let phone = document.getElementById('sms-phone')?.value || '';
    const text = document.getElementById('sms-text')?.value || '';
    const name = document.getElementById('sms-name')?.value || '';

    phone = phone.replace(/[^0-9]/g, '');

    if (phone) {
        const fullPhone = `+${countryCode}${phone}`;
        if (text) {
            appState.contentValue = `sms:${fullPhone}?body=${encodeURIComponent(text)}`;
        } else {
            appState.contentValue = `sms:${fullPhone}`;
        }
    } else {
        appState.contentValue = '';
    }

    document.getElementById('preview-info-text').innerText = name ? name : (phone ? `SMS: +${countryCode}${phone}` : "لم يتم إدخال محتوى بعد");
    updatePreviewState();
}

function updateWhatsAppContent() {
    const codeEl = document.getElementById('wa-country-code');
    const phoneEl = document.getElementById('input-wa-phone');
    const msgEl = document.getElementById('input-wa-msg');
    
    if (phoneEl && codeEl) {
        const countryCode = codeEl.value;
        appState.waPhone = phoneEl.value.trim();
        appState.waMsg = msgEl ? msgEl.value : '';
        
        let cleanPhone = appState.waPhone.replace(/[^0-9]/g, '');
        if (cleanPhone) {
            appState.contentValue = `https://wa.me/${countryCode}${cleanPhone}${appState.waMsg ? '?text=' + encodeURIComponent(appState.waMsg) : ''}`;
        } else {
            appState.contentValue = '';
        }
        document.getElementById('preview-info-text').innerText = appState.contentValue || "لم يتم إدخال محتوى بعد";
        updatePreviewState();
    }
}

function updateQRData() {
    const inputEl = document.querySelector('#content-form-fields input');
    if (inputEl && appState.selectedType !== 'whatsapp' && appState.selectedType !== 'social') {
        let val = inputEl.value.trim();
        if (appState.selectedType === 'website' && val && !val.startsWith('http://') && !val.startsWith('https://')) {
            val = 'https://' + val;
        }
        appState.contentValue = val;
        document.getElementById('preview-info-text').innerText = appState.contentValue || "لم يتم إدخال محتوى بعد";
    }
    updatePreviewState();
}

function addMultiLink(prefilledName = '') {
    const id = Date.now().toString();
    appState.multilinks.links.push({
        id: id,
        name: prefilledName,
        url: ''
    });
    renderMultiLinks();
}

function removeMultiLink(id) {
    appState.multilinks.links = appState.multilinks.links.filter(l => l.id !== id);
    renderMultiLinks();
}

function updateMultiLinkData(id, field, value) {
    const link = appState.multilinks.links.find(l => l.id === id);
    if (link) {
        link[field] = value;
        updateMultiLinksContent();
    }
}

function renderMultiLinks() {
    const wrapper = document.getElementById('ml-links-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = appState.multilinks.links.map((link, index) => `
        <div class="bg-white border border-gray-200 rounded-xl p-5 relative shadow-sm">
            <div class="flex justify-between items-start mb-4">
                <button type="button" onclick="removeMultiLink('${link.id}')" class="text-gray-400 hover:text-red-500 transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
                <div class="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">${index + 1}</div>
            </div>

            <div class="mb-5">
                <p class="text-sm font-bold text-gray-800 text-right mb-2">أضف شعار رابطك</p>
                <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 bg-gray-50 transition-colors">
                    <i data-lucide="upload" class="w-5 h-5 mx-auto mb-1 text-gray-400"></i>
                    <p class="text-xs font-bold text-gray-700">يمكن تحميل صورة بالنقر هنا أو بالسحب والإفلات</p>
                    <p class="text-[10px] text-gray-400 mt-1">الحد الأقصى: 5 م.ب • PNG, JPG, JPEG</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div dir="ltr">
                    <label class="block text-xs font-bold text-gray-700 mb-1 text-right" dir="rtl">URL</label>
                    <input type="url" value="${link.url}" oninput="updateMultiLinkData('${link.id}', 'url', this.value)" placeholder="https://domain.com" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 text-left">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">الاسم</label>
                    <input type="text" value="${link.name}" oninput="updateMultiLinkData('${link.id}', 'name', this.value)" placeholder="مثال: حساباتي الاجتماعية" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600">
                </div>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
    updateMultiLinksContent();
}

function updateMultiLinksContent() {
    const title = document.getElementById('ml-title')?.value || '';
    const desc = document.getElementById('ml-desc')?.value || '';
    const qrName = document.getElementById('ml-qr-name')?.value || '';
    
    let contentParts = [];
    
    // إزالة الإيموجيز لمنع استهلاك مساحة الرمز
    if(title) contentParts.push(title);
    if(desc) contentParts.push(desc);
    
    if (appState.multilinks.links.length > 0) {
        if (title || desc) contentParts.push("--- الروابط ---");
        
        appState.multilinks.links.forEach(l => {
            if (l.name || l.url) {
                contentParts.push(`${l.name ? l.name + ': ' : ''}${l.url}`);
            }
        });
    }

    appState.contentValue = contentParts.join('\n').trim();
    document.getElementById('preview-info-text').innerText = qrName ? qrName : (title ? title : "لم يتم إدخال محتوى بعد");
    updatePreviewState();
}

function generateQRCanvas(text, size, color, bodyShape, eyeFrameShape, eyeDotShape, logo, customLogoData) {
    return new Promise((resolve) => {
        const tempDiv = document.createElement('div');
        let encodedText = text;
        try {
            encodedText = unescape(encodeURIComponent(text));
        } catch(e) {
            encodedText = text;
        }

        let qrInst;
        try {
            qrInst = new QRCode(tempDiv, {
                text: encodedText,
                width: size,
                height: size,
                colorDark: color,
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M 
            });
        } catch(err) {
            try {
                tempDiv.innerHTML = '';
                qrInst = new QRCode(tempDiv, {
                    text: encodedText,
                    width: size,
                    height: size,
                    colorDark: color,
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.L
                });
            } catch (err2) {
                resolve(null); 
                return;
            }
        }

        setTimeout(() => {
            const qrObj = qrInst._oQRCode;
            if (!qrObj || !qrObj.modules) {
                resolve(null);
                return;
            }

            const count = qrObj.moduleCount;
            const quietZoneModules = 2;
            const totalModules = count + quietZoneModules * 2;
            const cellSize = size / totalModules;
            
            // تم إضافة xlink هنا لتوافق أفضل مع برامج Illustrator
            let svgContent = `<svg width="${size}px" height="${size}px" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`;
            svgContent += `<rect width="100%" height="100%" fill="#FFFFFF"/>`;

            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = size;
            finalCanvas.height = size;
            const ctx = finalCanvas.getContext('2d');

            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, size, size);

            ctx.fillStyle = color;
            ctx.strokeStyle = color;

            function isEyeModule(r, c) {
                return (r < 7 && c < 7) || 
                       (r < 7 && c >= count - 7) || 
                       (r >= count - 7 && c < 7);
            }

            for (let r = 0; r < count; r++) {
                for (let c = 0; c < count; c++) {
                    if (qrObj.modules[r][c] && !isEyeModule(r, c)) {
                        const x = (c + quietZoneModules) * cellSize;
                        const y = (r + quietZoneModules) * cellSize;

                        ctx.beginPath();
                        if (bodyShape === 'dots') {
                            ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.42, 0, Math.PI * 2);
                            ctx.fill();
                            svgContent += `<circle cx="${x + cellSize / 2}" cy="${y + cellSize / 2}" r="${cellSize * 0.42}" fill="${color}"/>`;
                        } else if (bodyShape === 'rounded') {
                            ctx.roundRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, cellSize * 0.35);
                            ctx.fill();
                            svgContent += `<rect x="${x + 0.5}" y="${y + 0.5}" width="${cellSize - 1}" height="${cellSize - 1}" rx="${cellSize * 0.35}" fill="${color}"/>`;
                        } else if (bodyShape === 'classy') {
                            ctx.roundRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, [cellSize * 0.4, 0, cellSize * 0.4, 0]);
                            ctx.fill();
                            svgContent += `<rect x="${x + 0.5}" y="${y + 0.5}" width="${cellSize - 1}" height="${cellSize - 1}" rx="${cellSize * 0.4}" fill="${color}"/>`;
                        } else if (bodyShape === 'diamond') {
                            ctx.moveTo(x + cellSize / 2, y);
                            ctx.lineTo(x + cellSize, y + cellSize / 2);
                            ctx.lineTo(x + cellSize / 2, y + cellSize);
                            ctx.lineTo(x, y + cellSize / 2);
                            ctx.closePath();
                            ctx.fill();
                            svgContent += `<polygon points="${x + cellSize / 2},${y} ${x + cellSize},${y + cellSize / 2} ${x + cellSize / 2},${y + cellSize} ${x},${y + cellSize / 2}" fill="${color}"/>`;
                        } else if (bodyShape === 'sparkle') {
                            ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.28, 0, Math.PI * 2);
                            ctx.fill();
                            svgContent += `<circle cx="${x + cellSize / 2}" cy="${y + cellSize / 2}" r="${cellSize * 0.28}" fill="${color}"/>`;
                        } else {
                            ctx.fillRect(x, y, cellSize + 0.3, cellSize + 0.3);
                            svgContent += `<rect x="${x}" y="${y}" width="${cellSize + 0.3}" height="${cellSize + 0.3}" fill="${color}"/>`;
                        }
                    }
                }
            }

            const eyePositions = [
                { r: 0, c: 0 },
                { r: 0, c: count - 7 },
                { r: count - 7, c: 0 }
            ];

            eyePositions.forEach(pos => {
                const ex = (pos.c + quietZoneModules) * cellSize;
                const ey = (pos.r + quietZoneModules) * cellSize;
                const eyeSize = 7 * cellSize;

                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(ex - 1, ey - 1, eyeSize + 2, eyeSize + 2);
                svgContent += `<rect x="${ex - 1}" y="${ey - 1}" width="${eyeSize + 2}" height="${eyeSize + 2}" fill="#FFFFFF"/>`;

                ctx.fillStyle = color;
                ctx.lineWidth = cellSize * 0.95;
                ctx.beginPath();
                const halfPad = cellSize * 0.5;

                if (eyeFrameShape === 'circle') {
                    ctx.arc(ex + eyeSize / 2, ey + eyeSize / 2, eyeSize / 2 - halfPad, 0, Math.PI * 2);
                    ctx.stroke();
                    svgContent += `<circle cx="${ex + eyeSize / 2}" cy="${ey + eyeSize / 2}" r="${eyeSize / 2 - halfPad}" stroke="${color}" stroke-width="${cellSize * 0.95}" fill="none"/>`;
                } else if (eyeFrameShape === 'rounded') {
                    ctx.roundRect(ex + halfPad, ey + halfPad, eyeSize - cellSize, eyeSize - cellSize, cellSize * 1.8);
                    ctx.stroke();
                    svgContent += `<rect x="${ex + halfPad}" y="${ey + halfPad}" width="${eyeSize - cellSize}" height="${eyeSize - cellSize}" rx="${cellSize * 1.8}" stroke="${color}" stroke-width="${cellSize * 0.95}" fill="none"/>`;
                } else if (eyeFrameShape === 'leaf') {
                    ctx.roundRect(ex + halfPad, ey + halfPad, eyeSize - cellSize, eyeSize - cellSize, [cellSize * 2.2, 0, cellSize * 2.2, 0]);
                    ctx.stroke();
                    const R = cellSize * 2.2;
                    const w = eyeSize - cellSize;
                    const h = eyeSize - cellSize;
                    const xx = ex + halfPad;
                    const yy = ey + halfPad;
                    svgContent += `<path d="M ${xx+R} ${yy} L ${xx+w} ${yy} L ${xx+w} ${yy+h-R} A ${R} ${R} 0 0 1 ${xx+w-R} ${yy+h} L ${xx} ${yy+h} L ${xx} ${yy+R} A ${R} ${R} 0 0 1 ${xx+R} ${yy} Z" stroke="${color}" stroke-width="${cellSize * 0.95}" fill="none"/>`;
                } else {
                    ctx.strokeRect(ex + halfPad, ey + halfPad, eyeSize - cellSize, eyeSize - cellSize);
                    svgContent += `<rect x="${ex + halfPad}" y="${ey + halfPad}" width="${eyeSize - cellSize}" height="${eyeSize - cellSize}" stroke="${color}" stroke-width="${cellSize * 0.95}" fill="none"/>`;
                }

                const ix = ex + 2 * cellSize;
                const iy = ey + 2 * cellSize;
                const dotSize = 3 * cellSize;

                ctx.beginPath();
                if (eyeDotShape === 'circle') {
                    ctx.arc(ix + dotSize / 2, iy + dotSize / 2, dotSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                    svgContent += `<circle cx="${ix + dotSize / 2}" cy="${iy + dotSize / 2}" r="${dotSize / 2}" fill="${color}"/>`;
                } else if (eyeDotShape === 'rounded') {
                    ctx.roundRect(ix, iy, dotSize, dotSize, cellSize * 0.8);
                    ctx.fill();
                    svgContent += `<rect x="${ix}" y="${iy}" width="${dotSize}" height="${dotSize}" rx="${cellSize * 0.8}" fill="${color}"/>`;
                } else if (eyeDotShape === 'diamond') {
                    ctx.moveTo(ix + dotSize / 2, iy);
                    ctx.lineTo(ix + dotSize, iy + dotSize / 2);
                    ctx.lineTo(ix + dotSize / 2, iy + dotSize);
                    ctx.lineTo(ix, iy + dotSize / 2);
                    ctx.closePath();
                    ctx.fill();
                    svgContent += `<polygon points="${ix + dotSize / 2},${iy} ${ix + dotSize},${iy + dotSize / 2} ${ix + dotSize / 2},${iy + dotSize} ${ix},${iy + dotSize / 2}" fill="${color}"/>`;
                } else if (eyeDotShape === 'grid') {
                    const sub = dotSize / 2;
                    ctx.arc(ix + sub / 2, iy + sub / 2, sub * 0.38, 0, Math.PI * 2);
                    ctx.arc(ix + sub * 1.5, iy + sub / 2, sub * 0.38, 0, Math.PI * 2);
                    ctx.arc(ix + sub / 2, iy + sub * 1.5, sub * 0.38, 0, Math.PI * 2);
                    ctx.arc(ix + sub * 1.5, iy + sub * 1.5, sub * 0.38, 0, Math.PI * 2);
                    ctx.fill();
                    svgContent += `<circle cx="${ix + sub / 2}" cy="${iy + sub / 2}" r="${sub * 0.38}" fill="${color}"/>`;
                    svgContent += `<circle cx="${ix + sub * 1.5}" cy="${iy + sub / 2}" r="${sub * 0.38}" fill="${color}"/>`;
                    svgContent += `<circle cx="${ix + sub / 2}" cy="${iy + sub * 1.5}" r="${sub * 0.38}" fill="${color}"/>`;
                    svgContent += `<circle cx="${ix + sub * 1.5}" cy="${iy + sub * 1.5}" r="${sub * 0.38}" fill="${color}"/>`;
                } else {
                    ctx.fillRect(ix, iy, dotSize, dotSize);
                    svgContent += `<rect x="${ix}" y="${iy}" width="${dotSize}" height="${dotSize}" fill="${color}"/>`;
                }
            });

            function finish(finalSvg) {
                finalSvg += `</svg>`;
                resolve({ canvas: finalCanvas, svg: finalSvg });
            }

            if (customLogoData) {
                const img = new Image();
                img.onload = () => {
                    const logoSize = size * 0.22;
                    const lx = (size - logoSize) / 2;
                    const ly = (size - logoSize) / 2;

                    ctx.fillStyle = "#FFFFFF";
                    ctx.beginPath();
                    ctx.roundRect(lx - 6, ly - 6, logoSize + 12, logoSize + 12, 12);
                    ctx.fill();
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2.5;
                    ctx.stroke();

                    ctx.drawImage(img, lx, ly, logoSize, logoSize);
                    
                    svgContent += `<rect x="${lx-6}" y="${ly-6}" width="${logoSize+12}" height="${logoSize+12}" rx="12" fill="#FFFFFF" stroke="${color}" stroke-width="2.5"/>`;
                    // تم إضافة xlink:href هنا لحل مشكلة Illustrator
                    svgContent += `<image xlink:href="${customLogoData}" href="${customLogoData}" x="${lx}" y="${ly}" width="${logoSize}" height="${logoSize}"/>`;
                    
                    finish(svgContent);
                };
                img.src = customLogoData;
                return;
            } else if (logo && logo !== 'none') {
                const logoSize = size * 0.22;
                const lx = (size - logoSize) / 2;
                const ly = (size - logoSize) / 2;

                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.roundRect(lx - 6, ly - 6, logoSize + 12, logoSize + 12, 12);
                ctx.fill();
                ctx.strokeStyle = color;
                ctx.lineWidth = 2.5;
                ctx.stroke();

                ctx.fillStyle = color;
                ctx.font = `bold ${logoSize * 0.48}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                let symbol = '★';
                if (logo === 'whatsapp') symbol = '💬';
                else if (logo === 'globe') symbol = '🌐';
                else if (logo === 'facebook') symbol = 'f';
                else if (logo === 'instagram') symbol = '📷';
                else if (logo === 'youtube') symbol = '▶';
                else if (logo === 'linkedin') symbol = 'in';
                else if (logo === 'twitter') symbol = '𝕏';
                else if (logo === 'map-pin') symbol = '📍';
                else if (logo === 'mail') symbol = '✉';
                else if (logo === 'phone') symbol = '📞';
                else if (logo === 'apple') symbol = '🍎';
                else if (logo === 'heart') symbol = '❤️';

                ctx.fillText(symbol, lx + logoSize / 2, ly + logoSize / 2);
                
                svgContent += `<rect x="${lx-6}" y="${ly-6}" width="${logoSize+12}" height="${logoSize+12}" rx="12" fill="#FFFFFF" stroke="${color}" stroke-width="2.5"/>`;
                svgContent += `<text x="${lx + logoSize/2}" y="${ly + logoSize/2}" fill="${color}" font-family="sans-serif" font-size="${logoSize*0.48}px" font-weight="bold" text-anchor="middle" dominant-baseline="central">${symbol}</text>`;

                finish(svgContent);
            } else {
                finish(svgContent);
            }
        }, 10);
    });
}

async function updatePreviewState() {
    const container = document.getElementById('qr-code-output');
    const debugStatus = document.getElementById('debug-status');
    
    if (!appState.contentValue || appState.contentValue.trim() === "") {
        container.innerHTML = `
            <div id="empty-preview-state" class="text-center text-gray-400 text-sm p-4 flex flex-col items-center justify-center h-full w-full">
                <i data-lucide="scan" class="w-12 h-12 mx-auto mb-2 opacity-40"></i>
                أدخل المحتوى في الخطوة التالية لتوليد ومعاينة الرمز هنا
            </div>
        `;
        if(debugStatus) debugStatus.innerText = "جاهز للمسح والتوليد";
        lucide.createIcons();
        return;
    }

    container.innerHTML = `<div class="text-xs text-gray-400 animate-pulse flex items-center justify-center h-full w-full">جاري التوليد بالتصميم المخصص...</div>`;
    if(debugStatus) debugStatus.innerText = "جاري التحديث...";

    const result = await generateQRCanvas(
        appState.contentValue, 
        240, 
        appState.color, 
        appState.bodyShape,
        appState.eyeFrameShape,
        appState.eyeDotShape,
        appState.logo,
        appState.customLogoData
    );

    if (result && result.canvas) {
        appState.lastGeneratedSvg = result.svg;
        container.innerHTML = "";
        result.canvas.className = "w-full h-full object-contain rounded-lg shadow-sm";
        container.appendChild(result.canvas);
        if(debugStatus) debugStatus.innerText = "تم التوليد بنجاح وجاهز للمسح ✓";
    } else {
        container.innerHTML = `
            <div class="text-center text-red-500 text-sm p-4 font-bold flex flex-col items-center justify-center h-full w-full">
                <i data-lucide="alert-triangle" class="w-10 h-10 mb-2 opacity-50"></i>
                تعذر توليد الرمز. النص المُدخل طويل جداً.
            </div>
        `;
        if(debugStatus) debugStatus.innerText = "فشل التوليد - تجاوز الحد المسموح";
        lucide.createIcons();
    }
}

function switchTab(tabName) {
    ['customization', 'frame', 'logo', 'password', 'schedule'].forEach(t => {
        const contentEl = document.getElementById(`tab-content-${t}`);
        const btnEl = document.getElementById(`tab-btn-${t}`);
        if (contentEl) contentEl.classList.add('hidden');
        if (btnEl) btnEl.className = "bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-5 py-2.5 rounded-full font-bold shrink-0 transition-all";
    });
    const targetContent = document.getElementById(`tab-content-${tabName}`);
    const targetBtn = document.getElementById(`tab-btn-${tabName}`);
    if (targetContent) targetContent.classList.remove('hidden');
    if (targetBtn) targetBtn.className = "bg-gray-900 text-white text-xs px-5 py-2.5 rounded-full font-bold shrink-0 transition-all shadow-sm";
}

function setBodyShape(shape) {
    appState.bodyShape = shape;
    document.querySelectorAll('.body-shape-btn').forEach(b => {
        b.classList.remove('border-black', 'bg-gray-50', 'shadow-sm');
        b.classList.add('border-gray-200', 'bg-white');
    });
    const activeBtn = document.getElementById(`body-shape-${shape}`);
    if (activeBtn) {
        activeBtn.classList.remove('border-gray-200', 'bg-white');
        activeBtn.classList.add('border-black', 'bg-gray-50', 'shadow-sm');
    }
    updatePreviewState();
}

function setEyeFrameShape(shape) {
    appState.eyeFrameShape = shape;
    document.querySelectorAll('.eye-frame-btn').forEach(b => {
        b.classList.remove('border-black', 'bg-gray-50');
        b.classList.add('border-gray-200', 'bg-white');
    });
    const activeBtn = document.getElementById(`eye-frame-${shape}`);
    if (activeBtn) {
        activeBtn.classList.remove('border-gray-200', 'bg-white');
        activeBtn.classList.add('border-black', 'bg-gray-50');
    }
    updatePreviewState();
}

function setEyeDotShape(shape) {
    appState.eyeDotShape = shape;
    document.querySelectorAll('.eye-dot-btn').forEach(b => {
        b.classList.remove('border-black', 'bg-gray-50');
        b.classList.add('border-gray-200', 'bg-white');
    });
    const activeBtn = document.getElementById(`eye-dot-${shape}`);
    if (activeBtn) {
        activeBtn.classList.remove('border-gray-200', 'bg-white');
        activeBtn.classList.add('border-black', 'bg-gray-50');
    }
    updatePreviewState();
}

function updateQRColor(color) {
    appState.color = color;
    document.getElementById('qr-color-picker').value = color;
    document.getElementById('qr-color-text').value = color;
    updatePreviewState();
}

function setFrameStyle(style) {
    appState.frameStyle = style;
    ['none', 'scan-me', 'modern'].forEach(s => {
        const el = document.getElementById(`frame-opt-${s}`);
        if(el) {
            el.classList.remove('border-blue-600', 'bg-blue-50');
            el.classList.add('border-gray-200');
        }
    });
    const activeEl = document.getElementById(`frame-opt-${style}`);
    if(activeEl) {
        activeEl.classList.remove('border-gray-200');
        activeEl.classList.add('border-blue-600', 'bg-blue-50');
    }

    const wrapper = document.getElementById('qr-frame-wrapper');
    const textOutput = document.getElementById('frame-text-output');
    
    if (style === 'none') {
        wrapper.className = "w-full bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center shadow-inner transition-all";
        textOutput.classList.add('hidden');
    } else if (style === 'scan-me') {
        wrapper.className = "w-full bg-blue-600 border-4 border-blue-600 rounded-3xl p-5 flex flex-col items-center justify-center shadow-lg transition-all text-white";
        textOutput.classList.remove('hidden');
        textOutput.className = "mt-3 text-sm font-black text-white bg-blue-700 px-4 py-1.5 rounded-full";
    } else {
        wrapper.className = "w-full bg-gray-900 border-4 border-gray-900 rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg transition-all text-white";
        textOutput.classList.remove('hidden');
        textOutput.className = "mt-3 text-sm font-bold text-white";
    }
}

function updateFrameText(txt) {
    appState.frameText = txt;
    document.getElementById('frame-text-output').innerText = txt;
}

function setLogo(logoType) {
    appState.logo = logoType;
    appState.customLogoData = null;
    document.getElementById('uploaded-logo-preview').classList.add('hidden');

    document.querySelectorAll('#preset-logo-grid button').forEach(el => {
        el.classList.remove('ring-4', 'ring-blue-500', 'scale-105');
    });
    const activeEl = document.getElementById(`logo-opt-${logoType}`);
    if (activeEl) {
        activeEl.classList.add('ring-4', 'ring-blue-500', 'scale-105');
    }
    updatePreviewState();
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        appState.customLogoData = e.target.result;
        appState.logo = 'custom';
        document.getElementById('uploaded-logo-preview').classList.remove('hidden');
        updatePreviewState();
    };
    reader.readAsDataURL(file);
}

function removeCustomLogo() {
    appState.customLogoData = null;
    appState.logo = 'none';
    document.getElementById('custom-logo-file').value = '';
    document.getElementById('uploaded-logo-preview').classList.add('hidden');
    setLogo('none');
}

function togglePasswordInput(enabled) {
    appState.passwordProtected = enabled;
    const container = document.getElementById('pass-input-container');
    if (enabled) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
}

function selectScheduleOption(category, option) {
    appState.schedule[category] = option;

    if (category === 'activation') {
        const picker = document.getElementById('act-date-picker');
        if (option === 'date') picker.classList.remove('hidden');
        else picker.classList.add('hidden');
    } else if (category === 'expiry') {
        const picker = document.getElementById('exp-date-picker');
        if (option === 'date') picker.classList.remove('hidden');
        else picker.classList.add('hidden');
    } else if (category === 'limit') {
        const input = document.getElementById('scan-count-input');
        if (option === 'limited') input.classList.remove('hidden');
        else input.classList.add('hidden');
    }

    const parent = event.currentTarget.parentNode;
    parent.querySelectorAll('.schedule-card').forEach(card => {
        card.classList.remove('border-2', 'border-black');
        card.classList.add('border', 'border-gray-200');
    });
    event.currentTarget.classList.remove('border', 'border-gray-200');
    event.currentTarget.classList.add('border-2', 'border-black');
}

async function downloadQR(format) {
    if (!appState.contentValue || appState.contentValue.trim() === "") {
        const msgBox = document.createElement('div');
        msgBox.className = "fixed top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-bold z-50 flex items-center gap-2";
        msgBox.innerHTML = `<i data-lucide="alert-circle" class="w-5 h-5 text-amber-400"></i> الرجاء إدخال المحتوى أولاً قبل التنزيل`;
        document.body.appendChild(msgBox);
        lucide.createIcons();
        setTimeout(() => msgBox.remove(), 2500);
        goToStep(2);
        return;
    }

    const result = await generateQRCanvas(
        appState.contentValue, 
        1200, 
        appState.color, 
        appState.bodyShape,
        appState.eyeFrameShape,
        appState.eyeDotShape,
        appState.logo,
        appState.customLogoData
    );

    if (!result || !result.canvas) {
        alert('عذراً، فشل توليد الرمز عالي الدقة لأن المحتوى المُضاف طويل جداً.');
        return;
    }

    const highResCanvas = result.canvas;
    const highResSvg = result.svg;
    const link = document.createElement('a');

    if (format === 'png' || format === 'jpg') {
        link.download = `qr-code-studio-pro.${format}`;
        if (format === 'jpg') {
            const jpgCanvas = document.createElement('canvas');
            jpgCanvas.width = highResCanvas.width;
            jpgCanvas.height = highResCanvas.height;
            const ctx = jpgCanvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);
            ctx.drawImage(highResCanvas, 0, 0);
            link.href = jpgCanvas.toDataURL('image/jpeg', 1.0);
        } else {
            link.href = highResCanvas.toDataURL('image/png');
        }
        link.click();
    } else if (format === 'svg') {
        const blob = new Blob([highResSvg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'qr-code-illustrator.svg';
        link.click();
        URL.revokeObjectURL(url);
    }
}
