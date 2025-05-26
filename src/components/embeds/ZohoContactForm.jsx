import { Button, Form } from "react-bootstrap";

export default function ContactForm() {
  return (
    <form
      action='https://forms.zohopublic.com/christopheralesan/form/encorohelprequest/formperma/12vlZtAv9ZS1gytZm7qbgLFSblOfnRMHp7DKlgyFrJc/htmlRecords/submit'
      name='form'
      id='form'
      method='POST'
      accept-charset='UTF-8'
      className='max-w-[580px]'
      enctype='multipart/form-data'
    >
      <input type='hidden' name='zf_referrer_name' value='' />
      {/* <!-- To Track referrals , place the referrer name within the " " in the above hidden input field --> */}
      <input type='hidden' name='zf_redirect_url' value='' />
      {/* ><!-- To redirect to a specific page after record submission , place the respective url within the " " in the above hidden input field --> */}
      <input type='hidden' name='zc_gad' value='' />
      {/* <!-- If GCLID is enabled in Zoho CRM Integration, click details of AdWords Ads will be pushed to Zoho CRM --> */}

      <div className='flex flex-col mb-[24px]'>
        <Form.Label>
          Nombre
          <em>*</em>
        </Form.Label>

        <input
          type='text'
          maxlength='255'
          name='Name_First'
          fieldType='7'
          placeholder='Primer Nombre'
          className='form-control'
        />
      </div>

      <div className='flex flex-col mb-[24px]'>
        <Form.Label>
          Apellido
          <em>*</em>
        </Form.Label>
        <input
          type='text'
          maxlength='255'
          name='Name_Last'
          fieldType='7'
          className='form-control'
          placeholder='Apellido'
        />
      </div>

      <div className='flex flex-col mb-[24px]'>
        <Form.Label>
          Email
          <em>*</em>
        </Form.Label>

        <input
          type='text'
          maxlength='255'
          name='Email'
          value=''
          fieldType='9'
          className='form-control'
          placeholder=''
        />
      </div>

      <div className='flex flex-col mb-[24px]'>
        <Form.Label>
          Asunto
          <em>*</em>
        </Form.Label>
        <textarea
          name='MultiLine'
          maxlength='65535'
          placeholder=''
          className='form-control'
        ></textarea>
      </div>

      <div className='my-[36px] flex gap-[24px]'>
        <Button variant='primary' type='submit' className='py-[12px]'>
          Contactar a Encoro
        </Button>
      </div>
    </form>
  );
}
