import React from "react";
import Footer from "./Layouts/Footer";
import Header from "./Layouts/Header";
import Main from "./Layouts/Main";

interface GradientBackgroundProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<GradientBackgroundProps> = ({ children }) => {
    return (
        <>
            <div className="w-dvw min-h-[calc(100dvh+72px)] h-100vh flex flex-col justify-start main-bg">
                <Header />
                <Main>{children}</Main>
                <Footer />
            </div>
        </>
    );
};

export default MainLayout;
