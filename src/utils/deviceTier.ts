/**
 * O(1) runtime hardware capability classification.
 * Ensures smooth rendering across 2 GB RAM phones, legacy PCs, and modern workstations.
 */
export type PerformanceTier = 'low' | 'mid' | 'high';

export interface DeviceProfile {
  tier: PerformanceTier;
  reducedMotion: boolean;
  isTouch: boolean;
  webglSupported: boolean;
  dpr: [number, number];
  targetFps: number;
  starCount: number;
  autoMount3D: boolean;
}

let cachedProfile: DeviceProfile | null = null;

function checkWebGLSupport(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export function getDeviceProfile(): DeviceProfile {
  if (cachedProfile) return cachedProfile;

  if (typeof window === 'undefined') {
    return {
      tier: 'mid',
      reducedMotion: false,
      isTouch: false,
      webglSupported: true,
      dpr: [1, 1.5],
      targetFps: 60,
      starCount: 400,
      autoMount3D: true,
    };
  }

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memoryGb = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : 4;
  const cores = typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : 4;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const isTouch =
    window.matchMedia?.('(pointer: coarse)').matches ||
    window.innerWidth < 768;
  const webglSupported = checkWebGLSupport();

  let tier: PerformanceTier = 'high';
  if (!webglSupported || reducedMotion || memoryGb <= 2 || cores <= 2) {
    tier = 'low';
  } else if (memoryGb <= 4 || cores <= 4 || isTouch) {
    tier = 'mid';
  }

  cachedProfile = {
    tier,
    reducedMotion,
    isTouch,
    webglSupported,
    dpr: tier === 'low' ? [1, 1] : tier === 'mid' ? [1, 1.5] : [1, 2],
    targetFps: tier === 'low' ? 30 : 60,
    starCount: tier === 'low' ? 0 : tier === 'mid' ? 280 : 700,
    // On 2 GB phones / legacy hardware, defer WebGL allocation until user taps "Launch 3D CAD"
    autoMount3D: tier !== 'low',
  };

  return cachedProfile;
}
