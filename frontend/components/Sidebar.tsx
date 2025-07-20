import Link from 'next/link';

const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Clips', href: '/clips' },
  { name: 'AI Metadata', href: '/ai-metadata' },
  { name: 'Publishing', href: '/publishing' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Health', href: '/health' },
  { name: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold tracking-tight border-b border-gray-800">
        🎬 ClipConductor
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} legacyBehavior>
            <a className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors">
              {item.name}
            </a>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
