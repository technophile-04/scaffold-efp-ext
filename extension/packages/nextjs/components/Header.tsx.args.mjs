// EFP Extension - Header navigation links
export const preContent = `import { UserCircleIcon } from "@heroicons/react/24/outline";

// EFP Diamond Logo Component
const EfpIcon = ({ className }) => (
  <svg className={className} viewBox="100 80 350 400" fill="currentColor">
    <path d="M167.68 258.56L255.36 112.64L342.4 258.56L255.36 311.68L167.68 258.56Z" />
    <path d="M255.36 327.68L167.68 274.56L255.36 398.08L342.4 274.56L255.36 327.68Z" />
    <path d="M367.36 341.76H342.4V378.88H307.84V401.92H342.4V440.32H367.36V401.92H401.28V378.88H367.36V341.76Z" />
  </svg>
);`;

export const extraMenuLinksObjects = [
  {
    label: "EFP",
    href: "/efp",
    icon: '$$<EfpIcon className="h-4 w-4" />$$',
  },
  {
    label: "Profile Preview",
    href: "/efp-example",
    icon: '$$<UserCircleIcon className="h-4 w-4" />$$',
  },
];

