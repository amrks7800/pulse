"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { decryptKey, encryptKey } from "@/lib/utils"

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { MouseEvent, useEffect, useState } from "react"

const PasskeyModal = () => {
  const [open, setOpen] = useState(true)
  const [passkey, setPasskey] = useState("")
  const [error, setError] = useState("")
  const path = usePathname()
  const router = useRouter()

  const encryptedKey =
    typeof window !== "undefined" ? localStorage.getItem("accessKey") : null

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey)

    if (path) {
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setOpen(false)

        router.push("/admin")
      } else {
        setOpen(true)
      }
    }
  }, [encryptedKey])

  const validatePasskey = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault()

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey)

      localStorage.setItem("accessKey", encryptedKey)

      setOpen(false)

      router.push("/admin")
    } else {
      setError("Invalid Passkey, please try again")
    }
  }

  const closeModal = () => {
    setOpen(false)

    router.push("/")
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin access verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="">
          <InputOTP maxLength={6} value={passkey} onChange={setPasskey}>
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className="h-4 mt-4">
            {error && (
              <p className="shad-error text-14-regular flex justify-center">
                {error}
              </p>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={e => validatePasskey(e)}
            className="shad-primary-btn w-full"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default PasskeyModal
