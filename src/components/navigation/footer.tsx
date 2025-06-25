import { type ReactElement, type ReactNode } from "react";
import {
  AiFillLinkedin,
  AiFillInstagram,
  AiFillTwitterCircle,
} from "react-icons/ai";
import ZohoForm from "@/components/embeds/ZohoForm";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="justify-center items-center bg-slate-900 flex flex-col z-[50] relative px-[20px]">
      <div className="w-full max-w-[1408px] py-[64px] lg:py-[32px] max-md:max-w-full">
        <div className="flex flex-col lg:grid grid-cols-3">
          <div className="flex flex-col items-stretch max-md:w-full max-md:ml-0">
            <div className="flex flex-col lg:mb-0 items-start md:pr-[64px]">
              <h4 className="justify-center text-white text-2xl  self-stretch whitespace-nowrap mb-[16px] lg:mb-[24px]">
                Acerca de Encoro
              </h4>
              <div className="text-white text-sm font-light  self-stretch">
                <p className="text-white text-base text-opacity-70">
                  Este es un proyecto que busca convertirse en un directorio
                  donde puedes encontrar actividades de diversas categorías para
                  tu entretenimiento, todo según el día que desees o según la
                  ubicación que indiques.
                  {/* <a
                    href="#"
                    className="font-medium text-white ml-[4px]"
                    role="link"
                  >
                    Aprende mas
                  </a> */}
                </p>
              </div>

              <div className="flex gap-[12px]">
                {/* <a
                  href="#"
                  className="px-[4px] py-[4px] ml-[-4px] text-white"
                  target="_blank"
                >
                  <AiFillLinkedin size={24} />
                </a> */}
                <Link
                  href="https://www.instagram.com/encoro.activities"
                  className="px-[4px] py-[4px] text-white"
                  target="_blank"
                >
                  <AiFillInstagram size={24} />
                </Link>
                {/* <a
                  href="#"
                  className="px-[4px] py-[4px] text-white"
                  target="_blank"
                >
                  <AiFillTwitterCircle size={24} />
                </a> */}
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-stretch ml-5 max-md:w-full max-md:ml-0">
            <div className="flex grow flex-col gap-[12px]">
              <h4 className="justify-center text-white text-2xl  self-stretch whitespace-nowrap mb-[12px]">
                Enlaces de interés
              </h4>

              <Link href="/contact/" className="text-base text-white">
                Contacto
              </Link>

              <Link href="/privacy-policy/" className="text-base text-white">
                Politicas de Privacidad
              </Link>

              <Link href="/terms-of-service/" className="text-base text-white">
                Términos y Condiciones
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-stretch ml-5 max-md:w-full max-md:ml-0">
            <div className="items-stretch flex flex-col max-md:mt-10">
              <ZohoForm />
              {/* <h4
                className="justify-center text-white text-2xl mb-[16px] lg:mb-[24px]"
                role="heading"
              >
                Subscribete al newsletter
              </h4>
              <div className="justify-between items-center rounded bg-white flex h-[40px] rounded-[8px] overflow-hidden">
                <input
                  id="newsletter-input"
                  type="text"
                  className="text-slate-900 text-left text-base my-auto !w-full py-0 h-[40px] px-[16px] w-auto"
                  aria-label="Newsletter Input"
                  role="textbox"
                  placeholder="Email"
                />
                <button
                  className=" text-center bg-red-500 hover:bg-red-600 text-white h-full w-full max-w-[144px] font-semibold "
                  role="button"
                  aria-label="Subscribe"
                >
                  Subscribirse
                </button>
              </div>
              <div className="text-white text-opacity-70 text-sm font-light leading-5 mt-4">
                Esta es la mejor manera de enterarse de las novedades de Encoro,
                no hay marketing ni promociones, asi que tranquil@, no tendras
                spam.
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="items-stretch flex w-full max-w-[1408px] justify-between gap-[20px] lg:gap-5 py-9 border-slate-700 border-t border-solid max-md:max-w-full max-md:flex-wrap">
        <img
          loading="lazy"
          src="/logo-white.svg"
          className="h-[24px] lg:h-[32px] mx-auto lg:!mr-auto"
          alt="Alejandro Crafts"
        />
        <div
          className="justify-center text-right text-white text-opacity-70 text-base font-light leading-5 self-center grow shrink basis-auto my-auto ml-auto"
          role="contentinfo"
        >
          © {new Date().getFullYear()}
          {/* - Hecho por
          <Link
            target='_blank'
            href='https://chsantana.com/'
            className='text-white'
            role='link'
          >
            &nbsp;Christopher&nbsp;Santana
          </Link> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
