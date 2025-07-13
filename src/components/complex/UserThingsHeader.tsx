import { useRouter } from "next/router";
import { TitleH1 } from "@/components/ui/TitleH1";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const UserThingsHeader = ({ session }: { session: any }) => {
  const router = useRouter();
  const currentPath = router.pathname;
  return (
    <section className="bg-white border-b border-slate-100 py-8">
      <div className="container mx-auto flex flex-col">
        <TitleH1 className="mb-4">Mis cosas</TitleH1>
        <div className="flex items-center mb-8">
          {session?.user?.image && (
            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
              <Image
                src={session.user.image}
                alt={session.user.name || "avatar"}
                width={32}
                height={32}
                className="object-cover"
                onError={(e) => {
                  // Hide the image if it fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          )}
          <span className="font-medium text-slate-900 text-base">
            {session?.user?.name}
          </span>
          {/* Example stats, replace with real data if available */}
          <span className="text-slate-500 text-base border-l border-slate-200 pl-3 ml-3">
            10 Eventos • 5 Organizadores
          </span>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <Button
            variant="secondary"
            className={
              "rounded-full" +
              (currentPath === "/user/my-schedule"
                ? " bg-slate-900 text-white disabled:bg-slate-900 disabled:text-white"
                : "")
            }
            disabled={currentPath === "/user/my-schedule"}
            onClick={() => router.push("/user/my-schedule")}
          >
            Mi agenda
          </Button>
          <Button
            variant="secondary"
            className={
              "rounded-full" +
              (currentPath === "/user/followed"
                ? " bg-slate-900 text-white"
                : "")
            }
            disabled={currentPath === "/user/followed"}
            onClick={() => router.push("/user/followed")}
          >
            Perfiles seguidos
          </Button>
        </div>
      </div>
    </section>
  );
};
