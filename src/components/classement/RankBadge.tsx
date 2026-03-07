/**
 * Circular rank badge used across leaderboard tabs.
 * Applies gold/silver/bronze coloring for top-3 positions.
 */
export function RankBadge({ rank }: { rank: number }) {
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        rank === 1
          ? "bg-yellow-500/20 text-yellow-500"
          : rank === 2
            ? "bg-muted text-muted-foreground"
            : rank === 3
              ? "bg-warning/20 text-warning"
              : "bg-muted/50 text-muted-foreground"
      }`}
    >
      {rank}
    </div>
  );
}
