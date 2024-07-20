"use client"

import { Control } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { FC } from "react"
import { FormFieldTypes } from "./forms/PatientForm"
import Image from "next/image"
import "react-phone-number-input/style.css"
import PhoneInput from "react-phone-number-input"
import { E164Number } from "libphonenumber-js/core"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"

interface Props {
  control: Control<any>
  name: string
  label?: string
  placeholder?: string
  iconSrc?: string
  iconAlt?: string
  disabled?: boolean
  dateFormat?: string
  showTimeSelect?: boolean
  children?: React.ReactNode
  renderSkeleton?: (field: any) => React.ReactNode
  fieldType: FormFieldTypes
}

const RenderField = ({ field, props }: { field: any; props: Props }) => {
  switch (props.fieldType) {
    case FormFieldTypes.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              alt={props.iconAlt || "icon"}
              width={24}
              height={24}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      )
    case FormFieldTypes.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="EG"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      )
    case FormFieldTypes.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src={"/assets/icons/calendar.svg"}
            height={24}
            width={24}
            alt="calender"
            className="ml-2"
          />
          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={date => field.onChange(date)}
              dateFormat={props.dateFormat ?? "dd/MM/yyyy"}
              showTimeSelect={props.showTimeSelect ?? false}
              timeInputLabel="Time: "
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      )
    case FormFieldTypes.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null
    case FormFieldTypes.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      )
    case FormFieldTypes.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea border-0"
            disabled={props.disabled}
          />
        </FormControl>
      )
    case FormFieldTypes.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      )
    default:
      break
  }
}

const CustomFormField: FC<Props> = props => {
  const {
    control,
    fieldType,
    dateFormat,
    showTimeSelect,
    children,
    renderSkeleton,
    name,
    disabled,
    iconAlt,
    iconSrc,
    label,
    placeholder,
  } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldTypes.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <RenderField field={field} props={props} />

          <div className="h-4">
            <FormMessage className="shad-error" />
          </div>
        </FormItem>
      )}
    />
  )
}
export default CustomFormField
