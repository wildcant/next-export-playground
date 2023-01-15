/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  MY_BUCKET: R2Bucket

  AIRTABLE_API_KEY: string
  AIRTABLE_BASE_ID: string
  AIRTABLE_TABLE_NAME: string
  FORM_URL: string
}

type ContactForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
}

type AirTableFormSubmissionsRecord = {
  fields: {
    'First Name': string
    'Last Name': string
    Email: string
    'Phone Number': string
    Subject: string
    Message: string
  }
}

const createAirtableRecord = (
  env: Env,
  record: AirTableFormSubmissionsRecord,
) => {
  return fetch(
    `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(
      env.AIRTABLE_TABLE_NAME,
    )}`,
    {
      method: 'POST',
      body: JSON.stringify(record),
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_API_KEY}`,
        'Content-type': `application/json`,
      },
    },
  )
}

export default {
  async fetch(
    request: Request,
    env: Env,
    // ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url)

    let response: Response

    switch (request.method) {
      case 'POST': {
        if (url.pathname === '/submit-contact') {
          if (!request.body) {
            response = new Response('Invalid content', {status: 400})
            break
          }
          const {firstName, lastName, email, phone, subject, message} =
            (await request.json()) as ContactForm

          const reqBody: AirTableFormSubmissionsRecord = {
            fields: {
              'First Name': firstName,
              'Last Name': lastName,
              Email: email,
              'Phone Number': phone,
              Subject: subject,
              Message: message,
            },
          }

          const res = await createAirtableRecord(env, reqBody)
          if (!res.ok) {
            // TODO: Log there was an error adding a new record to air table.
          }

          response = new Response('Form submitted successfully.')
          break
        }

        response = new Response("Endpoint doesn't exist.", {status: 404})
        break
      }

      default:
        response = new Response('Method not allowed', {status: 405})
    }

    response.headers.set(
      'Access-Control-Allow-Origin',
      'https://blog-3wt.pages.dev',
    )

    return response
  },
}
