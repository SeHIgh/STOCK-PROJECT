import GithubLogo from "../../assets/github-mark/github-mark.svg?react";

const Footer = () => {
    return (
        <footer className="flex flex-col justify-between items-center py-2.5 px-5 gap-4">
            <hr className="w-full" />
            <a
                href="https://github.com/SeHIgh/STOCK-PROJECT"
                target="github"
                className="w-8.25 h-8"
            >
                <GithubLogo />
            </a>
            <p className="text-sm">© 2025 Stock Project Team.</p>
        </footer>
    );
};

export default Footer;
