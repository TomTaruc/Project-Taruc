export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0
}

export const validateDate = (date) => {
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selectedDate >= today
}

export const validateAppointmentForm = (data) => {
  const errors = {}

  if (!data.isAnonymous) {
    if (!validateRequired(data.name)) {
      errors.name = 'Name is required'
    }

    if (!validateRequired(data.email)) {
      errors.email = 'Email is required'
    } else if (!validateEmail(data.email)) {
      errors.email = 'Invalid email format'
    }

    if (!validateRequired(data.phone)) {
      errors.phone = 'Phone number is required'
    } else if (!validatePhone(data.phone)) {
      errors.phone = 'Invalid phone number'
    }
  }

  if (!validateRequired(data.date)) {
    errors.date = 'Date is required'
  } else if (!validateDate(data.date)) {
    errors.date = 'Date must be today or in the future'
  }

  if (!validateRequired(data.time)) {
    errors.time = 'Time slot is required'
  }

  if (!validateRequired(data.type)) {
    errors.type = 'Appointment type is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateLoginForm = (data) => {
  const errors = {}

  if (!validateRequired(data.email)) {
    errors.email = 'Email is required'
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format'
  }

  if (!validateRequired(data.password)) {
    errors.password = 'Password is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateRegisterForm = (data) => {
  const errors = {}

  if (!validateRequired(data.name)) {
    errors.name = 'Name is required'
  }

  if (!validateRequired(data.email)) {
    errors.email = 'Email is required'
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format'
  }

  if (!validateRequired(data.password)) {
    errors.password = 'Password is required'
  } else if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (!validateRequired(data.confirmPassword)) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (!validateRequired(data.phone)) {
    errors.phone = 'Phone number is required'
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Invalid phone number'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateAnnouncementForm = (data) => {
  const errors = {}

  if (!validateRequired(data.title)) {
    errors.title = 'Title is required'
  }

  if (!validateRequired(data.content)) {
    errors.content = 'Content is required'
  }

  if (!validateRequired(data.category)) {
    errors.category = 'Category is required'
  }

  if (!validateRequired(data.priority)) {
    errors.priority = 'Priority is required'
  }

  if (!validateRequired(data.expiresAt)) {
    errors.expiresAt = 'Expiration date is required'
  } else if (!validateDate(data.expiresAt)) {
    errors.expiresAt = 'Expiration date must be in the future'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateClientRecordForm = (data) => {
  const errors = {}

  if (!validateRequired(data.sessionType)) {
    errors.sessionType = 'Session type is required'
  }

  if (!validateRequired(data.duration)) {
    errors.duration = 'Duration is required'
  }

  if (!validateRequired(data.counselor)) {
    errors.counselor = 'Counselor name is required'
  }

  if (!validateRequired(data.notes)) {
    errors.notes = 'Session notes are required'
  }

  if (data.followUpRequired && !validateRequired(data.followUpDate)) {
    errors.followUpDate = 'Follow-up date is required when follow-up is needed'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}