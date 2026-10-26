import React from 'react';
import { useTranslation } from 'react-i18next';
import { CLIENT_ROW_1, CLIENT_ROW_2 } from '../../data/clients';

export const ClientMarquee: React.FC = () => {
  const { t } = useTranslation();
  const rows = [CLIENT_ROW_1, CLIENT_ROW_2];

  return (
    <section
      aria-label={t('clients.title')}
      className="overflow-hidden border-b border-slate-200 bg-white py-12 sm:py-16"
    >
      <div className="space-y-4 sm:space-y-5">
        {rows.map((clients, rowIndex) => (
          <div
            key={rowIndex}
            className="relative w-full overflow-hidden"
            aria-label={t('clients.title')}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-24" />

            <div
              className={rowIndex === 0 ? 'animate-marquee' : 'animate-marquee-reverse'}
            >
              {[0, 1, 2, 3].map((copy) => (
                <div
                  key={copy}
                  aria-hidden={copy > 0}
                  className="flex w-max shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4"
                >
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="client-logo-card flex h-[76px] w-[164px] shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-[0_4px_16px_rgba(15,35,70,0.04)] sm:h-[88px] sm:w-[190px] sm:px-5"
                    >
                      <img
                        src={client.image}
                        alt={copy === 0 ? client.name : ''}
                        className="h-full w-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
