"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { ReactNode, useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldTypes } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants"
import { Label } from "@radix-ui/react-label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"

export default function RegisterForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true)

    let formData

    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      })

      formData = new FormData()

      formData.append("blobFile", blobFile)
      formData.append("fileName", values.identificationDocument[0].name)
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      }

      // @ts-ignore
      const patient = await registerPatient(patientData)

      if (patient) router.push(`/patients/${user.$id}/new-appointment`)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal information</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.INPUT}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <FormWrapper>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.INPUT}
            name="email"
            label="email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.PHONE_INPUT}
            name="phone"
            label="Phone number"
            placeholder="+201012344321"
          />
        </FormWrapper>

        <FormWrapper>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.DATE_PICKER}
            name="birthDate"
            label="Date of Birth"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.SKELETON}
            name="gender"
            label="Gender"
            renderSkeleton={field => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map(option => (
                    <div className="radio-group" key={option}>
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </FormWrapper>

        <FormWrapper>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.INPUT}
            name="address"
            label="address"
            placeholder="johndoe@gmail.com st New York"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.INPUT}
            name="occupation"
            label="occupation"
            placeholder="Software engineer"
          />
        </FormWrapper>

        <FormWrapper>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.INPUT}
            name="emergencyContactName"
            label="Emergency contact name"
            placeholder="Guardian's name"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.PHONE_INPUT}
            name="emergencyContactNumber"
            label="Emergency contact number"
            placeholder="+201012344321"
          />
        </FormWrapper>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical information</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.SELECT}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a Physician"
        >
          {Doctors.map(doctor => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt={doctor.name}
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <FormWrapper>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.INPUT}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="BlueCross BlueShield"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.INPUT}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="ABC123456789"
          />
        </FormWrapper>

        <FormWrapper>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.TEXTAREA}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, penicillin, and Pollen"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.TEXTAREA}
            name="currentMedication"
            label="Current Medication (if any)"
            placeholder="Ibuprofin..."
          />
        </FormWrapper>

        <FormWrapper>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.TEXTAREA}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="Mother had...."
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.TEXTAREA}
            name="pastMedicalHistory"
            label="Past medical history"
            placeholder="appendectomy"
          />
        </FormWrapper>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification & Verification</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.SELECT}
          name="identificationType"
          label="Identification Type"
          placeholder="Select Identification Type"
        >
          {IdentificationTypes.map(type => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.INPUT}
          name="identificationNumber"
          label="Identification Number"
          placeholder="123456789"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.SKELETON}
          name="identificationDocument"
          label="scanned copy Identification Document"
          renderSkeleton={field => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent & Privacy</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.CHECKBOX}
          name="treatmentConsent"
          label="I consent to treatment"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.CHECKBOX}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.CHECKBOX}
          name="privacyConsent"
          label="I consent to privacy policy"
        />

        <SubmitButton isLoading={isLoading} className="translate-y-3">
          Get Started
        </SubmitButton>
      </form>
    </Form>
  )
}

const FormWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-6 xl:flex-row">{children}</div>
}
