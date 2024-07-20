import PatientForm from "@/components/forms/PatientForm"
import PasskeyModal from "@/components/PasskeyModal"
import Image from "next/image"
import Link from "next/link"

const Home = ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams.admin === "true"

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}
      <section className="remove-scrollbar container my-auto max-h-screen overflow-y-auto">
        <div className="sub-container max-w-[496px] ">
          <Image
            src={"/assets/icons/logo-full.svg"}
            width={1000}
            height={1000}
            alt="patient"
            className="mb-10 h-10 w-fit"
          />
          <PatientForm />
          <div className="text-14-regular mt-10 flex justify-between">
            <p className="justify-end text-dark-600 xl:text-left">
              &copy; 2024 Pulse
            </p>
            <Link href={"/?admin=true"} className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src={"/assets/images/onboarding-img.png"}
        height={1000}
        width={1000}
        alt="patient"
        className="side-img w-1/2"
      />
    </div>
  )
}
export default Home
