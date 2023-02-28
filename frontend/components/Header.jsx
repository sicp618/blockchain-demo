import { ConnectButton } from "@web3uikit/web3";

export default function Header() {
  return (
    <nav className="border-b-2">
      <div className="h-10 my-4 ml-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
}
