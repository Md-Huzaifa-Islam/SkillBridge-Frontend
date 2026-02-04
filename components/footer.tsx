import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SkillBridge</h3>
            <p className="text-gray-400">
              Connect with expert tutors and learn anything, anytime.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/tutors" className="hover:text-white transition">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Tutors</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Become a Tutor
                </Link>
              </li>
              <li>
                <Link
                  href="/tutor/dashboard"
                  className="hover:text-white transition"
                >
                  Tutor Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 SkillBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
