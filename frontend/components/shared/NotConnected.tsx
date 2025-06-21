import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"

const NotConnected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen -mt-26">
      <Alert variant="default" className="flex flex-col items-center justify-between gap-2">
        <Image src="/LOGO_white.svg" alt="Logo" width={32} height={32} className="h-10 sm:h-12 w-24 object-contain" priority />
        <>
          <AlertTitle>Connect your wallet</AlertTitle>
          <AlertDescription>
            This page is only available for connected users
          </AlertDescription>
        </>
        <ConnectButton />
      </Alert>
    </div>
  )
}

export default NotConnected