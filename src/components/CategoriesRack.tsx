import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";

type CategoryI = {
  label: string;
  value: string;
};

type CategoriesRackProps = {
  activeCategory: string;
  categories: CategoryI[];
  onClickHandler: (value: string) => void;
};
export const CategoriesRack = ({
  categories,
  onClickHandler,
  activeCategory,
}: CategoriesRackProps) => {
  const CategoriesContainer = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState<boolean>(true);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);
  const scrollAmount = 250;

  const handleScroll = () => {
    if (!CategoriesContainer.current) return;

    const container = CategoriesContainer.current;
    setIsAtStart(container.scrollLeft === 0);
    setIsAtEnd(
      container.scrollLeft + container.clientWidth === container.scrollWidth
    );
  };

  const smoothScroll = (
    element: HTMLDivElement,
    targetScroll: number,
    duration: number
  ) => {
    const startScroll = element.scrollLeft;
    const distance = targetScroll - startScroll;
    const startTime = performance.now();

    const scrollStep = (timestamp: number) => {
      const currentTime = timestamp - startTime;
      const newScroll = easeInOutQuad(
        currentTime,
        startScroll,
        distance,
        duration
      );
      element.scrollLeft = newScroll;

      if (currentTime < duration) {
        requestAnimationFrame(scrollStep);
      }
    };

    const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(scrollStep);
  };

  // Adjust the scrollLeft smoothly
  const smoothScrollLeft = (
    container: HTMLDivElement,
    amount: number,
    duration: number
  ) => {
    const targetScroll = container.scrollLeft - amount;
    smoothScroll(container, targetScroll, duration);
  };

  const smoothScrollRight = (
    container: HTMLDivElement,
    amount: number,
    duration: number
  ) => {
    const targetScroll = container.scrollLeft + amount;
    smoothScroll(container, targetScroll, duration);
  };

  // Modify your scrollLeft and scrollRight functions to use smooth scrolling
  const scrollLeft = () => {
    if (!CategoriesContainer.current) return;
    const container = CategoriesContainer.current;
    smoothScrollLeft(container, scrollAmount, 200); // Adjust the duration as needed (e.g., 300ms)
  };

  const scrollRight = () => {
    if (!CategoriesContainer.current) return;
    const container = CategoriesContainer.current;
    smoothScrollRight(container, scrollAmount, 200); // Adjust the duration as needed (e.g., 300ms)
  };

  useEffect(() => {
    if (!CategoriesContainer.current) return;

    const container = CategoriesContainer.current;
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative h-[33px] w-full lg:w-auto overflow-hidden">
      {!isAtStart && categories.length > 6 && (
        <div className="category-scroll-btn-container left">
          <Button className="category-scroll-btn" onClick={scrollLeft}>
            <AiOutlineLeft />
          </Button>
        </div>
      )}
      <div ref={CategoriesContainer} className="categories-container">
        {categories.map((category, i) => (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClickHandler(category.value);
            }}
            className={`pill primary ${
              activeCategory === category.value ? "active" : ""
            }`}
            key={i}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {!isAtEnd && categories.length > 6 && (
        <div className="category-scroll-btn-container">
          <Button className="category-scroll-btn" onClick={scrollRight}>
            <AiOutlineRight />
          </Button>
        </div>
      )}
    </div>
  );
};
