import GithubLogo from "../../assets/github-mark/github-mark.svg?react";
import MainLogo from "../../assets/monitoring.svg?react";

const links = [
    { target: "stockproject", href: "/", icon: MainLogo },
    {
        target: "github",
        href: "https://github.com/SeHIgh/STOCK-PROJECT",
        icon: GithubLogo,
    },
];

const Footer = () => {
    return (
        <footer className="flex flex-col justify-between items-center py-2.5 px-5 gap-4">
            <hr className="w-full" />
            <div className="flex flex-row justify-center gap-4">
                {links.map((link) => {
                    // iconMap에서 해당 아이콘 컴포넌트를 가져옴
                    const IconComponent = link.icon;
                    console.log(IconComponent);
                    return (
                        <a
                            key={link.target}
                            target={link.target}
                            href={link.href}
                            className="w-8.25 h-8"
                        >
                            <IconComponent className="transition duration-200 ease-in-out hover:scale-115 hover:opacity-70"/>
                        </a>
                    );
                })}
            </div>
            <p className="text-sm">© 2025 Stock Project Team.</p>
        </footer>
    );
};

export default Footer;
