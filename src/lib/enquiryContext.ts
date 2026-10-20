import { createContext, useContext } from "react";

export type EnquiryPreset = {
  bakeId?: string;
  flavour?: string;
  /** "celebration" opens the form framed around an occasion. */
  intent?: "celebration";
};

export const EnquiryContext = createContext<(preset?: EnquiryPreset) => void>(
  () => {},
);

/** Returns a function that opens the enquiry form, optionally pre-filled. */
export const useEnquiry = () => useContext(EnquiryContext);
