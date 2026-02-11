import Link from "next/link";
import {
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <h3 className="text-xl font-bold">🎓 SkillBridge</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connect with expert tutors and unlock your potential. Learn
              anything, anytime, anywhere.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 dark:bg-gray-800/80 flex items-center justify-center hover:bg-blue-600 transition"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 dark:bg-gray-800/80 flex items-center justify-center hover:bg-blue-600 transition"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 dark:bg-gray-800/80 flex items-center justify-center hover:bg-gray-700 transition"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">For Students</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link
                  href="/tutors"
                  className="hover:text-blue-400 transition flex items-center gap-2"
                >
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-blue-400 transition flex items-center gap-2"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-blue-400 transition flex items-center gap-2"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">For Tutors</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link
                  href="/register"
                  className="hover:text-blue-400 transition flex items-center gap-2"
                >
                  Become a Tutor
                </Link>
              </li>
              <li>
                <Link
                  href="/tutor/dashboard"
                  className="hover:text-blue-400 transition flex items-center gap-2"
                >
                  Tutor Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/tutor/profile"
                  className="hover:text-blue-400 transition flex items-center gap-2"
                >
                  Manage Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                support@skillbridge.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-400 mt-0.5" />
                <span>
                  123 Learning Street,
                  <br />
                  Education City, EC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-800/80 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} SkillBridge. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
              <Link href="#" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
