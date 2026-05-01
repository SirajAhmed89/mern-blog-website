export default function AboutSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Admin Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/200?img=12"
                  alt="Admin"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary-100 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                  Admin
                </div>
              </div>
            </div>

            {/* About Text */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
                Hi, I'm Sarah Mitchell
              </h2>
              <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-4">
                Welcome to Chronicle! I created this platform to bring together passionate writers 
                and curious readers. Here, we explore ideas that matter—from technology and design 
                to business and lifestyle. Every story is carefully curated to inspire, inform, 
                and spark meaningful conversations.
              </p>
              <p className="text-sm text-neutral-500 italic">
                "Great stories have the power to change perspectives and connect communities."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

