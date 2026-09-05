// =========================================================
// UPI PAY — PAYMENT QR GENERATOR
//========================================================== 

//ELEMENTS
const paymentForm = document.getElementById('paymentForm');
const bizNameInput = document.getElementById('bizNameInput');
const upiIdInput = document.getElementById('upiIdInput');
const clientNameInput = document.getElementById('clientNameInput');
const amountInput = document.getElementById('amountInput');
const referenceInput = document.getElementById('referenceInput');
const noteInput = document.getElementById('noteInput');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const qrPlaceholder = document.getElementById('qrPlaceholder');
const qrContainer = document.getElementById('upiQrCode');
const qrBizName = document.getElementById('qrBizName');
const qrUpiId = document.getElementById('qrUpiId');
const qrClientName = document.getElementById('qrClientName');
const qrAmount = document.getElementById('qrAmount');
const qrReference = document.getElementById('qrReference');
const qrNote = document.getElementById('qrNote');
const referenceRow = document.getElementById('referenceRow');
const noteRow = document.getElementById('noteRow');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const printBtn = document.getElementById('printBtn');
const qrCount = document.getElementById('qrCount');
const totalAmount = document.getElementById('totalAmount');
const todayCount = document.getElementById('todayCount');
const historyBody = document.getElementById('historyBody');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const themeBtn = document.getElementById('themeBtn');
const currentYear = document.getElementById('currentYear');

//STORAGE KEYS
const STORAGE = {
    business: 'upiPayBusiness',
    history: 'upiPayHistory',
    theme: 'upiPayTheme'
};

//CURRENT QR DATA
let currentUPIData = '';
let currentQR = null;

//QR CODE GENERATOR
const QRCodeGenerator = (() => {
    function createUPIQR({
        upiId,
        name,
        amount,
        reference = '',
        note = ''
    }) {
        if (!upiId || !amount || Number(amount) <= 0) {
            return '';
        }

        const params = new URLSearchParams();

        params.set('pa', upiId.trim());
        params.set('pn', name?.trim() || 'Merchant');
        params.set('am', Number(amount).toFixed(2));
        params.set('cu', 'INR');

        const transactionNote =
            note?.trim() ||
            (reference ? `Reference ${reference.trim()}` : '');

        if (transactionNote) {
            params.set('tn', transactionNote);
        }

        if (reference?.trim()) {
            params.set('tr', reference.trim());
        }

        return `upi://pay?${params.toString()}`;
    }

    function renderQR(container, upiData) {
        if (!container || !upiData) {
            return null;
        }

        container.innerHTML = '';

        return new QRCode(container, {
            text: upiData,
            width: 250,
            height: 250,
            colorDark: '#111111',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });
    }

    return {
        createUPIQR,
        renderQR
    };
})();

//VALIDATE UPI ID
function isValidUPI(upiId) {
    const upiPattern = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9.-]{2,}$/;
    return upiPattern.test(upiId.trim());
}

//FORMAT CURRENCY
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(Number(amount));
}

//   GENERATE QR
function generateQR() {
    const businessName = bizNameInput.value.trim();
    const upiId = upiIdInput.value.trim();
    const clientName = clientNameInput.value.trim();
    const amount = Number(amountInput.value);
    const reference = referenceInput.value.trim();
    const note = noteInput.value.trim();

    if (!businessName) {
        showToast('Please enter your business name.');
        bizNameInput.focus();
        return false;
    }

    if (!upiId) {
        showToast('Please enter your UPI ID.');
        upiIdInput.focus();
        return false;
    }

    if (!isValidUPI(upiId)) {
        showToast('Please enter a valid UPI ID.');
        upiIdInput.focus();
        return false;
    }

    if (!clientName) {
        showToast('Please enter the client name.');
        clientNameInput.focus();
        return false;
    }

    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount.');
        amountInput.focus();
        return false;
    }

    if (amount > 10000000) {
        showToast('Amount cannot exceed ₹1 crore.');
        amountInput.focus();
        return false;
    }

    currentUPIData = QRCodeGenerator.createUPIQR({
        upiId,
        name: businessName,
        amount,
        reference,
        note
    });

    if (!currentUPIData) {
        showToast('Unable to create payment QR.');
        return false;
    }

    qrContainer.innerHTML = '';

    currentQR = QRCodeGenerator.renderQR(
        qrContainer,
        currentUPIData
    );

    qrPlaceholder.classList.add('hidden');
    qrContainer.classList.add('active');

    qrBizName.textContent = businessName;
    qrUpiId.textContent = upiId;
    qrClientName.textContent = clientName;
    qrAmount.textContent = formatCurrency(amount);

    if (reference) {
        qrReference.textContent = reference;
        referenceRow.style.display = 'flex';
    } else {
        referenceRow.style.display = 'none';
    }

    if (note) {
        qrNote.textContent = note;
        noteRow.style.display = 'flex';
    } else {
        noteRow.style.display = 'none';
    }

    downloadBtn.disabled = false;
    copyBtn.disabled = false;
    printBtn.disabled = false;

    saveBusinessData({
        businessName,
        upiId
    });

    savePaymentHistory({
        businessName,
        clientName,
        upiId,
        amount,
        reference,
        note
    });

    updateStats();
    showToast('Payment QR generated successfully!');

    return true;
}

//FORM SUBMIT
paymentForm.addEventListener('submit', event => {
    event.preventDefault();
    generateQR();
});

//QUICK AMOUNT BUTTONS
const quickAmountButtons = document.querySelectorAll('.quick-amounts button');

quickAmountButtons.forEach(button => {
    button.addEventListener('click', function () {
        amountInput.value = this.dataset.amount;

        quickAmountButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        this.classList.add('active');
        amountInput.focus();
    });
});

//RESET
resetBtn.addEventListener('click', () => {
    paymentForm.reset();

    quickAmountButtons.forEach(button => {
        button.classList.remove('active');
    });

    qrContainer.innerHTML = '';
    qrContainer.classList.remove('active');
    qrPlaceholder.classList.remove('hidden');

    qrBizName.textContent = 'Your Business Name';
    qrUpiId.textContent = 'yourupi@bank';
    qrAmount.textContent = '₹0.00';
    qrReference.textContent = '-';
    qrNote.textContent = '-';

    referenceRow.style.display = 'flex';
    noteRow.style.display = 'flex';

    currentUPIData = '';
    currentQR = null;

    downloadBtn.disabled = true;
    copyBtn.disabled = true;
    printBtn.disabled = true;

    showToast('Form has been reset.');
});

//COPY UPI PAYMENT LINK
copyBtn.addEventListener('click', async () => {
    if (!currentUPIData) {
        return;
    }

    try {
        await navigator.clipboard.writeText(currentUPIData);
        showToast('UPI payment link copied!');
    } catch (error) {
        const textarea = document.createElement('textarea');

        textarea.value = currentUPIData;
        document.body.appendChild(textarea);

        textarea.select();
        document.execCommand('copy');
        textarea.remove();

        showToast('UPI payment link copied!');
    }
});

//DOWNLOAD QR
downloadBtn.addEventListener('click', () => {
    if (!currentUPIData) {
        return;
    }

    const canvas = qrContainer.querySelector('canvas');

    if (!canvas) {
        showToast('QR code is not ready.');
        return;
    }

    const link = document.createElement('a');

    link.download = 'upi-payment-qr.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast('QR code downloaded.');
});

//PRINT QR
printBtn.addEventListener('click', () => {
    if (!currentUPIData) {
        return;
    }

    const canvas = qrContainer.querySelector('canvas');

    if (!canvas) {
        return;
    }

    const qrImage = canvas.toDataURL('image/png');

    const businessName = escapeHTML(
        bizNameInput.value.trim()
    );

    const upiId = escapeHTML(
        upiIdInput.value.trim()
    );

    const amount = formatCurrency(
        amountInput.value
    );

    const printWindow = window.open(
        '',
        '_blank',
        'width=600,height=800'
    );

    if (!printWindow) {
        showToast('Please allow pop-ups to print.');
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>UPI Payment QR</title>
            <style>
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 40px 20px;
                    font-family: Arial, sans-serif;
                    text-align: center;
                    color: #111;
                }

                .card {
                    max-width: 400px;
                    margin: auto;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    padding: 35px;
                }

                h1 {
                    font-size: 25px;
                    margin-bottom: 5px;
                }

                .upi {
                    color: #555;
                    margin-bottom: 25px;
                }

                img {
                    width: 280px;
                    height: 280px;
                    display: block;
                    margin: auto;
                }

                .amount {
                    margin-top: 25px;
                    font-size: 28px;
                    font-weight: bold;
                }

                .scan {
                    margin-top: 10px;
                    color: #777;
                    font-size: 13px;
                }

                @media print {
                    body {
                        padding: 0;
                    }

                    .card {
                        border: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>${businessName}</h1>
                <div class="upi">${upiId}</div>
                <img src="${qrImage}">
                <div class="amount">${amount}</div>
                <div class="scan">
                    Scan & Pay using UPI
                </div>
            </div>

            <script>
                window.onload = function() {
                    window.print();

                    window.onafterprint = function() {
                        window.close();
                    };
                };
            <\/script>
        </body>
        </html>
    `);

    printWindow.document.close();
});

//SAVE BUSINESS DATA
function saveBusinessData(data) {
    localStorage.setItem(
        STORAGE.business,
        JSON.stringify(data)
    );
}

//LOAD BUSINESS DATA
function loadBusinessData() {
    const saved = localStorage.getItem(STORAGE.business);

    if (!saved) {
        return;
    }

    try {
        const data = JSON.parse(saved);

        if (data.businessName) {
            bizNameInput.value = data.businessName;
        }

        if (data.upiId) {
            upiIdInput.value = data.upiId;
        }
    } catch (error) {
        console.error(
            'Unable to load business data.',
            error
        );
    }
}

//PAYMENT HISTORY
function getHistory() {
    const saved = localStorage.getItem(STORAGE.history);

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        return [];
    }
}

//SAVE PAYMENT
function savePaymentHistory(payment) {
    const history = getHistory();

    history.unshift({
        id: Date.now(),
        businessName: payment.businessName,
        clientName: payment.clientName,
        upiId: payment.upiId,
        amount: Number(payment.amount),
        reference: payment.reference || '-',
        note: payment.note || '-',
        date: new Date().toISOString()
    });

    const limitedHistory = history.slice(0, 50);

    localStorage.setItem(
        STORAGE.history,
        JSON.stringify(limitedHistory)
    );

    renderHistory();
}

//RENDER HISTORY
function renderHistory() {
    const history = getHistory();

    if (!history.length) {
        historyBody.innerHTML = `
            <tr class="empty-history">
                <td colspan="5">
                    <i class='bx bx-receipt'></i>
                    <p>No payment history yet</p>
                    <span>
                        Generated QR codes will appear here.
                    </span>
                </td>
            </tr>
        `;

        return;
    }

    historyBody.innerHTML = history.map(payment => {
        const date = new Date(payment.date);

        return `
            <tr>
                <td>
                    <strong>
                        ${escapeHTML(payment.businessName)}
                    </strong>
                </td>
                <td>
                    ${escapeHTML(payment.clientName || '-')}
                </td>
                <td>
                    ${escapeHTML(payment.upiId)}
                </td>
                <td class="amount-cell">
                    ${formatCurrency(payment.amount)}
                </td>
                <td>
                    ${escapeHTML(payment.reference)}
                </td>
                <td>
                    ${formatDate(date)}
                </td>
            </tr>
        `;
    }).join('');
}

//UPDATE STATS
function updateStats() {
    const history = getHistory();

    const total = history.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const today = new Date();

    const todayPayments = history.filter(item => {
        const date = new Date(item.date);

        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    });

    qrCount.textContent = history.length;
    totalAmount.textContent = formatCurrency(total);
    todayCount.textContent = todayPayments.length;
}

//CLEAR HISTORY
clearHistoryBtn.addEventListener('click', () => {
    const history = getHistory();

    if (!history.length) {
        showToast('Payment history is already empty.');
        return;
    }

    const confirmed = confirm(
        'Are you sure you want to clear all payment history?'
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(STORAGE.history);

    renderHistory();
    updateStats();

    showToast('Payment history cleared.');
});

//DATE FORMAT
function formatDate(date) {
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

//ESCAPE HTML
function escapeHTML(value) {
    const div = document.createElement('div');

    div.textContent = value ?? '';

    return div.innerHTML;
}

//TOAST
let toastTimer;

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

//DARK MODE
function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE.theme);

    if (savedTheme === 'dark') {
        document.body.classList.add('dark');

        themeBtn.innerHTML =
            "<i class='bx bx-sun'></i>";
    }
}

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    const darkMode = document.body.classList.contains('dark');

    localStorage.setItem(
        STORAGE.theme,
        darkMode ? 'dark' : 'light'
    );

    themeBtn.innerHTML = darkMode
        ? "<i class='bx bx-sun'></i>"
        : "<i class='bx bx-moon'></i>";
});

//ENTER KEY
[
    bizNameInput,
    upiIdInput,
    amountInput,
    referenceInput,
    noteInput
].forEach(input => {
    input.addEventListener('keydown', event => {
        if (
            event.key === 'Enter' &&
            input !== noteInput
        ) {
            event.preventDefault();
            generateQR();
        }
    });
});

//INPUT VALIDATION
upiIdInput.addEventListener('input', function () {
    this.value = this.value.replace(/\s/g, '');
});

amountInput.addEventListener('input', () => {
    quickAmountButtons.forEach(button => {
        button.classList.remove('active');
    });
});

//INITIALIZE
function initialize() {
    currentYear.textContent = new Date().getFullYear();

    loadBusinessData();
    loadTheme();
    renderHistory();
    updateStats();

    referenceRow.style.display = 'flex';
    noteRow.style.display = 'flex';

    downloadBtn.disabled = true;
    copyBtn.disabled = true;
    printBtn.disabled = true;
}

initialize();