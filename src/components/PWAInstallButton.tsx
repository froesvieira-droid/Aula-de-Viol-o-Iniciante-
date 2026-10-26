import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide button
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-600/40 text-emerald-300 text-xs font-medium">
        <Check className="w-3.5 h-3.5" />
        <span>App Instalado</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-amber-950/40 hover:shadow-lg transition cursor-pointer"
        title="Instalar aplicativo para usar offline"
      >
        <Download className="w-4 h-4" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-900/40 transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Instalar no iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#1c120a] border border-amber-600/40 p-6 shadow-2xl text-amber-100">
              <div className="flex items-center justify-between pb-3 border-b border-amber-900/50">
                <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  Instalar no iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-amber-400 hover:text-white hover:bg-amber-900/40 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">1</span>
                  <span>Toque no botão de <strong>Compartilhar</strong> (ícone do quadrado com a seta para cima) na barra do Safari.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">2</span>
                  <span>Role a tela e toque em <strong>"Adicionar à Tela de Início"</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">3</span>
                  <span>Toque em <strong>Adicionar</strong>. O Violão Mestre funcionará em tela cheia mesmo sem internet!</span>
                </p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-amber-600 hover:bg-amber-500 py-2.5 text-xs sm:text-sm font-semibold text-white shadow transition cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
