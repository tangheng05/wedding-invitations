import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function DebugPage() {
  // Get all guests for testing links
  const guests = await prisma.guest.findMany({
    take: 5, // Limit to 5 guests for testing
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Route Structure:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {`
/app
  /(guest)
    /[guestId]
      /page.tsx - Landing page
      /invitation
        /page.tsx - Full invitation
          `}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Links:</h2>
        <ul className="space-y-2">
          {guests.map(guest => (
            <li key={guest.id} className="bg-white p-4 rounded shadow">
              <p className="font-medium">{guest.name}</p>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">uniqueLink:</span> 
                  <span className="ml-2">{guest.uniqueLink}</span>
                </p>
                <div className="flex space-x-4 mt-2">
                  <Link 
                    href={`/guest/${guest.uniqueLink}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Landing Page
                  </Link>
                  <Link 
                    href={`/guest/${guest.uniqueLink}/invitation`}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Invitation Page
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Manual Test Links:</h2>
        <ul className="space-y-2">
          <li>
            <Link 
              href="/guest/jane-doe-002" 
              className="text-blue-500 hover:underline"
            >
              /guest/jane-doe-002
            </Link>
          </li>
          <li>
            <Link 
              href="/guest/jane-doe-002/invitation" 
              className="text-blue-500 hover:underline"
            >
              /guest/jane-doe-002/invitation
            </Link>
          </li>
          <li>
            <Link 
              href="/guest/bob-johnson-003" 
              className="text-blue-500 hover:underline"
            >
              /guest/bob-johnson-003
            </Link>
          </li>
          <li>
            <Link 
              href="/guest/bob-johnson-003/invitation" 
              className="text-blue-500 hover:underline"
            >
              /guest/bob-johnson-003/invitation
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
