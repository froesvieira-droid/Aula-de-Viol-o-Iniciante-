import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return (
      <div 
        className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs"
        title="O conteúdo das aulas e sintetizador estão em cache para uso offline"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Pronto Offline</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-600/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400/40 animate-bounce">
      <WifiOff className="w-4 h-4 text-white" />
      <div>
        <p className="font-bold">Modo Offline Ativo</p>
        <p className="text-[11px] text-amber-100 font-normal">Aulas e áudio funcionando sem internet!</p>
      </div>
    </div>
  );
};
