import { MouseEvent } from "react";
const OnHoverDropdown = ({
  children,
  parent,
  onMouseLeave,
}: {
  parent: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
}) => {
  //   const [show, setShow] = useState(false);

  return (
    <div className="dropdown-element" onMouseLeave={onMouseLeave}>
      {parent}
      <div className="dropdown-wrapper">
        <div className="dropdown-wrapper-content">{children}</div>
      </div>
    </div>
  );
};

export default OnHoverDropdown;
