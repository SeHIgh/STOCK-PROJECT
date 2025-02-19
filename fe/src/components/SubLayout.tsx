import React from "react";
import Footer from "./Layouts/Footer";
import Header from "./Layouts/Header";
import Main from "./Layouts/Main";

interface GradientBackgroundProps {
    children: React.ReactNode;
}

const SubLayout: React.FC<GradientBackgroundProps> = ({ children }) => {
    return (
        <>
            <div className="w-dvw h-100vh flex flex-col justify-start main-bg">
                <Header />
                <Main>{children}</Main>
            </div>
        </>
    );
};

export default SubLayout;
