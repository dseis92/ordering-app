export default function Badge({ count }) {
  if (!count) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 bg-fern text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {count > 99 ? "99+" : count}
    </span>
  );
}
