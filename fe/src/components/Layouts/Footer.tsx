import GithubLogo from "../../assets/github-mark/github-mark.svg?react";

const links = [
    // { target: "antrading", href: "/", icon: MainLogo },
    {
        target: "github",
        href: "https://github.com/SeHIgh/STOCK-PROJECT",
        icon: GithubLogo,
    },
];

const Footer = () => {
    return (
        <footer className="flex flex-col justify-between items-center h-26 py-2.5 px-5 gap-4">
            <hr className="w-full border-neutral-400 border-1" />
            <div className="flex flex-row justify-center gap-4">
                {links.map((link) => {
                    // iconMap에서 해당 아이콘 컴포넌트를 가져옴
                    const IconComponent = link.icon;
                    return (
                        <a
                            key={link.target}
                            target={link.target}
                            href={link.href}
                            className="w-8.25 h-8"
                        >
                            <IconComponent className="transition duration-200 ease-in-out hover:scale-115 hover:opacity-70" />
                        </a>
                    );
                })}
            </div>
            <div className="flex flex-row items-center gap-2">
                <p className="text-sm">© 2025 AnTrading Co.</p>{" "}
                {/* <MainLogo className="w-30 h-auto -translate-y-3" /> */}
                <a href="/main">
                    <img
                        alt=""
                        src="/AnTrading_Logo_mini_color_neautral.svg"
                        className="w-10 transition duration-600 ease-in-out rotate-y-180 hover:scale-115 hover:opacity-70
                        hover:-rotate-20 hover:-translate-y-1.5
                        "
                    />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
