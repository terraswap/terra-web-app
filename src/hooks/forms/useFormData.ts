import _ from "lodash"
import { useEffect, useState } from "react"
import { UseFormWatch } from "react-hook-form"

const useFormData = <FormData = any>(
  watch: UseFormWatch<any>,
  defaultValues: FormData
) => {
  const fd = watch()
  const [formData, setFormData] = useState<FormData>(defaultValues)

  useEffect(() => {
    if (!_.isEqual(fd, formData)) {
      setFormData(fd)
    }
  }, [fd, formData])

  return formData
}

export default useFormData
