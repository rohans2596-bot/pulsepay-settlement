// PulsePay Settlement Core - Real-Time Ledger Engine
(function () {
  'use strict';

  const tbody = document.getElementById('ledger-tbody');
  const valVol = document.getElementById('val-settled-vol');
  const inpSrc = document.getElementById('inp-src');
  const inpDest = document.getElementById('inp-dest');
  const inpAmount = document.getElementById('inp-amount');
  const btnDispatch = document.getElementById('btn-dispatch-tx');

  let totalVolume = 42891402;

  const ACCOUNTS = [
    'acct_vault_reserve_01', 'acct_merchant_prime_88', 'acct_settle_eur_12',
    'acct_clearing_fed_04', 'acct_liquidity_pool_9', 'acct_partner_stripe_99'
  ];

  function createTxRow(txid, src, dest, amount, status) {
    const tr = document.createElement('tr');
    tr.style.animation = 'fadeIn 0.3s ease-out';
    const isFlagged = status === 'FLAGGED';

    tr.innerHTML = `
      <td style="color: var(--accent-cyan); font-weight: 700;">#tx_${txid}</td>
      <td>${src}</td>
      <td>${dest}</td>
      <td style="font-weight: 700; color: #ffffff;">$${amount.toLocaleString()}</td>
      <td><span class="${isFlagged ? 'badge-flagged' : 'badge-settled'}">${status}</span></td>
    `;
    return tr;
  }

  // Prepopulate transactions
  for (let i = 0; i < 7; i++) {
    const txid = Math.random().toString(36).substring(2, 9);
    const src = ACCOUNTS[Math.floor(Math.random() * ACCOUNTS.length)];
    let dest = ACCOUNTS[Math.floor(Math.random() * ACCOUNTS.length)];
    while (dest === src) dest = ACCOUNTS[Math.floor(Math.random() * ACCOUNTS.length)];
    const amt = Math.floor(Math.random() * 85000) + 1200;
    tbody.appendChild(createTxRow(txid, src, dest, amt, 'SETTLED'));
  }

  // Automatic high-frequency stream
  setInterval(() => {
    const txid = Math.random().toString(36).substring(2, 9);
    const src = ACCOUNTS[Math.floor(Math.random() * ACCOUNTS.length)];
    let dest = ACCOUNTS[Math.floor(Math.random() * ACCOUNTS.length)];
    while (dest === src) dest = ACCOUNTS[Math.floor(Math.random() * ACCOUNTS.length)];
    const amt = Math.floor(Math.random() * 45000) + 500;
    const isSuspicious = Math.random() < 0.05;

    totalVolume += amt;
    valVol.textContent = `$${totalVolume.toLocaleString()}`;

    const newRow = createTxRow(txid, src, dest, amt, isSuspicious ? 'FLAGGED' : 'SETTLED');
    tbody.insertBefore(newRow, tbody.firstChild);

    if (tbody.children.length > 10) {
      tbody.removeChild(tbody.lastChild);
    }
  }, 1600);

  // Manual Instant Settlement Dispatch
  btnDispatch.addEventListener('click', () => {
    const src = inpSrc.value.trim() || 'acct_user_source';
    const dest = inpDest.value.trim() || 'acct_merchant_dest';
    const amt = parseFloat(inpAmount.value) || 1000;

    btnDispatch.textContent = 'Clearing Transaction...';
    btnDispatch.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';

    setTimeout(() => {
      const txid = Math.random().toString(36).substring(2, 9);
      totalVolume += amt;
      valVol.textContent = `$${totalVolume.toLocaleString()}`;

      const row = createTxRow(txid, src, dest, amt, 'SETTLED');
      row.style.background = 'rgba(16, 185, 129, 0.15)';
      tbody.insertBefore(row, tbody.firstChild);

      btnDispatch.textContent = '✓ Settled & Persisted';
      btnDispatch.style.background = 'linear-gradient(135deg, var(--accent-green), #059669)';

      setTimeout(() => {
        btnDispatch.textContent = 'Dispatch Idempotent Settlement';
      }, 1500);
    }, 350);
  });

})();
