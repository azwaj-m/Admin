import React from 'react';

const AdminPlaceholder = ({ title, description }) => {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#4A0E0E] sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      <div className="rounded-2xl border border-[#4A0E0E]/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex min-h-[220px] items-center justify-center text-center">
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4A0E0E]/5 text-2xl text-[#4A0E0E]">
              ◈
            </div>
            <p className="font-semibold text-gray-800">
              یہ Azwaj Admin module تیار کیا جا رہا ہے
            </p>
            <p className="mt-1 text-sm text-gray-500">
              اگلے مرحلے میں اس حصے کی اصل Firebase functionality شامل کی جائے گی۔
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPlaceholder;
