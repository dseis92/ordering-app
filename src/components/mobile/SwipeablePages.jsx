import { useNavigate, useLocation } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

const PAGE_ORDER = ["/", "/catering", "/rewards", "/orders", "/about"];

export default function SwipeablePages({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = PAGE_ORDER.indexOf(location.pathname);
      if (currentIndex >= 0 && currentIndex < PAGE_ORDER.length - 1) {
        navigate(PAGE_ORDER[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      const currentIndex = PAGE_ORDER.indexOf(location.pathname);
      if (currentIndex > 0) {
        navigate(PAGE_ORDER[currentIndex - 1]);
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50, // Minimum swipe distance
    preventScrollOnSwipe: false,
  });

  // Only enable swipes on mobile main pages
  const isSwipeablePage = PAGE_ORDER.includes(location.pathname);

  if (!isSwipeablePage) {
    return children;
  }

  return <div {...handlers} className="min-h-screen">{children}</div>;
}
