import { ConnectButton } from "@rainbow-me/rainbowkit";

export const connectButton = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <ConnectButton />
    </div>
  );
};