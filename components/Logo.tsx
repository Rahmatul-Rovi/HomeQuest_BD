export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* House shape */}
        <path
          d="M24 6L6 20V42H18V30H30V42H42V20L24 6Z"
          fill="#16A34A"
        />
        {/* Search circle on top of house */}
        <circle cx="33" cy="16" r="9" fill="white" stroke="#16A34A" strokeWidth="2.5" />
        <circle cx="33" cy="16" r="5" fill="#16A34A" />
        <line x1="39.5" y1="22.5" x2="44" y2="27" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="text-xl font-bold text-gray-800">
        HomeQuest <span className="text-primary">BD</span>
      </span>
    </div>
  );
}