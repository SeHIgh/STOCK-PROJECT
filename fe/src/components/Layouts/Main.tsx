import React from "react";

interface GradientBackgroundProps {
    children: React.ReactNode;
}

const Main: React.FC<GradientBackgroundProps> = ({ children }) => {
    return (
        <main className="flex flex-col items-center justify-center mx-auto max-w-2xl min-h-dvh py-32 sm:py-48 lg:py-56">
            {children}
        </main>
    );
};

export default Main;