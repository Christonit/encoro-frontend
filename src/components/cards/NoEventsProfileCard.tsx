const NoEventsProfileCard = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <img
        src="/images/illustration/no-agenda.svg"
        className="w-full max-w-[200px] md:max-w-[400px] mx-auto mb-[32px]"
      />

      <p className="text-[16px] lg:text-[24px] text-center font-light leading-normal !text-slate-500 mb-0">
        Actualmente no estás dando seguimiento a ningún evento.
      </p>
    </div>
  );
};

export default NoEventsProfileCard;
