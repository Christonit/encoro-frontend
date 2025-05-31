import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ZohoBusinessRequestForm = () => {
  return (
    <form
      action="https://forms.zohopublic.com/christopheralesan/form/encorobusinessrequest/formperma/xNbEzmHwtp7EcV3zWQE-GvrgaeOeW2MyOGIvg6Gfhg0/htmlRecords/submit"
      method="POST"
      acceptCharset="UTF-8"
      encType="multipart/form-data"
      className="max-w-[580px] mx-auto bg-white p-6 rounded-lg shadow"
      target="_blank"
    >
      <input type="hidden" name="zf_referrer_name" value="" />
      <input type="hidden" name="zf_redirect_url" value="" />
      <input type="hidden" name="zc_gad" value="" />

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Nombre</label>
        <Input
          type="text"
          name="Name_First"
          maxLength={255}
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Apellido</label>
        <Input
          type="text"
          name="Name_Last"
          maxLength={255}
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Email</label>
        <Input
          type="text"
          name="Email"
          maxLength={255}
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Dirección</label>
        <Input
          type="text"
          name="SingleLine"
          maxLength={255}
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Instagram</label>
        <Input
          type="text"
          name="SingleLine1"
          maxLength={255}
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Website (opcional)</label>
        <Input
          type="text"
          name="Website"
          maxLength={2083}
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Descripción</label>
        <Textarea
          name="MultiLine"
          maxLength={65535}
        />
      </div>

      <Button type="submit" className="w-full">
        Enviar
      </Button>
    </form>
  );
};

export default ZohoBusinessRequestForm;
