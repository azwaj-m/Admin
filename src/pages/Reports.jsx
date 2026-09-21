import React from "react";
import {
  AlertTriangle,
  ShieldCheck,
  Clock3,
  FileWarning,
  MessageSquareWarning,
  UserRound,
} from "lucide-react";

const stats = [
  {
    label: "کل رپورٹس",
    value: "—",
    icon: FileWarning,
    note: "ڈیٹا schema تیار ہونے کے بعد",
  },
  {
    label: "زیرِ جائزہ",
    value: "—",
    icon: Clock3,
    note: "ابھی کوئی mock data نہیں",
  },
  {
    label: "صارف رپورٹس",
    value: "—",
    icon: UserRound,
    note: "Firestore collection موجود نہیں",
  },
  {
    label: "چیٹ رپورٹس",
    value: "—",
    icon: MessageSquareWarning,
    note: "چیٹ ciphertext ہے",
  },
];

const categories = [
  {
    title: "User Reports",
    description: "صارف کے خلاف موصول ہونے والی رپورٹس",
    icon: UserRound,
  },
  {
    title: "Profile Reports",
    description: "پروفائل یا پروفائل معلومات سے متعلق شکایات",
    icon: AlertTriangle,
  },
  {
    title: "Chat Reports",
    description: "چیٹ سے متعلق safety reports",
    icon: MessageSquareWarning,
  },
  {
    title: "Moderation",
    description: "مستقبل کے server-authoritative moderation actions",
    icon: ShieldCheck,
  },
];

export default function Reports() {
  return (
    <div className="min-h-full bg-[#FFFDF9] text-[#4A0E0E]" dir="rtl">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <section className="rounded-2xl border border-[#D4AF37]/20 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#4A0E0E]/5 px-3 py-1 text-xs font-bold text-[#4A0E0E]">
                <ShieldCheck size={14} />
                Azwaj Safety Center
              </div>

              <h1 className="text-2xl font-black sm:text-3xl">
                رپورٹس اور سیفٹی
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                یہ حصہ صارفین، پروفائلز اور چیٹ سے متعلق safety reports کی
                انتظامی نگرانی کے لیے تیار کیا گیا ہے۔ موجودہ Azwaj Firestore
                schema میں ابھی مستقل Reports collection موجود نہیں، اس لیے
                یہاں کوئی فرضی رپورٹ یا fake count نہیں دکھایا جا رہا۔
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800">
              <FileWarning size={16} />
              Reporting schema pending
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, note }) => (
            <div
              key={label}
              className="rounded-2xl border border-[#D4AF37]/15 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-gray-500">{label}</p>
                  <p className="mt-2 text-3xl font-black text-[#4A0E0E]">
                    {value}
                  </p>
                </div>

                <div className="rounded-xl bg-[#4A0E0E] p-3 text-[#D4AF37]">
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-3 text-[11px] leading-5 text-gray-400">
                {note}
              </p>
            </div>
          ))}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-black">Safety Areas</h2>
            <p className="mt-1 text-xs text-gray-500">
              Reports schema اور backend workflow مکمل ہونے کے بعد یہ حصے
              حقیقی Firestore data سے منسلک کیے جائیں گے۔
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {categories.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-[#D4AF37]/15 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-xl bg-[#4A0E0E]/5 p-3 text-[#4A0E0E]">
                    <Icon size={21} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-black text-[#4A0E0E]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D4AF37]/20 bg-[#4A0E0E] p-5 text-white shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-0.5 shrink-0 text-[#D4AF37]"
              size={21}
            />

            <div>
              <h2 className="font-black text-[#D4AF37]">
                Security architecture
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/80">
                حساس moderation actions براہِ راست client-side Firestore
                writes سے نہیں کیے جائیں گے۔ Verification، suspension،
                moderation اور دیگر privileged actions کے لیے server-side
                authorization اور Firestore Rules ضروری ہوں گے۔
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
