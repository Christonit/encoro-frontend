import { ReactElement, useEffect, useRef } from 'react';
import { AiOutlineCheckCircle, AiOutlineClose } from 'react-icons/ai';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const StatusModal = ({
  type = 'success',
  message,
  show,
  title,
  closeModal,
  handleAction,
  handleActionText,
}: {
  type: 'success' | 'warning' | 'error';
  message?: string;
  title?: string;
  handleActionText?: string;
  show: boolean;
  closeModal: () => void;
  handleAction?: () => void;
}) => {
  const modal = useRef<HTMLDivElement | null>(null);

  const heading = () => {
    let message: ReactElement | undefined;
    switch (type) {
      case 'success':
        message = (
          <img
            src='/images/illustration/success-1.svg'
            alt='Evento Publicado Exitosamente Imagen'
            className='w-full h-full object-cover max-w-[200px] mb-[24px]'
          />
        );
        break;
      case 'warning':
        message = <></>;
        break;
      case 'error':
        message = <></>;
        break;
    }

    return message;
  };
  const footer = () => {
    let button: ReactElement | undefined;
    switch (type) {
      case 'success':
      case 'warning':
        button = (
          <Button variant='primary' onClick={closeModal}>
            Continuar
          </Button>
        );
        break;
      case 'error':
        button = (
          <>
            <Button variant='secondary' onClick={closeModal}>
              Cerrar
            </Button>
            {handleAction && (
              <Button variant='primary' onClick={handleAction}>
                {handleActionText}
              </Button>
            )}
          </>
        );
        break;
    }

    return button;
  };

  return (
    <Modal
      centered
      ref={modal}
      show={show}
      onHide={closeModal}
      id='status-modal'
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className=' flex items-center flex-col'>
          {heading()}
          {title && <h3 className='mt-[20px]'>{title}</h3>}
        </div>

        {message && (
          <div className='text-center  px-[20px] lg:px-32px'>
            <p className='text-md text-slate-700 mb-0 mt-[8px]'>{message}</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className='justify-center py-[32px]'>
        {footer()}
      </Modal.Footer>
    </Modal>
  );
};

export default StatusModal;
