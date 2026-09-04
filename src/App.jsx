import React, { useMemo, useState } from 'react';
import { Calculator, SlidersHorizontal, Table2 } from 'lucide-react';

const installmentPlans = [
  { months: 3, multiplier: 1.54 },
  { months: 6, multiplier: 1.84 },
  { months: 8, multiplier: 1.96 },
  { months: 10, multiplier: 2.0 },
  { months: 12, multiplier: 2.1 },
  { months: 15, multiplier: 2.22 }
];

const downPaymentRates = [15, 20, 25, 30, 35, 40, 45];
const merchantCommissionRate = 0.15;

const formatBaht = (value) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);

export default function App() {
  const [productType, setProductType] = useState('iPhone');
  const [productCondition, setProductCondition] = useState('ใหม่');
  const [devicePrice, setDevicePrice] = useState('');
  const [downPaymentType, setDownPaymentType] = useState('percent');
  const [downPaymentValue, setDownPaymentValue] = useState('15');

  const calculation = useMemo(() => {
    const price = Math.max(Number(devicePrice) || 0, 0);
    const rawDownPayment = Math.max(Number(downPaymentValue) || 0, 0);
    const downPayment = downPaymentType === 'percent'
      ? Math.round(price * Math.min(rawDownPayment, 100) / 100)
      : Math.min(Math.round(rawDownPayment), price);
    const financedAmount = Math.max(price - downPayment, 0);

    return {
      downPayment,
      financedAmount,
      plans: installmentPlans.map((plan) => {
        const monthlyPayment = Math.ceil((financedAmount * plan.multiplier / plan.months) / 10) * 10;
        return {
          ...plan,
          monthlyPayment,
          contractTotal: downPayment + (monthlyPayment * plan.months),
          merchantCommission: Math.round(financedAmount * merchantCommissionRate)
        };
      })
    };
  }, [devicePrice, downPaymentType, downPaymentValue]);

  const handleDownPaymentTypeChange = (event) => {
    const nextType = event.target.value;
    setDownPaymentType(nextType);
    setDownPaymentValue(nextType === 'percent' ? '15' : '');
  };

  const handleClear = () => {
    setProductType('iPhone');
    setProductCondition('ใหม่');
    setDevicePrice('');
    setDownPaymentType('percent');
    setDownPaymentValue('15');
  };

  return (
    <div className="page-shell">
      <header className="site-header">
        <img src={`${import.meta.env.BASE_URL}easypay_logo.png`} alt="EASYPAY Leasing Thailand" />
        <div>
          <p>EASYPAY LEASING THAILAND</p>
          <h1>คำนวณผ่อนชำระ</h1>
        </div>
      </header>

      <main className="calculator-layout">
        <aside className="panel form-panel">
          <div className="panel-heading">
            <span className="panel-icon"><SlidersHorizontal size={19} /></span>
            <h2>กรอกข้อมูล</h2>
          </div>

          <div className="form-body">
            <label className="field">
              <span>กลุ่มร้าน</span>
              <select defaultValue="easypay">
                <option value="easypay">บริษัท Easypay</option>
              </select>
            </label>

            <label className="field">
              <span>ประเภทสินค้า</span>
              <select value={productType} onChange={(event) => setProductType(event.target.value)}>
                <option>iPhone</option>
                <option>Android</option>
              </select>
            </label>

            <label className="field">
              <span>หมวดหมู่สินค้า</span>
              <select value={productCondition} onChange={(event) => setProductCondition(event.target.value)}>
                <option>ใหม่</option>
                <option>มือสอง</option>
              </select>
            </label>

            <label className="field">
              <span>ราคาเครื่อง (฿)</span>
              <input
                type="number"
                min="0"
                step="100"
                inputMode="decimal"
                value={devicePrice}
                onChange={(event) => setDevicePrice(event.target.value)}
                placeholder="กรุณาใส่ราคาเครื่อง"
              />
            </label>

            <div className="down-payment-row">
              <label className="field">
                <span>ประเภทเงินดาวน์</span>
                <select value={downPaymentType} onChange={handleDownPaymentTypeChange}>
                  <option value="percent">เปอร์เซ็นต์เงินดาวน์</option>
                  <option value="amount">จำนวนเงินดาวน์</option>
                </select>
              </label>

              <label className="field">
                <span>{downPaymentType === 'percent' ? 'เปอร์เซ็นต์เงินดาวน์' : 'จำนวนเงินดาวน์ (฿)'}</span>
                {downPaymentType === 'percent' ? (
                  <select value={downPaymentValue} onChange={(event) => setDownPaymentValue(event.target.value)}>
                    {downPaymentRates.map((rate) => <option key={rate} value={rate}>{rate}%</option>)}
                  </select>
                ) : (
                  <input
                    type="number"
                    min="0"
                    step="100"
                    inputMode="decimal"
                    value={downPaymentValue}
                    onChange={(event) => setDownPaymentValue(event.target.value)}
                    placeholder="กรุณาใส่เงินดาวน์"
                  />
                )}
              </label>
            </div>

            <div className="selection-summary">
              <Calculator size={17} />
              <span>{productType} · {productCondition} · เงินดาวน์ {formatBaht(calculation.downPayment)}</span>
            </div>

            <button type="button" className="clear-button" onClick={handleClear}>ล้างค่า</button>
          </div>
        </aside>

        <section className="panel table-panel">
          <div className="panel-heading">
            <span className="panel-icon"><Table2 size={19} /></span>
            <div>
              <h2>ภาพรวมแผนผ่อนชำระ</h2>
              <p>เรทบริษัท Easypay · สูงสุด 15 งวด</p>
            </div>
          </div>

          <div className="table-wrap">
            <table className="rate-table">
              <thead>
                <tr>
                  <th>งวดที่</th>
                  <th>ยอดดาวน์</th>
                  <th>ทุนเช่าซื้อ</th>
                  <th>ตัวคูณดอกเบี้ย</th>
                  <th>ยอดผ่อนต่อเดือน</th>
                  <th>ราคารวมสัญญา</th>
                  <th>ค่านายหน้าร้านค้า</th>
                </tr>
              </thead>
              <tbody>
                {calculation.plans.map((plan) => (
                  <tr key={plan.months}>
                    <td data-label="งวดที่"><strong>{plan.months} เดือน</strong></td>
                    <td data-label="ยอดดาวน์">{formatBaht(calculation.downPayment)}</td>
                    <td data-label="ทุนเช่าซื้อ">{formatBaht(calculation.financedAmount)}</td>
                    <td data-label="ตัวคูณดอกเบี้ย">{plan.multiplier.toFixed(2)}x</td>
                    <td data-label="ยอดผ่อนต่อเดือน" className="monthly-payment">{formatBaht(plan.monthlyPayment)}</td>
                    <td data-label="ราคารวมสัญญา">{formatBaht(plan.contractTotal)}</td>
                    <td data-label="ค่านายหน้าร้านค้า">{formatBaht(plan.merchantCommission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer>© {new Date().getFullYear()} EASYPAY · เครื่องคำนวณเรทผ่อนร้านค้าพาร์ทเนอร์</footer>
    </div>
  );
}
