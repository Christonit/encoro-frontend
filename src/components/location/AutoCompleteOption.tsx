import { useState } from "react";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import { useWindow } from "../../hooks";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
const AutoCompleteOption = ({
  id,
  label = "",
  onClick,
}: {
  id: string;
  label: string;
  onClick: () => void;
}) => {
  const [show, setShow] = useState(false);

  const { windowWidth, resolution } = useWindow();
  return windowWidth > resolution.lg && label.length > 64 ? (
    <OverlayTrigger
      placement="left"
      key={id}
      overlay={
        <Tooltip id={id}>
          <span className="!text-left text-sm">{label}</span>
        </Tooltip>
      }
    >
      <Button
        variant="clear"
        className="location-select-item"
        onClick={onClick}
      >
        {label}
      </Button>
    </OverlayTrigger>
  ) : (
    <Button variant="clear" className="location-select-item" onClick={onClick}>
      {label}
    </Button>
  );
};

export default AutoCompleteOption;
