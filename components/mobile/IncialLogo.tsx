'use client';

export const IncialLogo = () => {
  return (
    <svg
      width="200"
      height="160"
      viewBox="0 0 200 160"
      className="mx-auto"
      fill="none"
    >
      {/* Left circles forming the dot and body of 'i' */}
      <g>
        {/* Top small circle (dot of i) */}
        <circle cx="60" cy="30" r="20" fill="white" />
        
        {/* Bottom larger circle (body of i) */}
        <circle cx="60" cy="95" r="35" fill="white" />
      </g>

      {/* Right curved shape (stem of i) - rounded rectangle */}
      <g>
        <rect
          x="100"
          y="20"
          width="70"
          height="110"
          rx="35"
          ry="35"
          fill="white"
        />
      </g>

      {/* Text "incial" below logo */}
      <text
        x="100"
        y="155"
        fontSize="18"
        fontWeight="600"
        fill="white"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        incial
      </text>
    </svg>
  );
};
