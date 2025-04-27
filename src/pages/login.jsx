import Head from "next/head";
import {
  signIn,
  getCsrfToken,
  getProviders,
  getSession,
} from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import Link from "next/link";
import { AiOutlineArrowLeft } from "react-icons/ai";

const Signin = ({ csrfToken, providers }) => {
  let random_number = Math.floor(Math.random() * 5) + 1;

  return (
    <>
      <Head>
        <title>Inicia sesión o crea tu cuenta - Encoro</title>

        <meta
          name="description"
          content="Encuentra tus activides favoritas en tu ciudad, filtradas por categoría y fecha. Busca eventos cerca de ti y sigue a los que te interesen para estar al tanto de las últimas novedades."
        />
        <meta
          name="keywords"
          content="actividades, eventos, bares, restaurantes, tourism, concerts, discotecas, encuentra"
        />
        {/* <meta name='robots' content='index, follow' /> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://encoro.app/" />
        <link rel="canonical" href="https://encoro.app/" />
        <meta
          property="og:title"
          content="Inicia sesión o crea tu cuenta - Encoro"
        />
        <meta
          property="og:description"
          content="Encuentra tus activides favoritas en tu ciudad, filtradas por categoría y fecha. Busca eventos cerca de ti y sigue a los que te interesen para estar al tanto de las últimas novedades."
        />
        <meta
          property="og:image"
          content="https://encoro.app/images/encoro-cover.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Inicia sesión o crea tu cuenta - Encoro"
        />
        <meta
          name="twitter:description"
          content="Encuentra  tus activides favoritas en tu ciudad, filtradas por categoría y fecha. Busca eventos cerca de ti y sigue a los que te interesen para estar al tanto de las últimas novedades."
        />
        <meta
          name="twitter:image"
          content="https://encoro.app/images/encoro-cover.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        id="login-page"
        className="h-[100vh] flex items-center justify-center"
        style={{
          backgroundImage: `url(/images/pexels-bg-${random_number}.webp)`,
        }}
      >
        <Container className="">
          <div className="bg-white border-solid border-slate-100 border py-[32px] pb-[64px]  lg:py-[64px] px-[32px] lg:px-[64px] max-w-[540px] flex flex-col items-center  gap-[32px]  w-full rounded-[8px]">
            <Link href="/" alt="App Logo">
              <Image
                src="/images/logo.svg"
                width="196"
                height="64"
                alt="App Logo"
                className="lg:mb-[32px] max-w-[164px]"
              />
            </Link>

            <div className="lg:mb-[124px] flex flex-col">
              <h3 className="text-2xl font-semibold text-slate-900 mb-[24px] mx-auto block text-center leading-none">
                Inicia sesión <br className="md:hidden" /> o crea tu cuenta
              </h3>
              <p className="text-base lg:text-lg text-slate-500 mb-[32px] lg:mb-[64px] text-center">
                Puedes iniciar sesión o crear una cuenta fácilmente con tan solo
                un click, totalmente gratis.
              </p>

              <div className="mx-auto inline-flex justify-center flex-col gap-[16px]">
                {providers && providers.google && (
                  <Button
                    className=" px-[12px] max-h-[40px] font-semibold flex items-center "
                    variant="outline-secondary"
                    onClick={() => signIn(providers.google.id)}
                  >
                    <img
                      src="/images/icons/google.svg"
                      alt="Google"
                      className="h-[24px] w-[24px]"
                    />
                    Continuar con {providers.google.name}
                  </Button>
                )}
                {providers && providers.facebook && (
                  <Button
                    className=" px-[12px] max-h-[40px] font-semibold flex items-center "
                    variant="outline-secondary"
                    onClick={() => signIn(providers.facebook.id)}
                  >
                    <img
                      src="/images/icons/facebook.svg"
                      alt="Google"
                      className="h-[20px] w-[20px] mr-[4px]"
                    />
                    Continuar con {providers.facebook.name}
                  </Button>
                )}

                <Button
                  variant="link"
                  onClick={() => (window.location.href = "/")}
                  className=" mt-[16px] flex items-center border-0 gap-[8px] justify-center no-underline text-slate-500 px-[12px] max-h-[36px] font-semibold hover:bg-slate-100"
                >
                  <AiOutlineArrowLeft size={16} />
                  Volver al inicio
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Signin;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return { redirect: { destination: "/" } };
  }
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  return {
    props: {
      providers,
      csrfToken,
    },
  };
}
