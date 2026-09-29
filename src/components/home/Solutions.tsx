import React from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, DollarSign, Palette, ArrowRight } from 'lucide-react';
import { SectionTitle } from '../ui/SectionTitle';
import { Button } from '../ui/Button';

export const Solutions: React.FC = () => {
  const { t } = useTranslation();

  const handleScrollToContact = () => {
    const contactElem = document.getElementById('lien-he-section');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const steps = [
    {
      num: '01',
      icon: <Truck className="w-6 h-6 text-[#E8531D]" />,
      titleKey: 'solutions.step1_title',
      descKey: 'solutions.step1_desc',
      details: 'Chủ động nguồn cung giấy FSC, thời gian quay vòng đơn hàng chỉ từ 5 - 7 ngày.',
    },
    {
      num: '02',
      icon: <DollarSign className="w-6 h-6 text-[#E8531D]" />,
      titleKey: 'solutions.step2_title',
      descKey: 'solutions.step2_desc',
      details: 'Thiết kế bình trang tối ưu, giảm tiêu hao giấy thừa và hạ giá thành mỗi đơn vị sản phẩm.',
    },
    {
      num: '03',
      icon: <Palette className="w-6 h-6 text-[#E8531D]" />,
      titleKey: 'solutions.step3_title',
      descKey: 'solutions.step3_desc',
      details: 'Công nghệ ép kim holo, phủ bóng cát, cán màng nhung độc bản nâng tầm nhận diện.',
    },
  ];

  return (
    <section className="py-24 bg-[#F5F7FA] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          kicker={t('solutions.badge')}
          title={t('solutions.title')}
          subtitle={t('solutions.subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Step numerical header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black font-mono tracking-tight text-slate-300">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#0B2A4A] mb-3 leading-snug">
                  {t(step.titleKey)}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {t(step.descKey)}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                {step.details}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-14 text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleScrollToContact}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            {t('solutions.cta')}
          </Button>
        </div>
      </div>
    </section>
  );
};
