import { useEffect } from "react";

export default function useOutsideClick(
  ref: any,
  open: boolean,
  onOutsideClick: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (!ref.current) return;
      const element = event.target as HTMLElement;
      if (!ref.current.contains(element) && open) {
        onOutsideClick();
      }
    }

    if (open) {
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);

      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [ref, open, onOutsideClick]);
}
