'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Frame } from '@/components/live-frame';
import type { HeroMedia as HeroMediaData } from '@/content/work';

/**
 * The home hero's media: one real desktop capture, a short loop of the same
 * screen playing over it, and a real phone capture overlapping its corner.
 *
 * The desktop poster is the real thing and the video is only a layer on top.
 * The poster is the LCP image and paints first. The video mounts after the page
 * has loaded, so it never competes with it, and its first frame is the poster,
 * so nothing flashes when it starts.
 *
 * REDUCED MOTION gets the poster only. The video is not rendered at all, so
 * nothing is hidden or paused: there is simply nothing running.
 *
 * The phone is a plain picture with a hairline, never a drawn bezel — "no fake
 * chrome" (DESIGN.md §4.9). It is separated from the desktop picture by a flat
 * ring of the surface colour, not a shadow: elevation on this site is flat,
 * with one scoped exception that is not the hero.
 */
export function HeroMedia({
  poster,
  posterMobile,
  alt,
  media,
}: {
  poster: string;
  posterMobile?: string;
  alt: string;
  media?: HeroMediaData;
}) {
  return (
    <div className={media?.phone ? 'relative mb-4' : 'relative'}>
      <Frame
        poster={poster}
        posterMobile={posterMobile}
        alt={alt}
        ratio="16/9"
        priority
        className="tg-hero-img"
      />
      {media?.video ? <HeroVideo mp4={media.video.mp4} webm={media.video.webm} /> : null}
      {media?.phone ? (
        <div className="tg-hero-phone absolute bottom-[-16px] left-[-12px] w-[27%] overflow-hidden rounded-[14px] border lg:left-[-28px] lg:w-[20%]">
          <Image
            src={media.phone.src}
            alt={media.phone.alt}
            width={780}
            height={1250}
            sizes="(max-width: 1023px) 30vw, 15vw"
            className="block h-auto w-full"
          />
        </div>
      ) : null}
    </div>
  );
}

function HeroVideo({ mp4, webm }: { mp4: string; webm: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const start = () => setOn(true);
    if (document.readyState === 'complete') {
      start();
      return;
    }
    window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, []);

  if (!on) return null;

  return (
    // `tg-hero-img` carries the same corner radii as the poster beneath it.
    // `inset-px` keeps the frame's own 1px hairline visible.
    <div className="tg-hero-img pointer-events-none absolute inset-px overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        className="h-full w-full object-cover object-top"
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  );
}
