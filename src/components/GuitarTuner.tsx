import React, { useState, useEffect, useRef } from 'react';
import { GUITAR_STRINGS, GuitarStringInfo } from '../data/guitarData';
import { guitarAudio } from '../services/guitarAudio';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  CheckCircle2, 
  Radio, 
  AlertTriangle, 
  Sparkles, 
  Activity,
  Lock,
  RefreshCw,
  SlidersHorizontal,
  HelpCircle
} from 'lucide-react';

export const GuitarTuner: React.FC = () => {
  const [selectedString, setSelectedString] = useState<GuitarStringInfo>(GUITAR_STRINGS[0]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [micVolumeLevel, setMicVolumeLevel] = useState<number>(0); // 0 to 100%
  const [autoStringDetection, setAutoStringDetection] = useState<boolean>(true);

  const [detectedPitch, setDetectedPitch] = useState<{
    note: string;
    freq: number;
    cents: number;
    status: 'in-tune' | 'flat' | 'sharp' | 'detecting';
    confidence: number;
  }>({
    note: '--',
    freq: 0,
    cents: 0,
    status: 'detecting',
    confidence: 0,
  });

  const [activeLoopString, setActiveLoopString] = useState<number | null>(null);

  // Play reference note from synthesizer
  const handlePlayString = (str: GuitarStringInfo) => {
    setSelectedString(str);
    guitarAudio.playTunerNote(str.index);
  };

  // Continuous loop tone
  const loopIntervalRef = useRef<number | null>(null);
  const toggleLoop = (str: GuitarStringInfo) => {
    if (activeLoopString === str.index) {
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
      setActiveLoopString(null);
    } else {
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
      setSelectedString(str);
      setActiveLoopString(str.index);
      guitarAudio.playTunerNote(str.index);
      loopIntervalRef.current = window.setInterval(() => {
        guitarAudio.playTunerNote(str.index);
      }, 2400);
    }
  };

  useEffect(() => {
    return () => {
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
    };
  }, []);

  // Web Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const smoothedCentsRef = useRef<number>(0);
  const lastValidPitchesRef = useRef<number[]>([]);

  const startListening = async () => {
    setMicPermissionError(null);

    // Check mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicPermissionError(
        'Seu navegador ou dispositivo atual não oferece suporte à API de gravação de áudio. Utilize a afinação pelo som de referência acústico abaixo!'
      );
      return;
    }

    try {
      // Best constraints for acoustic instrument pitch detection (disable speech filtering)
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
          video: false,
        });
      } catch (constraintErr) {
        // Fallback to basic audio constraints if advanced properties are unsupported
        console.warn('Fallback to basic audio constraints:', constraintErr);
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      }

      mediaStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Resume context if browser started it in suspended state
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const source = ctx.createMediaStreamSource(stream);

      // Low-pass filter to reject high-frequency hiss and room chatter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096; // 4096 gives fine resolution down to 82 Hz for 6th string
      analyser.smoothingTimeConstant = 0.8;

      source.connect(filter);
      filter.connect(analyser);
      analyserRef.current = analyser;

      setIsListening(true);
      smoothedCentsRef.current = 0;
      lastValidPitchesRef.current = [];

      detectPitchLoop();
    } catch (err: unknown) {
      console.error('Microphone access failed:', err);
      const errorObj = err as { name?: string; message?: string };
      
      if (errorObj.name === 'NotAllowedError' || errorObj.name === 'PermissionDeniedError') {
        setMicPermissionError(
          'A permissão de microfone foi negada pelo navegador. Para afinar com o microfone, clique no ícone de cadeado ou configurações no topo do navegador (barra de endereços), permita o microfone e recarregue a página.'
        );
      } else if (errorObj.name === 'NotFoundError' || errorObj.name === 'DevicesNotFoundError') {
        setMicPermissionError(
          'Nenhum dispositivo de microfone foi detectado no seu computador ou celular. Conecte um microfone ou use o som de referência das 6 cordas!'
        );
      } else if (errorObj.name === 'SecurityError') {
        setMicPermissionError(
          'O acesso ao microfone foi bloqueado por políticas de segurança do navegador. Tente abrir o aplicativo em uma aba dedicada ou use o som de referência.'
        );
      } else {
        setMicPermissionError(
          `Não foi possível iniciar o microfone (${errorObj.message || 'Erro desconhecido'}). Você pode afinar usando os botões das 6 cordas abaixo!`
        );
      }
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setMicVolumeLevel(0);
    setDetectedPitch({
      note: '--',
      freq: 0,
      cents: 0,
      status: 'detecting',
      confidence: 0,
    });
  };

  // High-precision Autocorrelation Algorithm
  const autoCorrelate = (buffer: Float32Array, sampleRate: number): { freq: number; confidence: number } => {
    const size = buffer.length;
    let sumSquares = 0;
    for (let i = 0; i < size; i++) {
      const val = buffer[i];
      sumSquares += val * val;
    }
    const rms = Math.sqrt(sumSquares / size);

    // Update real-time volume VU meter (clamped to 0 - 100%)
    const volumePercent = Math.min(100, Math.round(rms * 400));
    setMicVolumeLevel(volumePercent);

    // If signal is too quiet, ignore
    if (rms < 0.005) {
      return { freq: -1, confidence: 0 };
    }

    // Trim zero crossings to find period
    let r1 = 0, r2 = size - 1, thres = 0.15;
    for (let i = 0; i < size / 2; i++) {
      if (Math.abs(buffer[i]) < thres) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < size / 2; i++) {
      if (Math.abs(buffer[size - i]) < thres) {
        r2 = size - i;
        break;
      }
    }

    const trimmedBuffer = buffer.slice(r1, r2);
    const trimmedSize = trimmedBuffer.length;

    // Autocorrelation calculation
    const correlations = new Float32Array(trimmedSize);
    for (let lag = 0; lag < trimmedSize; lag++) {
      let sum = 0;
      for (let j = 0; j < trimmedSize - lag; j++) {
        sum += trimmedBuffer[j] * trimmedBuffer[j + lag];
      }
      correlations[lag] = sum;
    }

    // Skip initial descent from lag 0
    let lagStart = 0;
    while (lagStart < trimmedSize - 1 && correlations[lagStart] > correlations[lagStart + 1]) {
      lagStart++;
    }

    // Search for highest peak
    let maxVal = -1;
    let maxLag = -1;
    for (let lag = lagStart; lag < trimmedSize; lag++) {
      if (correlations[lag] > maxVal) {
        maxVal = correlations[lag];
        maxLag = lag;
      }
    }

    if (maxLag === -1 || correlations[0] <= 0) {
      return { freq: -1, confidence: 0 };
    }

    const confidence = maxVal / correlations[0];
    if (confidence < 0.35) {
      return { freq: -1, confidence: 0 };
    }

    // Parabolic interpolation around the peak for fractional period precision
    let refinedLag = maxLag;
    if (maxLag > 0 && maxLag < trimmedSize - 1) {
      const alpha = correlations[maxLag - 1];
      const beta = correlations[maxLag];
      const gamma = correlations[maxLag + 1];
      const delta = (alpha - gamma) / (2 * (alpha - 2 * beta + gamma));
      refinedLag = maxLag + delta;
    }

    const calculatedFreq = sampleRate / refinedLag;
    return { freq: calculatedFreq, confidence };
  };

  const detectPitchLoop = () => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);

    const { freq, confidence } = autoCorrelate(buffer, audioContextRef.current.sampleRate);

    // Guitar pitch range: 65 Hz (drop D / low E) to 400 Hz (high E fret)
    if (freq >= 65 && freq <= 420) {
      // Find target guitar string
      let targetStr = selectedString;
      
      if (autoStringDetection) {
        // Find closest string by frequency ratio
        let bestString = GUITAR_STRINGS[0];
        let minRatioDiff = 9999;
        GUITAR_STRINGS.forEach(s => {
          const ratioDiff = Math.abs(Math.log2(freq / s.freq));
          if (ratioDiff < minRatioDiff) {
            minRatioDiff = ratioDiff;
            bestString = s;
          }
        });
        targetStr = bestString;
        setSelectedString(bestString);
      }

      // Calculate deviation in musical cents
      const rawCents = 1200 * Math.log2(freq / targetStr.freq);

      // Exponential moving average for silky smooth needle motion
      smoothedCentsRef.current = smoothedCentsRef.current * 0.7 + rawCents * 0.3;
      const displayCents = Math.round(smoothedCentsRef.current);

      let status: 'in-tune' | 'flat' | 'sharp' = 'in-tune';
      if (displayCents < -4) status = 'flat';
      else if (displayCents > 4) status = 'sharp';

      setDetectedPitch({
        note: targetStr.cipher,
        freq: Math.round(freq * 10) / 10,
        cents: Math.max(-50, Math.min(50, displayCents)),
        status,
        confidence: Math.round(confidence * 100),
      });
    }

    animationFrameRef.current = requestAnimationFrame(detectPitchLoop);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header and explanation */}
      <div className="bg-[#1c120a] border border-amber-900/40 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-black text-amber-100">
              Afinador de Violão
            </h2>
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300">
              Padrão E-A-D-G-B-E
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-200/80">
            Afine cada uma das 6 cordas pelo som de referência acústico ou use o microfone para conferir o ponteiro.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition cursor-pointer select-none ${
              isListening
                ? 'bg-red-600 hover:bg-red-500 text-white ring-2 ring-red-400/50 animate-pulse'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Parar Microfone' : 'Ativar Microfone ao Vivo'}</span>
          </button>
        </div>
      </div>

      {/* Permission / Error Banner if access failed */}
      {micPermissionError && (
        <div className="bg-gradient-to-r from-red-950/80 via-[#210c0c] to-[#1a0a0a] border-2 border-red-600/60 rounded-2xl p-4 sm:p-5 shadow-xl text-red-200 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-white">Não foi possível acessar o microfone</h4>
              <p className="text-xs leading-relaxed text-red-200/90">{micPermissionError}</p>
            </div>
          </div>

          {/* Quick instructions to grant permission */}
          <div className="bg-[#120505] p-3 rounded-xl border border-red-900/60 text-xs space-y-2">
            <p className="font-semibold text-amber-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Como liberar o microfone no seu navegador:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-amber-100/90 text-[11px]">
              <li>Clique no ícone de <strong>cadeado</strong> ou <strong>configurações do site</strong> ao lado do endereço do site (URL).</li>
              <li>Procure pela opção <strong>Microfone</strong> e mude para <strong>Permitir</strong>.</li>
              <li>Recarregue a página ou clique em <strong>Tentar Novamente</strong>.</li>
            </ol>
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={startListening}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tentar Novamente</span>
              </button>
              <span className="text-[11px] text-amber-400/80">
                Ou use os botões das cordas abaixo para afinar pelo som de referência (funciona 100% offline)!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Tuner Gauge Console */}
      <div className="bg-gradient-to-b from-[#24170d] to-[#160d07] border border-amber-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        {/* Mode Selector (Auto vs Manual String lock) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-900/40 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold">Modo de Detecção:</span>
            <button
              onClick={() => setAutoStringDetection(true)}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                autoStringDetection
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'bg-[#180f08] text-amber-300/70 border border-amber-900/40'
              }`}
            >
              Automático (Qualquer Corda)
            </button>
            <button
              onClick={() => setAutoStringDetection(false)}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                !autoStringDetection
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'bg-[#180f08] text-amber-300/70 border border-amber-900/40'
              }`}
            >
              Corda Fixa ({selectedString.number}ª - {selectedString.cipher})
            </button>
          </div>

          {/* Real-time input volume meter when mic is listening */}
          {isListening && (
            <div className="flex items-center gap-2 bg-[#120a05] px-3 py-1 rounded-xl border border-amber-950">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] text-amber-300">Sinal:</span>
              <div className="w-20 bg-stone-900 h-2 rounded-full overflow-hidden border border-stone-800">
                <div
                  className={`h-full transition-all duration-75 ${
                    micVolumeLevel > 15 ? 'bg-emerald-400' : 'bg-amber-500'
                  }`}
                  style={{ width: `${micVolumeLevel}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-amber-400/80">{micVolumeLevel}%</span>
            </div>
          )}
        </div>

        {/* Large Note Display */}
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-amber-400/80 font-bold">
            {isListening ? (autoStringDetection ? 'Corda Detectada' : 'Afinando Corda') : 'Corda Selecionada'}
          </span>
          <div className="flex items-center justify-center gap-4">
            <span className="text-6xl sm:text-8xl font-black text-amber-100 tracking-tight">
              {isListening && detectedPitch.freq > 0 ? detectedPitch.note : selectedString.cipher}
            </span>
            <div className="text-left">
              <span className="text-xl sm:text-2xl font-bold text-amber-400 block">
                {selectedString.noteNamePt}
              </span>
              <span className="text-xs font-mono text-amber-300/70 block">
                {selectedString.number}ª Corda (Padrão: {selectedString.freq} Hz)
              </span>
              {isListening && detectedPitch.freq > 0 && (
                <span className="text-[11px] font-mono text-amber-200/90 block mt-0.5">
                  Atual: {detectedPitch.freq} Hz
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cents Gauge Needle */}
        <div className="space-y-3 max-w-lg mx-auto">
          <div className="relative h-12 flex items-center justify-center">
            {/* Center tick indicator */}
            <div className="absolute top-0 bottom-0 w-1 bg-emerald-400 z-10 rounded shadow-glow" />

            {/* Gauge Background Bar */}
            <div className="w-full h-4 rounded-full bg-[#100a05] border-2 border-amber-950 flex overflow-hidden">
              <div className="w-1/2 bg-gradient-to-r from-red-600/40 via-amber-500/40 to-emerald-500/50" />
              <div className="w-1/2 bg-gradient-to-r from-emerald-500/50 via-amber-500/40 to-red-600/40" />
            </div>

            {/* Dynamic Needle Pin */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-9 rounded-full border-2 border-stone-950 shadow-xl transition-all duration-100 ${
                detectedPitch.status === 'in-tune' && isListening && detectedPitch.freq > 0
                  ? 'bg-emerald-400 ring-4 ring-emerald-400/40 scale-110'
                  : 'bg-amber-400'
              }`}
              style={{
                left: `${Math.min(95, Math.max(5, 50 + (isListening ? detectedPitch.cents : 0)))}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          {/* Scale labels */}
          <div className="flex justify-between text-xs font-mono text-amber-400/80 px-2">
            <span>-50¢ (Muito Grave)</span>
            <span className="text-emerald-400 font-extrabold">0¢ (Afinado)</span>
            <span>+50¢ (Muito Agudo)</span>
          </div>

          {/* Status Diagnostic Message */}
          <div className="pt-2">
            {isListening ? (
              detectedPitch.freq === 0 ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs">
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  Toque a {selectedString.number}ª corda ({selectedString.cipher}) próxima ao microfone...
                </span>
              ) : detectedPitch.status === 'in-tune' ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Perfeitamente Afinado! ({detectedPitch.cents > 0 ? `+${detectedPitch.cents}` : detectedPitch.cents} cents)
                </span>
              ) : detectedPitch.status === 'flat' ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-950 border border-amber-500 text-amber-200 text-xs font-bold">
                  Nota Baixa ({detectedPitch.cents}¢): Aperte a tarraxa para esticar a corda
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-950 border border-red-500 text-red-200 text-xs font-bold">
                  Nota Alta (+{detectedPitch.cents}¢): Afrouxe um pouco a tarraxa
                </span>
              )
            ) : (
              <span className="text-xs text-amber-300/80">
                Clique nos botões das cordas abaixo para ouvir o som de referência ou ative o microfone
              </span>
            )}
          </div>
        </div>

        {/* The 6 Guitar Strings Reference Selector */}
        <div className="space-y-2 pt-4 border-t border-amber-900/40">
          <div className="flex items-center justify-between text-xs text-amber-300/80">
            <span className="font-semibold text-amber-300">Som de Referência Acústico das 6 Cordas:</span>
            <span>Toque para ouvir a frequência exata</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {GUITAR_STRINGS.map(str => {
              const isSelected = selectedString.index === str.index;
              const isLooping = activeLoopString === str.index;

              return (
                <div
                  key={str.name}
                  className={`p-3 rounded-2xl border transition-all text-center space-y-2 ${
                    isSelected
                      ? 'bg-amber-600/25 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-[#1a1007] border-amber-950 text-amber-200/80 hover:bg-amber-950/40'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-amber-400/70 font-mono block">
                      {str.number}ª Corda
                    </span>
                    <span className="text-2xl font-black text-amber-200">{str.cipher}</span>
                    <span className="text-[11px] text-amber-300/80 block">{str.noteNamePt}</span>
                    <span className="text-[10px] text-amber-400/60 font-mono">{str.freq} Hz</span>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <button
                      onClick={() => handlePlayString(str)}
                      className="w-full py-1.5 rounded-lg bg-amber-700/50 hover:bg-amber-600 text-amber-100 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      title={`Tocar som de referência de ${str.name}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Ouvir</span>
                    </button>
                    <button
                      onClick={() => toggleLoop(str)}
                      className={`w-full py-1 rounded-lg text-[10px] font-semibold transition cursor-pointer border ${
                        isLooping
                          ? 'bg-amber-500 text-stone-950 border-amber-300 font-bold'
                          : 'bg-[#120a05] text-amber-300/70 border-amber-900/40 hover:text-amber-200'
                      }`}
                      title="Tocar som continuamente em loop para afinar com calma"
                    >
                      {isLooping ? 'Parar Loop' : 'Loop Contínuo'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
