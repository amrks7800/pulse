import { ReactNode } from "react"
import { Button } from "./ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"

type Props = {
  isLoading: boolean
  className?: string
  children: ReactNode
}

const SubmitButton = ({ isLoading, className, children }: Props) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={cn(className, "shad-primary-btn w-full")}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt=""
            width={24}
            height={24}
            className="animate-spin"
            aria-hidden
          />
          <span>loading...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  )
}
export default SubmitButton
