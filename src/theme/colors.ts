// Cores de marca do SIGEA/IFMS, em formato JS puro — usadas onde className do
// NativeWind não chega (props de cor de ícones, expo-linear-gradient, etc).
// Os mesmos hex também estão disponíveis via classes Tailwind, ex: bg-[#1f3c68].
export const brand = {
  navy: '#1f3c68',
  navyDark: '#163056',
  navyLight: '#2d5a8f',
  green: '#28a36b',
};

export const heroGradient = [brand.navy, brand.navyLight] as const;
export const loginButtonGradient = ['#143f74', '#1f5ea4', '#1f8c6d'] as const;
export const occupancyGradient = ['#1f5ea4', '#1f8c6d'] as const;
export const logoGradient = ['#22c55e', '#15803d'] as const; // green-500 -> green-700
