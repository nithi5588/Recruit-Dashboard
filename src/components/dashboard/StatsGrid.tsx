import {
  ProfileAdd,
  Profile2User,
  TickCircle,
  Timer1,
  type IconProps as IconsaxProps,
} from "iconsax-reactjs";
import type { ComponentType } from "react";
import { StatCard, type StatTone } from "@/components/ui/StatCard";
import { stats, type Stat } from "@/lib/sample-data";

type IconsaxComponent = ComponentType<IconsaxProps>;

const TONE_MAP: Record<Stat["tone"], StatTone> = {
  purple: "primary",
  blue: "neutral",
  orange: "subtle",
  green: "strong",
};

const ICON_MAP: Record<Stat["tone"], IconsaxComponent> = {
  purple: Profile2User,
  blue: ProfileAdd,
  orange: Timer1,
  green: TickCircle,
};

const SPARKLINES: Record<Stat["tone"], number[]> = {
  purple: [14, 18, 16, 22, 20, 24, 28, 26, 32, 30, 36, 40],
  blue: [10, 12, 16, 14, 18, 22, 20, 24, 26, 30, 28, 32],
  orange: [28, 26, 24, 22, 20, 22, 20, 18, 20, 18, 16, 18],
  green: [4, 5, 6, 6, 8, 7, 9, 10, 11, 10, 12, 12],
};

function hrefFor(label: string): string {
  if (/total|new this/i.test(label)) return "/candidates";
  if (/in process/i.test(label)) return "/pipeline";
  if (/placement/i.test(label)) return "/pipeline";
  return "/candidates";
}

function parseDelta(delta: string): { value: string; description: string } {
  const match = delta.match(/^([\d.,]+%?)\s+(.*)$/);
  if (!match) return { value: delta, description: "" };
  return { value: match[1], description: match[2] };
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => {
        const Icon = ICON_MAP[s.tone];
        const tone = TONE_MAP[s.tone];
        const { value, description } = parseDelta(s.delta);
        return (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            tone={tone}
            href={hrefFor(s.label)}
            icon={
              <Icon
                size={20}
                color="currentColor"
                variant={s.tone === "green" ? "Bold" : "Bulk"}
              />
            }
            trend={{
              direction: s.deltaDirection,
              value,
              description,
            }}
            spark={SPARKLINES[s.tone]}
          />
        );
      })}
    </div>
  );
}
