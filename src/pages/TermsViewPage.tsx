import { useNavigate } from 'react-router-dom';
import { ChefHat, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TermsViewPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChefHat className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">FitRecipes</span>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Terms Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Terms of Service & Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Terms of Service Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-200">
                Terms of Service
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-base leading-relaxed">
                  Welcome to FitRecipes! By using our platform, you agree to the following terms and
                  conditions. Please read them carefully before using our services.
                </p>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 mt-6">
                    1. Acceptance of Terms
                  </h3>
                  <p className="leading-relaxed">
                    By accessing or using FitRecipes, you agree to be bound by these Terms of
                    Service and all applicable laws and regulations. If you do not agree with any of
                    these terms, you are prohibited from using or accessing this platform.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">
                    2. User Responsibilities
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You will use the platform in accordance with all applicable laws</li>
                    <li>You are responsible for maintaining the confidentiality of your account</li>
                    <li>You must not share your account credentials with others</li>
                    <li>You are responsible for all activities that occur under your account</li>
                    <li>You must notify us immediately of any unauthorized use of your account</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">
                    3. Content Guidelines
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Content you submit must be original or properly attributed</li>
                    <li>You retain ownership of your original content</li>
                    <li>You grant us a license to use, display, and distribute your content</li>
                    <li>We reserve the right to remove content that violates our guidelines</li>
                    <li>
                      Prohibited content includes: hate speech, harassment, spam, illegal content
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">4. Recipe Submission</h3>
                  <p className="leading-relaxed">
                    Users with Chef or Admin roles may submit recipes. All recipes are subject to
                    review and approval. We reserve the right to reject or remove any recipe that
                    doesn't meet our quality standards or violates our guidelines.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">
                    5. Intellectual Property
                  </h3>
                  <p className="leading-relaxed">
                    The FitRecipes platform, including its design, features, and functionality, is
                    owned by us and protected by intellectual property laws. You may not copy,
                    modify, distribute, or create derivative works without our permission.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">6. Termination</h3>
                  <p className="leading-relaxed">
                    We may terminate or suspend your account at any time, without prior notice, for
                    conduct that we believe violates these Terms or is harmful to other users, us,
                    or third parties, or for any other reason.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">
                    7. Disclaimer of Warranties
                  </h3>
                  <p className="leading-relaxed">
                    The platform is provided "as is" without any warranties, express or implied. We
                    do not warrant that the service will be uninterrupted, error-free, or secure.
                    Use of recipes and nutritional information is at your own risk.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">
                    8. Limitation of Liability
                  </h3>
                  <p className="leading-relaxed">
                    We shall not be liable for any indirect, incidental, special, consequential, or
                    punitive damages resulting from your use of the platform or any content therein.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Policy Section */}
            <div className="pt-8 border-t-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-200">
                Privacy Policy
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-base leading-relaxed">
                  We collect and process your personal information to provide you with our services.
                  Your privacy is important to us, and we are committed to protecting your data.
                </p>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 mt-6">
                    1. Information We Collect
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Account Information:</strong> Name, email address, password
                      (encrypted)
                    </li>
                    <li>
                      <strong>Profile Information:</strong> Avatar, bio, preferences
                    </li>
                    <li>
                      <strong>Content:</strong> Recipes, comments, ratings you create
                    </li>
                    <li>
                      <strong>Usage Data:</strong> Pages visited, features used, time spent
                    </li>
                    <li>
                      <strong>OAuth Information:</strong> When you sign in with Google, we receive
                      your name, email, and profile picture
                    </li>
                    <li>
                      <strong>Device Information:</strong> Browser type, operating system, IP
                      address
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">
                    2. How We Use Your Information
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>To provide and maintain our services</li>
                    <li>To notify you about changes to our service</li>
                    <li>To provide customer support</li>
                    <li>To gather analysis or valuable information to improve our service</li>
                    <li>To monitor the usage of our service</li>
                    <li>To detect, prevent, and address technical issues</li>
                    <li>To send you personalized recipe recommendations</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">
                    3. Data Storage and Security
                  </h3>
                  <p className="leading-relaxed">
                    Your data is stored securely using industry-standard encryption. We implement
                    appropriate security measures to protect against unauthorized access,
                    alteration, disclosure, or destruction of your personal information.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">4. Data Sharing</h3>
                  <p className="leading-relaxed">
                    We do not sell, trade, or rent your personal information to third parties. We
                    may share your information with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Service providers who assist us in operating our platform</li>
                    <li>Law enforcement if required by law</li>
                    <li>Other users (only public information like recipes and comments)</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">
                    5. Cookies and Tracking
                  </h3>
                  <p className="leading-relaxed">
                    We use cookies and similar tracking technologies to track activity on our
                    service and hold certain information. You can instruct your browser to refuse
                    all cookies or to indicate when a cookie is being sent.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">6. Your Rights</h3>
                  <p className="leading-relaxed">You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to processing of your data</li>
                    <li>Request transfer of your data</li>
                    <li>Withdraw consent at any time</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">7. Data Retention</h3>
                  <p className="leading-relaxed">
                    We retain your personal information only for as long as necessary to provide you
                    with our services and as required by law. You can request deletion of your
                    account and data at any time through your account settings.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">
                    8. Children's Privacy
                  </h3>
                  <p className="leading-relaxed">
                    Our service is not intended for users under the age of 13. We do not knowingly
                    collect personal information from children under 13. If you are a parent or
                    guardian and believe your child has provided us with personal information,
                    please contact us.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">
                    9. Changes to Privacy Policy
                  </h3>
                  <p className="leading-relaxed">
                    We may update our Privacy Policy from time to time. We will notify you of any
                    changes by posting the new Privacy Policy on this page and updating the "Last
                    Updated" date.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">10. Contact Us</h3>
                  <p className="leading-relaxed">
                    If you have any questions about these Terms or Privacy Policy, please contact us
                    at:
                  </p>
                  <ul className="list-none space-y-1 ml-4">
                    <li>Email: support@fitrecipes.com</li>
                    <li>Address: [Your Company Address]</li>
                  </ul>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Last Updated:</strong> October 7, 2025
                  </p>
                </div>
              </div>
            </div>

            {/* Back Button at Bottom */}
            <div className="pt-6 flex justify-center">
              <Button onClick={() => navigate(-1)} size="lg" className="px-8">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Previous Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
