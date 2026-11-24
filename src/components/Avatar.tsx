import { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  initials: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ src, alt, initials, size = 'md' }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClass =
    size === 'sm'
      ? 'h-7 w-7 text-[11px]'
      : size === 'lg'
        ? 'h-11 w-11 text-sm'
        : 'h-9 w-9 text-xs';

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${sizeClass} rounded-full object-cover border border-[#E8EAF2] shrink-0 bg-[#F0F2F8]`}
      />
    );
  }

  return (
    <div
      aria-label={alt}
      className={`${sizeClass} rounded-full bg-[#EAEDFF] text-[#252B48] border border-[#DCE2F9] font-semibold flex items-center justify-center shrink-0 select-none`}
    >
      {initials}
    </div>
  );
}
