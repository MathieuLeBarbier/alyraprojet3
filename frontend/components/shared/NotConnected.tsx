import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const NotConnected = () => {
  return (
    <Alert variant="default | destructive">
        <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
                Please connect a wallet
            </AlertDescription>
    </Alert>
  )
}

export default NotConnected