import React, { useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from '../utils/firebase';

const initialPlans = {
  silver: { id: 'silver', name: 'SILVER', durationDays: 30, basePriceUsd: 9.99, level: 1 },
  gold: { id: 'gold', name: 'GOLD', durationDays: 90, basePriceUsd: 19.99, level: 2 },
  platinum: { id: 'platinum', name: 'PLATINUM', durationDays: 180, basePriceUsd: 49.99, level: 3 },
  business: { id: 'business', name: 'BUSINESS', durationDays: 30, basePriceUsd: 99.99, level: 10 },
};

const initialCountries = {
  PK: {
    currency: 'PKR',
    currencyRateToUsd: 277.5,
    affordabilityFactor: 0.38,
    companyCostFactor: 1.0,
    crossBorderAdjustment: 0.03,
  },
  IN: {
    currency: 'INR',
    currencyRateToUsd: 88,
    affordabilityFactor: 0.48,
    companyCostFactor: 1.0,
    crossBorderAdjustment: 0.03,
  },
  AE: {
    currency: 'AED',
    currencyRateToUsd: 3.6725,
    affordabilityFactor: 0.9,
    companyCostFactor: 1.0,
    crossBorderAdjustment: 0.02,
  },
  GB: {
    currency: 'GBP',
    currencyRateToUsd: 0.75,
    affordabilityFactor: 1.0,
    companyCostFactor: 1.05,
    crossBorderAdjustment: 0.02,
  },
  US: {
    currency: 'USD',
    currencyRateToUsd: 1,
    affordabilityFactor: 1.0,
    companyCostFactor: 1.1,
    crossBorderAdjustment: 0.02,
  },
};

const initialCostPolicy = {
  paymentProcessingReserve: 0.06,
  taxReserve: 0.05,
  employeeSupportReserve: 0.12,
  infrastructureReserve: 0.05,
  operationalReserve: 0.07,
  targetMargin: 0.2,
  minimumPriceMultiplier: 0.55,
  maximumPriceMultiplier: 1.35,
};

const Pricing = () => {
  const [version, setVersion] = useState('2026.09.1');
  const [plans, setPlans] = useState(initialPlans);
  const [countries, setCountries] = useState(initialCountries);
  const [costPolicy, setCostPolicy] = useState(initialCostPolicy);
  const [status, setStatus] = useState('draft');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const updatePlan = (id, field, value) => {
    setPlans((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: field === 'name' ? value : Number(value),
      },
    }));
  };

  const updateCountry = (code, field, value) => {
    setCountries((current) => ({
      ...current,
      [code]: {
        ...current[code],
        [field]: field === 'currency' ? value : Number(value),
      },
    }));
  };

  const updateCost = (field, value) => {
    setCostPolicy((current) => ({
      ...current,
      [field]: Number(value),
    }));
  };

  const handleDraftSave = async () => {
    const policyVersion = String(version || '').trim();

    if (!policyVersion) {
      setMessage('براہِ کرم Policy Version درج کریں۔');
      return;
    }

    if (!auth.currentUser) {
      setMessage('Admin authentication موجود نہیں ہے۔');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const policy = {
        version: policyVersion,
        status: 'draft',
        plans,
        countries,
        companyCostPolicy: costPolicy,
        upgradePolicy: {
          loyaltyDiscountRate: 0.05,
          minimumTargetLevelIncrease: 1,
        },
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid,
        updatedByEmail: auth.currentUser.email || null,
      };

      await setDoc(
        doc(db, 'pricingPolicies', policyVersion),
        policy
      );

      setStatus('draft');
      setMessage('Pricing Draft کامیابی سے Firestore میں محفوظ ہو گیا۔');
    } catch (error) {
      console.error('Pricing draft save error:', error);

      if (error?.code === 'permission-denied') {
        setMessage(
          'اجازت نہیں ہے۔ صرف مجاز Admin pricing policy محفوظ کر سکتا ہے۔'
        );
      } else {
        setMessage(
          'Pricing Draft محفوظ نہیں ہو سکا۔ دوبارہ کوشش کریں۔'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async () => {
    const policyVersion = String(version || '').trim();

    if (!policyVersion) {
      setMessage('براہِ کرم Policy Version درج کریں۔');
      return;
    }

    if (!auth.currentUser) {
      setMessage('Admin authentication موجود نہیں ہے۔');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const activatePricingPolicy = httpsCallable(
        functions,
        'activatePricingPolicy'
      );

      const result = await activatePricingPolicy({
        version: policyVersion,
      });

      setStatus(result?.data?.status || 'active');
      setMessage('Pricing Policy کامیابی سے activate ہو گئی۔');
    } catch (error) {
      console.error('Pricing policy activation error:', error);

      if (error?.code === 'functions/permission-denied') {
        setMessage('اس Admin account کو Pricing Policy activate کرنے کی اجازت نہیں ہے۔');
      } else if (error?.code === 'functions/failed-precondition') {
        setMessage('یہ Policy activate نہیں ہو سکتی۔ ممکن ہے یہ draft نہ ہو یا اس کی configuration نامکمل ہو۔');
      } else if (error?.code === 'functions/not-found') {
        setMessage('منتخب Pricing Policy نہیں ملی۔ پہلے Save Draft کریں۔');
      } else {
        setMessage('Pricing Policy activate نہیں ہو سکی۔ دوبارہ کوشش کریں۔');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-5" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-[#4A0E0E] sm:text-2xl">
          قیمتوں کا کنٹرول
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Azwaj کی versioned pricing policy management
        </p>
      </div>

      <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#FFFDF9] p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-xs font-bold text-gray-600">
              Policy Version
            </span>
            <input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
            />
          </label>

          <div>
            <span className="text-xs font-bold text-gray-600">Status</span>
            <div className="mt-2">
              <span className="inline-flex rounded-full bg-yellow-50 px-3 py-2 text-xs font-bold text-yellow-700">
                {status.toUpperCase()}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-gray-600">Authority</span>
            <p className="mt-2 text-sm font-semibold text-gray-700">
              Server / Admin controlled
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#4A0E0E]/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h3 className="font-bold text-[#4A0E0E]">Subscription Plans</h3>
          <p className="mt-1 text-xs text-gray-500">
            Base prices USD میں policy level پر محفوظ ہوں گے۔
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Object.values(plans).map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-gray-200 bg-[#FFFDF9] p-4"
            >
              <div className="mb-4">
                <p className="font-black tracking-wide text-[#4A0E0E]">
                  {plan.name}
                </p>
                <p className="mt-1 text-xs text-gray-500">{plan.id}</p>
              </div>

              <label className="block">
                <span className="text-xs text-gray-500">Name</span>
                <input
                  value={plan.name}
                  onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>

              <label className="mt-3 block">
                <span className="text-xs text-gray-500">Duration (days)</span>
                <input
                  type="number"
                  min="0"
                  value={plan.durationDays}
                  onChange={(e) =>
                    updatePlan(plan.id, 'durationDays', e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>

              <label className="mt-3 block">
                <span className="text-xs text-gray-500">Base Price (USD)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={plan.basePriceUsd}
                  onChange={(e) =>
                    updatePlan(plan.id, 'basePriceUsd', e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>

              <label className="mt-3 block">
                <span className="text-xs text-gray-500">Level</span>
                <input
                  type="number"
                  min="0"
                  value={plan.level}
                  onChange={(e) =>
                    updatePlan(plan.id, 'level', e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#4A0E0E]/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h3 className="font-bold text-[#4A0E0E]">Country Policies</h3>
          <p className="mt-1 text-xs text-gray-500">
            Country-level currency اور pricing factors
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(countries).map(([code, policy]) => (
            <div
              key={code}
              className="rounded-2xl border border-gray-200 bg-[#FFFDF9] p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-black text-[#4A0E0E]">{code}</span>
                <span className="rounded-full bg-[#4A0E0E]/5 px-3 py-1 text-xs font-bold text-[#4A0E0E]">
                  {policy.currency}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <label>
                  <span className="text-xs text-gray-500">Currency</span>
                  <input
                    value={policy.currency}
                    onChange={(e) =>
                      updateCountry(code, 'currency', e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>

                {[
                  ['currencyRateToUsd', 'Currency Rate'],
                  ['affordabilityFactor', 'Affordability'],
                  ['companyCostFactor', 'Company Cost'],
                  ['crossBorderAdjustment', 'Cross Border'],
                ].map(([field, label]) => (
                  <label key={field}>
                    <span className="text-xs text-gray-500">{label}</span>
                    <input
                      type="number"
                      step="0.0001"
                      value={policy[field]}
                      onChange={(e) =>
                        updateCountry(code, field, e.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#4A0E0E]/10 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="font-bold text-[#4A0E0E]">Company Cost Policy</h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(costPolicy).map(([field, value]) => (
            <label key={field}>
              <span className="text-xs text-gray-500">{field}</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => updateCost(field, e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#FFFDF9] p-4 text-xs leading-6 text-[#4A0E0E]">
        <strong>اہم:</strong> Save Draft موجودہ Pricing Policy کو Firestore میں draft
        کے طور پر محفوظ کرتا ہے۔ Activate action صرف authorized Admin کے ذریعے
        secure Cloud Function کے راستے draft policy کو active کرتا ہے۔
      </div>

      {message && (
        <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#FFFDF9] p-4 text-sm font-semibold text-[#4A0E0E]">
          {message}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-start">
        <button
          type="button"
          onClick={handleDraftSave}
          disabled={saving}
          className={`rounded-xl bg-[#4A0E0E] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 ${
            saving ? 'cursor-not-allowed opacity-60' : ''
          }`}
        >
          {saving ? 'محفوظ ہو رہا ہے...' : 'Save Draft'}
        </button>

        <button
          type="button"
          onClick={handleActivate}
          className="rounded-xl border border-[#D4AF37] bg-[#D4AF37]/10 px-5 py-3 text-sm font-bold text-[#4A0E0E]"
        >
          Activate Policy
        </button>
      </div>
    </section>
  );
};

export default Pricing;
