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

function parseDelta(delta: string): { value: string; description: string } {
  const match = delta.match(/^([\d.,]+%?)\s+(.*)$/);
  if (!match) return { value: delta, description: "" };
  return { value: match[1], description: match[2] };
}

export function CandidatesStats() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
          />
        );
      })}
    </div>
  );
}
