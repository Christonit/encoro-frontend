import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  return (
    <form
      action='https://forms.zohopublic.com/christopheralesan/form/encorohelprequest/formperma/12vlZtAv9ZS1gytZm7qbgLFSblOfnRMHp7DKlgyFrJc/htmlRecords/submit'
      name='form'
      id='form'
      method='POST'
      accept-charset='UTF-8'
      className='max-w-[580px]'
      encType='multipart/form-data'
    >
      <input type='hidden' name='zf_referrer_name' value='' />
      {/* <!-- To Track referrals , place the referrer name within the " " in the above hidden input field --> */}
      <input type='hidden' name='zf_redirect_url' value='' />
      {/* ><!-- To redirect to a specific page after record submission , place the respective url within the " " in the above hidden input field --> */}
      <input type='hidden' name='zc_gad' value='' />
      {/* <!-- If GCLID is enabled in Zoho CRM Integration, click details of AdWords Ads will be pushed to Zoho CRM --> */}

      <div className='flex flex-col mb-6'>
        <label className='mb-1 font-medium'>
          Nombre <em className='text-red-500'>*</em>
        </label>
        <Input
          type='text'
          maxLength={255}
          name='Name_First'
          placeholder='Primer Nombre'
          required
        />
      </div>

      <div className='flex flex-col mb-6'>
        <label className='mb-1 font-medium'>
          Apellido <em className='text-red-500'>*</em>
        </label>
        <Input
          type='text'
          maxLength={255}
          name='Name_Last'
          placeholder='Apellido'
          required
        />
      </div>

      <div className='flex flex-col mb-6'>
        <label className='mb-1 font-medium'>
          Email <em className='text-red-500'>*</em>
        </label>
        <Input
          type='email'
          maxLength={255}
          name='Email'
          placeholder=''
          required
        />
      </div>

      <div className='flex flex-col mb-6'>
        <label className='mb-1 font-medium'>
          Asunto <em className='text-red-500'>*</em>
        </label>
        <Textarea
          name='MultiLine'
          maxLength={65535}
          placeholder=''
          required
        />
      </div>

      <div className='my-9 flex gap-6'>
        <Button type='submit' className='py-3 w-full'>
          Contactar a Encoro
        </Button>
      </div>
    </form>
  );
}
