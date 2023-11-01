import {
  BaseSyntheticEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useScrollTrigger } from "@mui/material";
import type { ContactFormInput } from "@/context/Contact";

/** ============================= CONTACT FORM ============================= */

type ContactForm = {
  form: ContactFormInput;
  defaultForm: ContactFormInput;
  setForm: Dispatch<SetStateAction<ContactFormInput>>;
  onChange: (e: BaseSyntheticEvent) => void;
  addPhone: () => void;
  updatePhone: (i: number) => (e: BaseSyntheticEvent) => void;
  removePhone: (i: number) => () => void;
};

export const useContactForm = (): ContactForm => {
  let defaultForm: ContactFormInput = {
    first_name: "",
    last_name: "",
    phones: [{ number: "" }],
  };

  const [form, setForm] = useState(defaultForm);

  const onChange = (e: BaseSyntheticEvent) => {
    setForm((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const addPhone = () => {
    setForm((v) => {
      let phones = [...v.phones];
      phones.push({ number: "" });
      return { ...v, phones };
    });
  };

  const updatePhone = (i: number) => (e: BaseSyntheticEvent) => {
    setForm((v) => {
      let phones = [...v.phones];
      phones[i] = { ...phones[i], number: e.target.value };
      return { ...v, phones };
    });
  };

  const removePhone = (i: number) => () => {
    setForm((v) => {
      let phones = [...v.phones.slice(0, i), ...v.phones.slice(i + 1)];
      return { ...v, phones };
    });
  };

  return {
    form,
    defaultForm,
    setForm,
    onChange,
    addPhone,
    updatePhone,
    removePhone,
  };
};

/** ============================= SCROLL HELPERS ============================= */

export const useScrolled = () =>
  useScrollTrigger({
    target:
      typeof window !== "undefined"
        ? (document.getElementById("main") as Node)
        : undefined,
  });

export const useDetectScrolledToBottom = () => {
  const [isBottom, setIsBottom] = useState(false);
  useEffect(() => {
    const el = document.getElementById("main") as HTMLElement;
    const onScrolling = () => {
      setIsBottom(
        Math.round(el.scrollTop) >= el.scrollHeight - el.offsetHeight
      );
    };

    el && el.addEventListener("scroll", onScrolling, false);

    return () => {
      el && el.removeEventListener("scroll", onScrolling, false);
    };
  }, []);

  return isBottom;
};

/** ============================= ETC ============================= */

export const useDetectShiftKey = () => {
  const [shiftHeld, setShiftHeld] = useState(false);

  const downHandler = (e: KeyboardEvent) => {
    if (e.key === "Shift") setShiftHeld(true);
  };

  const upHandler = (e: KeyboardEvent) => {
    if (e.key === "Shift") setShiftHeld(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return shiftHeld;
};

export const useDebounce = <T extends (...args: any[]) => void | Promise<void>>(cb: T, timeout: number) => {
  let timeoutRef = useRef<NodeJS.Timeout | undefined>();

  return (...args: Parameters<T>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      cb(...args);
    }, timeout);
  };
};
