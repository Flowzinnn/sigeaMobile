import { ImageOff } from 'lucide-react-native';
import { useState } from 'react';
import { Image, View, type ImageProps } from 'react-native';

import { cn } from '@/lib/cn';

interface ImageWithFallbackProps extends Omit<ImageProps, 'source'> {
  src: string;
  className?: string;
}

export function ImageWithFallback({ src, className, style, ...rest }: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  if (didError) {
    return (
      <View className={cn('items-center justify-center bg-gray-100 dark:bg-zinc-800', className)} style={style}>
        <ImageOff size={32} color="#9ca3af" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: src }}
      className={className}
      style={style}
      onError={() => setDidError(true)}
      {...rest}
    />
  );
}
