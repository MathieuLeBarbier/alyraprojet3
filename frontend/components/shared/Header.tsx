import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
    return (
        <header className="bg-gray-500 p-4 flex justify-between items-center">
            <div>Logo</div>
            <div>
                <ConnectButton />
            </div>
        </header>
    )
}

export default Header;