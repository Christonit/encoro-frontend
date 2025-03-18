import dayjs from "dayjs";
import Link from "next/link";
import { BUSINESS_ILUSTRATIONS } from "@/libs/variables";

dayjs.locale("es-do");

const BusinessProfileCard = () => {
  return (
    <div
      id="business-profile-card"
      className="flex items-start flex-col md:flex-row gap-[20px]"
    >
      <span className="business-profile-card-picture border-solid border-slate-100 border p-2 min-w-[132px] min-h-[132px]">
        <img
          src={`/images/illustration/${BUSINESS_ILUSTRATIONS[0]}.svg`}
          alt="Boilerplate Business Ilustration"
          className="w-full h-full object-cover"
        />
      </span>

      <div className="flex flex-col gap-[12px]">
        <span className="inline-flex flex-start items-center font-semibold text-slate-900 no-underline">
          <span className="text-base">Publicado por la administración</span>
        </span>

        <span className="flex flex-end  items-start text-slate-600  w-full lg:pr-[32px]">
          <div className="w-full min-w-[300px]">
            <p className="text-sm mb-[12px] leading-tight pr-[36px] md:pr-0">
              Evento publicado de manera automatizada por Encoro.
            </p>

            <p className="text-sm mb-[24px]">
              <u>¿Conoces o eres el individuo o negocio autor?</u> Ayúdanos a
              ponernos en contacto para facilitar la creación de una cuenta en
              Encoro, lo que permitirá publicar gratuitamente sus próximas
              actividades en esta plataforma.
            </p>

            <Link
              href="/contact/"
              className="border-solid border-slate-200 border px-[12px] rounded-[4px] py-[4px] !no-underline hover:bg-slate-100 inline-flex items-center gap-[8px] hover:text-slate-900 font-semibold text-slate-900 text-small"
            >
              Contactar Encoro
            </Link>
          </div>
        </span>
      </div>
    </div>
  );
};

export default BusinessProfileCard;
