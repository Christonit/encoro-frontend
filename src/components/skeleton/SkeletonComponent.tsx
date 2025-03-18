export const EventsHomeSkeleton = () => {
  return (
    <section className="mb-[32px]">
      <h2 className="skeleton-title alt max-w-[320px] mb-[24px]"></h2>
      <div className="cols skeleton grid-area ">
        <div className="card  event-card-skeleton col grid-1">
          <div className="event-card-skeleton-text px-[20px] py-[20px]">
            <h2 className="skeleton-title"></h2>
            <div className="flex gap-[16px] align-items-center">
              <span className="skeleton-badge"></span>
              <span className="horizontal divider white h-[16px]"></span>
              <span className="text-skeleton-small"></span>
            </div>
          </div>
        </div>
        <div className="card event-card-skeleton   col grid-2">
          <div className="event-card-skeleton -text px-[20px] py-[20px]">
            <span className="skeleton-badge mb-[16px]"></span>
            <h2 className="skeleton-title"></h2>
            <div className="flex gap-[16px] align-items-center">
              <span className="text-skeleton-small"></span>
            </div>
          </div>
        </div>
        <div className="card  event-card-skeleton col grid-3 special-grid  ">
          <div className="event-card-skeleton-text px-[20px] py-[20px]">
            <span className="skeleton-badge mb-[16px]"></span>
            <h2 className="skeleton-title"></h2>
            <div className="flex gap-[16px] align-items-center">
              <span className="text-skeleton-small"></span>
            </div>
          </div>
        </div>
        <div className="card   col grid-4 special-grid">
          <span />
          <div className="event-card-skeleton  !bg-slate-100 px-[20px] py-[20px] flex flex-column justify-content-end ml-auto w-full">
            <div>
              <span className=" skeleton-badge mb-[16px]"></span>
              <h2 className="skeleton-title"></h2>
              <span className="text-label text-white text-skeleton-small"></span>
            </div>
          </div>
        </div>
        <div className="card  event-card-skeleton col grid-2">
          <div className="event-card-skeleton-text px-[20px] py-[20px]">
            <span className=" skeleton-badge mb-[16px]"></span>
            <h2 className="skeleton-title"></h2>
            <div className="flex gap-[16px] align-items-center">
              <span className="text-skeleton-small"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
