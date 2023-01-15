import {useForm} from 'react-hook-form'
import cn from 'classnames'
import Container from '../components/container'
import {useEffect, useState} from 'react'

enum EContactForm {
  firstName = 'firstName',
  lastName = 'lastName',
  email = 'email',
  phone = 'phone',
  subject = 'subject',
  message = 'message',
}

type ContactForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
}

const WORKER_URL = 'https://worker.testing-apps-wc.workers.dev'
// const WORKER_URL = 'http://169.254.181.3:8787'

export default function Contact() {
  const [response, setResponse] = useState<string>('')
  const {
    handleSubmit,
    register,
    formState: {errors},
    reset,
  } = useForm<ContactForm>({
    defaultValues: {
      firstName: 'Joe',
      lastName: 'Doe',
      email: 'jhon.acme@domain.com',
      phone: '(873) 555-5555',
      subject: 'Just to say hi',
      message: 'Hello there',
    },
  })

  const submitContact = async (data: ContactForm) => {
    const response = await fetch(`${WORKER_URL}/submit-contact`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    setResponse(await response.text())

    reset()
  }

  return (
    <>
      {response && (
        <div className={cn('border-b bg-neutral-50 border-neutral-200')}>
          <Container>
            <div className="py-2 text-center text-sm">{response}</div>
          </Container>
        </div>
      )}
      <div className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12">
        <h3 className="text-lg font-medium text-warm-gray-900">
          Send us a message
        </h3>
        <form
          onSubmit={handleSubmit(submitContact)}
          className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
          noValidate
        >
          <div className="pb-4">
            <label
              htmlFor={EContactForm.firstName}
              className="block text-sm font-medium text-warm-gray-900"
            >
              First name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id={EContactForm.firstName}
                autoComplete="given-name"
                placeholder="Ellen"
                className={`py-3 px-4 block w-full shadow-sm text-warm-gray-900 focus:ring-teal-500 focus:border-teal-500 border-warm-gray-300 rounded-md ${
                  errors.firstName && 'focus-visible:outline-red-500'
                }`}
                {...register('firstName', {
                  required: 'This field is required.',
                })}
              />
            </div>
            {errors.firstName && (
              <span className="absolute text-red-500">
                {errors.firstName.message}
              </span>
            )}
          </div>
          <div className="pb-4">
            <label
              htmlFor={EContactForm.lastName}
              className="block text-sm font-medium text-warm-gray-900"
            >
              Last name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id={EContactForm.lastName}
                autoComplete="family-name"
                placeholder="Ripley"
                className={`py-3 px-4 block w-full shadow-sm text-warm-gray-900 focus:ring-teal-500 focus:border-teal-500 border-warm-gray-300 rounded-md ${
                  errors.lastName && 'focus-visible:outline-red-500'
                }`}
                {...register('lastName', {required: 'This field is required.'})}
              />
            </div>
            {errors.lastName && (
              <span className="absolute text-red-500">
                {errors.lastName.message}
              </span>
            )}
          </div>
          <div className="pb-4">
            <label
              htmlFor={EContactForm.email}
              className="block text-sm font-medium text-warm-gray-900"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                id={EContactForm.email}
                type="email"
                autoComplete="email"
                placeholder="eripley@nostromo.com"
                className={`py-3 px-4 block w-full shadow-sm text-warm-gray-900 focus:ring-teal-500 focus:border-teal-500 border-warm-gray-300 rounded-md ${
                  errors.email && 'focus-visible:outline-red-500'
                }`}
                {...register('email', {required: 'This field is required.'})}
              />
            </div>
            {errors.email && (
              <span className="absolute text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="pb-4">
            <div className="flex justify-between">
              <label
                htmlFor={EContactForm.phone}
                className="block text-sm font-medium text-warm-gray-900"
              >
                Phone
              </label>
              <span id="phone-optional" className="text-sm text-warm-gray-500">
                Optional
              </span>
            </div>
            <div className="mt-1 pb-4">
              <input
                type="text"
                id={EContactForm.phone}
                autoComplete="tel"
                className={`py-3 px-4 block w-full shadow-sm text-warm-gray-900 focus:ring-teal-500 focus:border-teal-500 border-warm-gray-300 rounded-md`}
                {...register('phone')}
              />
            </div>
          </div>
          <div className="sm:col-span-2 pb-4">
            <label
              htmlFor={EContactForm.subject}
              className="block text-sm font-medium text-warm-gray-900"
            >
              Subject
            </label>
            <div className="mt-1">
              <input
                type="text"
                id={EContactForm.subject}
                placeholder="Your example subject"
                className={`py-3 px-4 block w-full shadow-sm text-warm-gray-900 focus:ring-teal-500 focus:border-teal-500 border-warm-gray-300 rounded-md ${
                  errors.subject && 'focus-visible:outline-red-500'
                }`}
                {...register('subject', {required: 'This field is required.'})}
              />
            </div>
            {errors.subject && (
              <span className="absolute text-red-500">
                {errors.subject.message}
              </span>
            )}
          </div>
          <div className="sm:col-span-2 pb-4">
            <div className="flex justify-between">
              <label
                htmlFor={EContactForm.message}
                className="block text-sm font-medium text-warm-gray-900"
              >
                Message
              </label>
              <span id="message-max" className="text-sm text-warm-gray-500">
                Max. 500 characters
              </span>
            </div>
            <div className="mt-1">
              <textarea
                id={EContactForm.message}
                rows={4}
                className={`py-3 px-4 block w-full shadow-sm text-warm-gray-900 focus:ring-teal-500 focus:border-teal-500 border-warm-gray-300 rounded-md ${
                  errors.message && 'focus-visible:outline-red-500'
                }`}
                {...register('message', {required: 'This field is required.'})}
              />
            </div>
            {errors.message && (
              <span className="absolute text-red-500">
                {errors.message.message}
              </span>
            )}
          </div>
          <div className="sm:col-span-2 sm:flex sm:justify-end">
            <button
              type="submit"
              className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:w-auto"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
