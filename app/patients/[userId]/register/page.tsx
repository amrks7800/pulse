import Link from "next/link"
import Image from "next/image"
import RegisterForm from "@/components/forms/RegisterForm"
import { getUser } from "@/lib/actions/patient.actions"

const RegisterPage = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId)
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container max-h-screen overflow-y-auto py-5">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src={"/assets/icons/logo-full.svg"}
            width={1000}
            height={1000}
            alt="patient"
            className="mb-10 h-10 w-fit"
          />

          <RegisterForm user={user} />

          <p className="copyright py-12">&copy; 2024 Pulse</p>
        </div>
      </section>

      <Image
        src={"/assets/images/register-img.png"}
        height={1000}
        width={1000}
        alt="patient"
        className="side-img w-[390px]"
      />
    </div>
  )
}
export default RegisterPage
