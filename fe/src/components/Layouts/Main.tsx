import React from "react";

interface GradientBackgroundProps {
    children: React.ReactNode;
}

const Main: React.FC<GradientBackgroundProps> = ({ children }) => {
    return (
        <main className="min-h-[calc(100dvh-72px)] h-[calc(100dvh-72px)] flex-1 flex flex-col items-center justify-center mx-auto max-w-dvw w-dvw">
            {children}
        </main>
    );
};

export default Main;