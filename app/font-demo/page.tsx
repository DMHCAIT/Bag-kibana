"use client";

export default function FontDemo() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{fontFamily: 'var(--font-abhaya)'}}>
            Abhaya Libre Font Demo
          </h1>
          <p className="text-lg text-gray-600" style={{fontFamily: 'var(--font-abhaya)'}}>
            Showcasing the beautiful Abhaya Libre font in your KIBANA project
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Font Weights Demo */}
          <section>
            <h2 className="text-2xl font-semibold mb-8 border-b pb-4" style={{fontFamily: 'var(--font-abhaya)'}}>
              Font Weights
            </h2>
            <div className="space-y-4">
              <div className="text-lg" style={{fontFamily: 'var(--font-abhaya)', fontWeight: '400'}}>
                Regular 400 - The quick brown fox jumps over the lazy dog
              </div>
              <div className="text-lg" style={{fontFamily: 'var(--font-abhaya)', fontWeight: '500'}}>
                Medium 500 - The quick brown fox jumps over the lazy dog
              </div>
              <div className="text-lg" style={{fontFamily: 'var(--font-abhaya)', fontWeight: '600'}}>
                Semi Bold 600 - The quick brown fox jumps over the lazy dog
              </div>
              <div className="text-lg" style={{fontFamily: 'var(--font-abhaya)', fontWeight: '700'}}>
                Bold 700 - The quick brown fox jumps over the lazy dog
              </div>
              <div className="text-lg" style={{fontFamily: 'var(--font-abhaya)', fontWeight: '800'}}>
                Extra Bold 800 - The quick brown fox jumps over the lazy dog
              </div>
            </div>
          </section>

          {/* Headlines and Titles */}
          <section>
            <h2 className="text-2xl font-semibold mb-8 border-b pb-4" style={{fontFamily: 'var(--font-abhaya)'}}>
              Headlines & Titles
            </h2>
            <div className="space-y-6">
              <h1 className="text-5xl font-bold tracking-wide" style={{fontFamily: 'var(--font-abhaya)'}}>
                KIBANA - Luxury Handbags
              </h1>
              <h2 className="text-4xl font-semibold tracking-wider" style={{fontFamily: 'var(--font-abhaya)'}}>
                NEW COLLECTION
              </h2>
              <h3 className="text-3xl font-medium tracking-wide" style={{fontFamily: 'var(--font-abhaya)'}}>
                BESTSELLERS
              </h3>
              <h4 className="text-2xl font-medium" style={{fontFamily: 'var(--font-abhaya)'}}>
                Featured Products
              </h4>
            </div>
          </section>

          {/* Body Text */}
          <section>
            <h2 className="text-2xl font-semibold mb-8 border-b pb-4" style={{fontFamily: 'var(--font-abhaya)'}}>
              Body Text Examples
            </h2>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed" style={{fontFamily: 'var(--font-abhaya)'}}>
                Discover our luxurious collection of premium handbags, crafted with the finest materials 
                and attention to detail. Each piece tells a story of elegance, sophistication, and timeless style.
              </p>
              <p className="text-base leading-relaxed" style={{fontFamily: 'var(--font-abhaya)'}}>
                From everyday essentials to statement pieces, our curated selection offers something 
                for every occasion. Experience the perfect blend of functionality and fashion.
              </p>
            </div>
          </section>

          {/* Product Names */}
          <section>
            <h2 className="text-2xl font-semibold mb-8 border-b pb-4" style={{fontFamily: 'var(--font-abhaya)'}}>
              Product Names & Prices
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xl font-medium" style={{fontFamily: 'var(--font-abhaya)'}}>
                  VISTARA TOTE - Teal Blue
                </h3>
                <p className="text-lg" style={{fontFamily: 'var(--font-abhaya)'}}>
                  ₹4,999
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium" style={{fontFamily: 'var(--font-abhaya)'}}>
                  PRIZMA SLING - Mint Green
                </h3>
                <p className="text-lg" style={{fontFamily: 'var(--font-abhaya)'}}>
                  ₹3,999
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium" style={{fontFamily: 'var(--font-abhaya)'}}>
                  VISTAPACK - Mocha Tan
                </h3>
                <p className="text-lg" style={{fontFamily: 'var(--font-abhaya)'}}>
                  ₹4,499
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium" style={{fontFamily: 'var(--font-abhaya)'}}>
                  SANDESH LAPTOP BAG - Teal Blue
                </h3>
                <p className="text-lg" style={{fontFamily: 'var(--font-abhaya)'}}>
                  ₹6,499
                </p>
              </div>
            </div>
          </section>

          {/* CSS Utility Classes */}
          <section>
            <h2 className="text-2xl font-semibold mb-8 border-b pb-4" style={{fontFamily: 'var(--font-abhaya)'}}>
              CSS Utility Classes
            </h2>
            <div className="space-y-4">
              <div className="font-abhaya text-lg">
                .font-abhaya - Regular Abhaya Libre font
              </div>
              <div className="font-abhaya-display text-2xl">
                .font-abhaya-display - Display text with tracking
              </div>
              <div className="font-abhaya-heading text-3xl">
                .font-abhaya-heading - Bold headings with spacing
              </div>
            </div>
          </section>

          {/* Usage Guide */}
          <section className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6" style={{fontFamily: 'var(--font-abhaya)'}}>
              How to Use Abhaya Libre
            </h2>
            <div className="space-y-4" style={{fontFamily: 'var(--font-abhaya)'}}>
              <div>
                <h4 className="font-semibold text-lg mb-2">Method 1: Inline Styles</h4>
                <code className="bg-white p-2 rounded text-sm block">
                  {`style={{fontFamily: 'var(--font-abhaya)'}}`}
                </code>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Method 2: CSS Classes</h4>
                <code className="bg-white p-2 rounded text-sm block">
                  className="font-abhaya"
                </code>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Method 3: Tailwind Config (if using)</h4>
                <code className="bg-white p-2 rounded text-sm block">
                  className="font-display"
                </code>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}