import React, { useRef, useState } from 'react';
import { Image } from 'lucide-react';

const installmentPlans = [
  { months: 3, multiplier: 1.54 },
  { months: 6, multiplier: 1.84 },
  { months: 8, multiplier: 1.96 },
  { months: 10, multiplier: 2.0 },
  { months: 12, multiplier: 2.1 },
  { months: 15, multiplier: 2.22 }
];
const downPaymentRates = [15, 20, 25, 30, 35, 40, 45];
const commissionRate = 0.15;
const formatNumber = (value) => Number(value || 0).toLocaleString('th-TH');

export default function App() {
  const [condition, setCondition] = useState('ใหม่');
  const [downPaymentPercent, setDownPaymentPercent] = useState(15);
  const [sellingPriceInput, setSellingPriceInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const resultsRef = useRef(null);

  const resetResult = () => { setResult(null); setError(''); };

  const handleCalculate = () => {
    const sellingPrice = Number(sellingPriceInput.trim());
    if (!Number.isFinite(sellingPrice) || sellingPrice <= 0) {
      setResult(null);
      setError('กรุณากรอกราคาขายมากกว่า 0 บาท');
      return;
    }

    const downPaymentAmount = Math.round(sellingPrice * downPaymentPercent / 100);
    const financingAmount = sellingPrice - downPaymentAmount;
    const commissionAmount = Math.round(financingAmount * commissionRate);
    const installmentOptions = installmentPlans.map((plan) => ({
      ...plan,
      monthlyPayment: Math.ceil((financingAmount * plan.multiplier / plan.months) / 10) * 10
    }));

    setError('');
    setResult({ sellingPrice, downPaymentAmount, financingAmount, commissionAmount, installmentOptions });
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  };

  const handleClear = () => {
    setCondition('ใหม่');
    setDownPaymentPercent(15);
    setSellingPriceInput('');
    setResult(null);
    setError('');
  };

  return (
    <div className="app-container">
      <div className="logo-section">
        <img src={`${import.meta.env.BASE_URL}easypay_logo.png`} alt="EASYPAY Logo" className="app-logo" />
      </div>

      <main className="main-content">
        <div className="calculator-card">
          <div className="card-header-gradient"><span className="card-header-icon">🧮</span><span>เครื่องคำนวณเรทผ่อนชำระ</span></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">หมวดหมู่สินค้า</label>
              <div className="tab-container">
                {['ใหม่', 'มือสอง'].map((item) => (
                  <button key={item} type="button" className={`tab-btn ${condition === item ? 'active' : ''}`} onClick={() => { setCondition(item); resetResult(); }}>{item}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="selling-price">ราคาขาย (บาท)</label>
              <input id="selling-price" type="number" inputMode="numeric" min="0" value={sellingPriceInput} placeholder="10000" className="form-input" onChange={(event) => { setSellingPriceInput(event.target.value); resetResult(); }} />
            </div>

            <div className="form-group">
              <label className="form-label">เปอร์เซ็นต์เงินดาวน์</label>
              <div className="down-payment-options">
                {downPaymentRates.map((rate) => (
                  <button key={rate} type="button" className={`down-btn ${downPaymentPercent === rate ? 'active' : ''}`} onClick={() => { setDownPaymentPercent(rate); resetResult(); }}>{rate}%</button>
                ))}
              </div>
            </div>

            <div className="summary-info-grid">
              <div className="info-box"><span className="info-label">ค่านายหน้าร้านค้า</span><span className="info-value text-green">15%</span></div>
              <div className="info-box"><span className="info-label">ระยะเวลาสูงสุด</span><span className="info-value text-blue">15 งวด</span></div>
            </div>

            <div className="button-group-vertical">
              <button type="button" onClick={handleCalculate} className="btn-calculate">คำนวณเรทผ่อน</button>
              <button type="button" onClick={handleClear} className="btn-clear">ล้างค่า</button>
            </div>

            <div className="result-section" ref={resultsRef}>
              {!result && !error && <div className="result-placeholder-box"><Image size={36} /><span>กรอกราคาขาย แล้วกดคำนวณเพื่อดูค่างวด</span></div>}
              {error && <div className="result-error-box">⚠️ {error}</div>}
              {result && (
                <div className="result-details-container">
                  <h3 className="result-section-title">สรุปผลการคำนวณ</h3>
                  <div className="transfer-highlight-box">
                    <div className="transfer-label">ยอดจัดไฟแนนซ์</div>
                    <div className="transfer-value">{formatNumber(result.financingAmount)} <span className="currency-label">บาท</span></div>
                    <div className="transfer-subinfo">iPhone / iPad · {condition} · เงินดาวน์ {downPaymentPercent}%</div>
                  </div>
                  <div className="result-details-list">
                    <div className="result-detail-item"><span className="detail-label">ราคาขาย</span><span className="detail-value">{formatNumber(result.sellingPrice)} บาท</span></div>
                    <div className="result-detail-item"><span className="detail-label">เงินดาวน์ ({downPaymentPercent}%)</span><span className="detail-value text-blue">{formatNumber(result.downPaymentAmount)} บาท</span></div>
                    <div className="result-detail-item"><span className="detail-label">ทุนเช่าซื้อ</span><span className="detail-value">{formatNumber(result.financingAmount)} บาท</span></div>
                    <div className="result-detail-item"><span className="detail-label">ค่านายหน้าร้านค้า (15%)</span><span className="detail-value text-green">{formatNumber(result.commissionAmount)} บาท</span></div>
                  </div>
                  <div className="installment-section">
                    <h4 className="installment-title">ตารางค่างวดผ่อนชำระต่อเดือน</h4>
                    <div className="table-responsive">
                      <table className="installment-table">
                        <thead><tr><th>ระยะเวลาผ่อน</th><th>ตัวคูณ</th><th>ค่างวด / เดือน</th></tr></thead>
                        <tbody>{result.installmentOptions.map((plan) => (
                          <tr key={plan.months}><td className="font-bold">{plan.months} เดือน</td><td className="text-muted">{plan.multiplier.toFixed(2)}</td><td className="payment-cell">{formatNumber(plan.monthlyPayment)} บาท</td></tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="app-footer">© {new Date().getFullYear()} EASYPAY · ระบบเครื่องคำนวณเรทผ่อนพาร์ทเนอร์</footer>
    </div>
  );
}
