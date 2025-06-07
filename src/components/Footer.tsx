import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-50 to-blue-50 border-t border-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center text-gray-600 text-sm">
          <p>© 2025 Lazyqu. All rights reserved.</p>
          <p className="mt-1">
            Website design and content created by{' '}
            <a
              href="https://github.com/Gilreon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              Gilreon Lee
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 