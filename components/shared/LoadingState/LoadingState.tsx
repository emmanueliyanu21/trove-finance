import styles from "./LoadingState.module.css";

const SKELETON_HEIGHTS = [140, 90, 220];

export function DashboardSkeleton() {
  return (
    <div className={styles.wrap} aria-busy="true" aria-label="Loading portfolio">
      {SKELETON_HEIGHTS.map((height) => (
        <div key={height} className={styles.skeleton} style={{ height }} />
      ))}
    </div>
  );
}
