'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MdMonitor, MdDescription, MdAccountTree } from 'react-icons/md'

const navItems = [
  { href: '/', icon: MdMonitor, label: 'Monitor' },
  { href: '/traces', icon: MdAccountTree, label: 'Traces' },
  { href: '/logs', icon: MdDescription, label: 'Logs' }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-16 bg-gray-900 flex flex-col items-center py-4">
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={`p-3 rounded-lg mb-2 ${
            pathname === href
              ? 'bg-blue-500 text-white'
              : 'text-gray-400 hover:bg-gray-800'
          }`}
          title={label}
        >
          <Icon size={24} />
        </Link>
      ))}
    </div>
  )
} 