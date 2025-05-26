import React from "react";
import { Button, Form } from "react-bootstrap";

const ZohoBusinessRequestForm = () => {
  return (
    <Form
      action="https://forms.zohopublic.com/christopheralesan/form/encorobusinessrequest/formperma/xNbEzmHwtp7EcV3zWQE-GvrgaeOeW2MyOGIvg6Gfhg0/htmlRecords/submit"
      method="POST"
      acceptCharset="UTF-8"
      encType="multipart/form-data"
      className="max-w-[580px]"
      target="_blank"
    >
      <input type="hidden" name="zf_referrer_name" value="" />
      <input type="hidden" name="zf_redirect_url" value="" />
      <input type="hidden" name="zc_gad" value="" />

      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="Name_First"
          maxLength="255"
          placeholder=""
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Apellido</Form.Label>
        <Form.Control
          type="text"
          name="Name_Last"
          maxLength="255"
          placeholder=""
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="text" name="Email" maxLength="255" placeholder="" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Dirección</Form.Label>
        <Form.Control
          type="text"
          name="SingleLine"
          maxLength="255"
          placeholder=""
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Instagram</Form.Label>
        <Form.Control
          type="text"
          name="SingleLine1"
          maxLength="255"
          placeholder=""
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Website (opcional)</Form.Label>
        <Form.Control
          type="text"
          name="Website"
          maxLength="2083"
          placeholder=""
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          name="MultiLine"
          maxLength="65535"
          placeholder=""
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Enviar
      </Button>
    </Form>
  );
};

export default ZohoBusinessRequestForm;
