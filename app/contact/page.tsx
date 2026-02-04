import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

        <p className="text-lg text-gray-700 mb-8">
          Have questions? We'd love to hear from you. Send us a message and
          we'll respond as soon as possible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">support@skillbridge.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-blue-600" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                123 Education St, Learning City, LC 12345
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
