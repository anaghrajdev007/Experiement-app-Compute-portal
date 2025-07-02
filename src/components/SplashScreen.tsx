import React from "react";

const SplashScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#10182B] text-white px-4">
      {/* Aurora Power Logo */}
      <img
        src="/apeg.png"
        alt="Aurora Power"
        className="w-48 mb-6 mix-blend-screen"
      />

      {/* Founder Image */}
      <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-700 mb-6">
        <img
          src="/spsp.png"
          alt="Founder"
          className="w-44 h-44 rounded-full object-cover border-4 border-gray-600 shadow-md mb-6"
        />
      </div>

      {/* Quote */}
      <p className="text-center text-lg italic max-w-md">
        "Let's together transform energy into compute… to power our future!"
      </p>
      <p className="text-sm mt-2 text-purple-400 text-center">
        – Sergio Paulo Miramontes de la Piedra, Founder Director
      </p>
    </div>
  );
};

export default SplashScreen;
