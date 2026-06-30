import React from 'react';
import { Text } from 'react-native';

/**
 * Permite escrever <Button><Icon /> Texto</Button> como no React Native Web.
 * Strings/numbers soltos não são nós válidos em Pressable/View no React Native,
 * então embrulhamos cada um em <Text> automaticamente; ícones (elementos) passam direto.
 */
export function renderMixedChildren(children: React.ReactNode, textClassName?: string) {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return <Text className={textClassName}>{child}</Text>;
    }
    return child;
  });
}
