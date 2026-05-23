export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">Safety information</a></li>
              <li><a href="#" className="hover:underline">Cancellation options</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Community</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Airbnb.org</a></li>
              <li><a href="#" className="hover:underline">Support refugees</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Hosting</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Try hosting</a></li>
              <li><a href="#" className="hover:underline">Resources</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Airbnb</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Newsroom</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-6 pt-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>© 2024 Airbnb Clone. Built with React + Node.js</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
