import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { bakes, cakeBuilder } from "@/config/menu";
import { contact, enquiry, links, policies } from "@/config/site";
import { EnquiryContext, type EnquiryPreset } from "@/lib/enquiryContext";
import {
  NOT_SURE,
  composeMessage,
  findBake,
  isoDateFromToday,
  primaryChannel,
  submitToSheet,
  whatsappLink,
  type Channel,
  type EnquiryDetails,
  type Photo,
} from "@/lib/enquiry";
import {
  buttonPrimary,
  buttonQuiet,
  buttonSecondary,
  textLink,
} from "@/lib/ui";
import { Camera, Check, Close, Info, Instagram, WhatsApp } from "./Icons";

const empty: EnquiryDetails = {
  name: "",
  phone: "",
  bakeId: "",
  flavour: "",
  filling: "",
  ganache: "",
  toppings: [],
  date: "",
  quantity: "",
  occasion: "",
  fulfilment: "",
  notes: "",
};

const occasions = [
  "Birthday",
  "Anniversary",
  "Gift",
  "Get-together",
  "Festival",
  "Just because",
  "Other",
];
const fulfilmentOptions = [
  "Self-pickup",
  "Delivery via Porter (charged extra)",
  "Not sure yet",
];

type Errors = Partial<Record<keyof EnquiryDetails, string>>;

type Result =
  | { channel: "sheet"; ref: string | null }
  | { channel: "whatsapp"; url: string }
  | { channel: "instagram"; message: string; copied: boolean };

const field =
  "block w-full min-h-12 rounded-xl border border-cocoa/30 bg-white px-4 py-3 text-base text-cocoa placeholder:text-cocoa-soft/70 outline-offset-1 aria-[invalid=true]:border-cherry";
const selectField = `${field} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%2338231e' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")] bg-[length:12px_8px] bg-[position:right_1rem_center] bg-no-repeat pr-10`;

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [intent, setIntent] = useState<EnquiryPreset["intent"]>();
  const [details, setDetails] = useState<EnquiryDetails>(empty);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [photoError, setPhotoError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [announce, setAnnounce] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);

  const channel = primaryChannel();
  const titleId = useId();

  const reset = useCallback(() => {
    setDetails(empty);
    setPhotos((current) => {
      current.forEach((p) => URL.revokeObjectURL(p.preview));
      return [];
    });
    setErrors({});
    setPhotoError("");
    setSubmitError("");
    setResult(null);
  }, []);

  const open = useCallback(
    (preset: EnquiryPreset = {}) => {
      // A finished enquiry starts fresh; an unfinished one keeps what was typed.
      if (result) reset();
      setIntent(preset.intent);
      if (preset.bakeId || preset.intent) {
        setDetails((d) => ({
          ...d,
          bakeId:
            preset.bakeId ??
            (preset.intent === "celebration" ? "cake" : d.bakeId),
          flavour: preset.flavour ?? "",
          filling: "",
          ganache: "",
          toppings: [],
        }));
      }
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    },
    [reset, result],
  );

  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.style.overflow = "";
      if (window.location.hash === "#enquire")
        history.replaceState(null, "", " ");
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // takepause.in/#enquire opens the form directly — handy for Instagram bios.
  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash === "#enquire") open();
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [open]);

  const bake = findBake(details.bakeId);
  const needsFilling = details.flavour.includes("filling of choice");
  const needsGanache = details.flavour.includes("ganache");
  const minDate = isoDateFromToday(enquiry.minLeadDays);
  const phoneRequired = channel === "sheet";

  const set = <K extends keyof EnquiryDetails>(
    key: K,
    value: EnquiryDetails[K],
  ) => {
    setDetails((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!details.bakeId)
      e.bakeId = "Choose what you'd like, or pick “Not sure yet”.";
    if (!details.date) e.date = "Choose your preferred date.";
    else if (details.date < minDate)
      e.date = "Please choose a date from tomorrow onwards — we bake to order.";
    if (!details.quantity.trim())
      e.quantity = "Tell us roughly how much you need.";
    if (!details.name.trim()) e.name = "Please add your name.";
    const digits = details.phone.replace(/\D/g, "");
    if (phoneRequired && !digits)
      e.phone = "Add a phone number so we can reply.";
    else if (details.phone.trim() && (digits.length < 10 || digits.length > 13))
      e.phone = "That number doesn't look quite right — please check it.";
    return e;
  };

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    setPhotoError("");
    const room = enquiry.maxPhotos - photos.length;
    const incoming = Array.from(files);
    const accepted: Photo[] = [];
    for (const file of incoming) {
      const isImage =
        file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
      if (!isImage) {
        setPhotoError(`"${file.name}" isn't an image.`);
        continue;
      }
      if (file.size > enquiry.photoMaxMb * 1024 * 1024) {
        setPhotoError(
          `"${file.name}" is larger than ${enquiry.photoMaxMb} MB.`,
        );
        continue;
      }
      if (accepted.length >= room) {
        setPhotoError(`You can add up to ${enquiry.maxPhotos} photos.`);
        break;
      }
      accepted.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      });
    }
    setPhotos((p) => [...p, ...accepted]);
  };

  const removePhoto = (id: string) =>
    setPhotos((current) => {
      const photo = current.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return current.filter((p) => p.id !== id);
    });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    const found = validate();
    setErrors(found);
    const invalid = Object.keys(found) as (keyof EnquiryDetails)[];
    if (invalid.length) {
      setAnnounce(
        `Please check ${invalid.length} field${invalid.length > 1 ? "s" : ""}.`,
      );
      event.currentTarget
        .querySelector<HTMLElement>(`[name="${invalid[0]}"]`)
        ?.focus();
      return;
    }

    if (channel === "sheet") {
      setSending(true);
      try {
        const { ref } = await submitToSheet(
          details,
          photos,
          honeypot.current?.value ?? "",
        );
        setResult({ channel, ref });
      } catch (err) {
        setSubmitError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      } finally {
        setSending(false);
      }
      return;
    }

    const message = composeMessage(details);
    if (channel === "whatsapp") {
      const url = whatsappLink(message)!;
      window.open(url, "_blank", "noopener,noreferrer");
      setResult({ channel, url });
      return;
    }

    if (channel === "instagram") {
      // Copy inside the click so the browser allows it; Instagram opens from
      // the next screen, after the visitor knows what to paste.
      const copied = await navigator.clipboard?.writeText(message).then(
        () => true,
        () => false,
      );
      setResult({ channel, message, copied: Boolean(copied) });
    }
  };

  // Results land at the top of the panel, where a screen reader expects them.
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (result) panelRef.current?.scrollTo({ top: 0 });
  }, [result]);

  const title =
    intent === "celebration" ? "Plan something sweet" : "Enquire to order";

  return (
    <EnquiryContext.Provider value={open}>
      {children}

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-0 h-dvh max-h-none w-full max-w-none flex-col overflow-hidden bg-cream p-0 text-cocoa backdrop:bg-cocoa/55 open:flex sm:m-auto sm:h-auto sm:max-h-[min(92dvh,58rem)] sm:max-w-2xl sm:rounded-[1.75rem] sm:border sm:border-cocoa/15 sm:shadow-[0_24px_60px_-20px_rgba(56,35,30,0.45)]"
      >
        <header className="flex items-center justify-between gap-4 border-b border-cocoa/15 px-5 py-4 sm:px-8">
          <h2 id={titleId} className="text-[1.6rem] sm:text-[1.9rem]">
            {title}
          </h2>
          <button
            type="button"
            onClick={close}
            className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-cocoa hover:bg-rose-soft"
          >
            <Close width={22} height={22} />
            <span className="sr-only">Close</span>
          </button>
        </header>

        <div
          ref={panelRef}
          className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-8 sm:px-8"
        >
          {result ? (
            <ResultPanel result={result} details={details} onDone={close} />
          ) : channel === null ? (
            <Unavailable />
          ) : (
            <form noValidate onSubmit={submit} className="space-y-8">
              <p className="text-cocoa-soft">
                Tell us what you'd like and when. We'll reply to confirm
                availability and price —{" "}
                <strong className="font-semibold text-cocoa">
                  nothing is booked until then.
                </strong>
              </p>

              <Fieldset legend="What would you like?">
                <Field label="Bake" required error={errors.bakeId}>
                  {(a) => (
                    <select
                      {...a}
                      name="bakeId"
                      className={selectField}
                      value={details.bakeId}
                      onChange={(e) =>
                        setDetails((d) => ({
                          ...d,
                          bakeId: e.target.value,
                          flavour: "",
                          filling: "",
                          ganache: "",
                          toppings: [],
                        }))
                      }
                    >
                      <option value="" disabled>
                        Choose a bake
                      </option>
                      {bakes.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} · {b.size}
                        </option>
                      ))}
                      <option value={NOT_SURE}>
                        Not sure yet — help me choose
                      </option>
                    </select>
                  )}
                </Field>

                {bake && bake.flavours.length > 0 && (
                  <Field
                    label={
                      bake.filter === "cakes"
                        ? "Sponge and frosting"
                        : "Flavour"
                    }
                  >
                    {(a) => (
                      <select
                        {...a}
                        name="flavour"
                        className={selectField}
                        value={details.flavour}
                        onChange={(e) =>
                          setDetails((d) => ({
                            ...d,
                            flavour: e.target.value,
                            filling: "",
                            ganache: "",
                          }))
                        }
                      >
                        <option value="">Undecided — happy to discuss</option>
                        {bake.flavours.map((f) => (
                          <option key={f.name} value={f.name}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                )}

                {(needsFilling || needsGanache) && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {needsFilling && (
                      <Field label="Filling">
                        {(a) => (
                          <select
                            {...a}
                            name="filling"
                            className={selectField}
                            value={details.filling}
                            onChange={(e) => set("filling", e.target.value)}
                          >
                            <option value="">Undecided</option>
                            {cakeBuilder.fillings.map((f) => (
                              <option key={f}>{f}</option>
                            ))}
                          </select>
                        )}
                      </Field>
                    )}
                    {needsGanache && (
                      <Field label="Ganache">
                        {(a) => (
                          <select
                            {...a}
                            name="ganache"
                            className={selectField}
                            value={details.ganache}
                            onChange={(e) => set("ganache", e.target.value)}
                          >
                            <option value="">Undecided</option>
                            {cakeBuilder.frostings
                              .filter((f) => f.includes("ganache"))
                              .map((f) => (
                                <option key={f}>{f}</option>
                              ))}
                          </select>
                        )}
                      </Field>
                    )}
                  </div>
                )}

                {bake?.addOns && (
                  <fieldset>
                    <legend className="mb-2 font-semibold">
                      {bake.addOns.label}{" "}
                      <span className="font-normal text-cocoa-soft">
                        (optional)
                      </span>
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {bake.addOns.items.map((t) => {
                        const checked = details.toppings.includes(t.name);
                        return (
                          <label
                            key={t.name}
                            className={`relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-[0.95rem] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cherry ${
                              checked
                                ? "border-cherry bg-cherry text-cream"
                                : "border-cocoa/30 bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={() =>
                                set(
                                  "toppings",
                                  checked
                                    ? details.toppings.filter(
                                        (x) => x !== t.name,
                                      )
                                    : [...details.toppings, t.name],
                                )
                              }
                            />
                            {checked && <Check width={16} height={16} />}
                            {t.name}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                )}
              </Fieldset>

              <Fieldset legend="When, and how much?">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Preferred date"
                    required
                    error={errors.date}
                    hint={policies.leadTimeShort}
                  >
                    {(a) => (
                      <input
                        {...a}
                        type="date"
                        name="date"
                        min={minDate}
                        className={field}
                        value={details.date}
                        onChange={(e) => set("date", e.target.value)}
                      />
                    )}
                  </Field>
                  <Field
                    label="Quantity or serving size"
                    required
                    error={errors.quantity}
                    hint={
                      bake
                        ? `Priced per ${bake.size.toLowerCase()}`
                        : "e.g. 1 cake, 2 boxes"
                    }
                  >
                    {(a) => (
                      <input
                        {...a}
                        name="quantity"
                        autoComplete="off"
                        placeholder={
                          bake?.size.startsWith("Box")
                            ? "e.g. 2 boxes"
                            : "e.g. 1 kg, serves 10"
                        }
                        className={field}
                        value={details.quantity}
                        onChange={(e) => set("quantity", e.target.value)}
                      />
                    )}
                  </Field>
                </div>
              </Fieldset>

              <Fieldset legend="The occasion" optional>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Occasion">
                    {(a) => (
                      <select
                        {...a}
                        name="occasion"
                        className={selectField}
                        value={details.occasion}
                        onChange={(e) => set("occasion", e.target.value)}
                      >
                        <option value="">Choose one</option>
                        {occasions.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <Field label="Pickup or delivery">
                    {(a) => (
                      <select
                        {...a}
                        name="fulfilment"
                        className={selectField}
                        value={details.fulfilment}
                        onChange={(e) => set("fulfilment", e.target.value)}
                      >
                        <option value="">Choose one</option>
                        {fulfilmentOptions.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    )}
                  </Field>
                </div>

                <Field
                  label="Notes"
                  hint="Design ideas, a message on the cake, colours, anything we should know."
                >
                  {(a) => (
                    <textarea
                      {...a}
                      name="notes"
                      rows={4}
                      className={`${field} resize-y`}
                      value={details.notes}
                      onChange={(e) => set("notes", e.target.value)}
                    />
                  )}
                </Field>

                {channel === "sheet" ? (
                  <PhotoPicker
                    photos={photos}
                    error={photoError}
                    onAdd={addPhotos}
                    onRemove={removePhoto}
                  />
                ) : (
                  <p className="flex gap-3 rounded-xl bg-rose-soft px-4 py-3 text-[0.95rem] text-cocoa">
                    <Camera className="mt-0.5 shrink-0" />
                    Have a reference photo? You can share it in the chat once
                    your message is ready.
                  </p>
                )}
              </Fieldset>

              <Fieldset legend="Your details">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" required error={errors.name}>
                    {(a) => (
                      <input
                        {...a}
                        name="name"
                        autoComplete="name"
                        className={field}
                        value={details.name}
                        onChange={(e) => set("name", e.target.value)}
                      />
                    )}
                  </Field>
                  <Field
                    label={phoneRequired ? "Phone or WhatsApp" : "Phone"}
                    required={phoneRequired}
                    optional={!phoneRequired}
                    error={errors.phone}
                  >
                    {(a) => (
                      <input
                        {...a}
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+91"
                        className={field}
                        value={details.phone}
                        onChange={(e) => set("phone", e.target.value)}
                      />
                    )}
                  </Field>
                </div>
              </Fieldset>

              {/* Hidden from people; bots tend to fill every field they find. */}
              <div
                aria-hidden="true"
                className="absolute -left-[9999px] h-px w-px overflow-hidden"
              >
                <label>
                  Website
                  <input
                    ref={honeypot}
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              <div className="space-y-4 border-t border-cocoa/15 pt-6">
                <p className="flex gap-3 text-[0.95rem] text-cocoa-soft">
                  <Info className="mt-0.5 shrink-0 text-cherry" />
                  <span>
                    This is an enquiry, not a confirmed order.{" "}
                    {policies.confirmation}
                  </span>
                </p>

                {submitError && (
                  <p
                    role="alert"
                    className="rounded-xl border border-cherry/40 bg-rose-soft px-4 py-3 text-cherry-deep"
                  >
                    {submitError}
                    {links.whatsapp || links.instagramDm ? (
                      <>
                        {" "}
                        You can also{" "}
                        <a
                          className={textLink}
                          href={
                            whatsappLink(composeMessage(details)) ??
                            links.instagramDm!
                          }
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          message us on{" "}
                          {links.whatsapp ? "WhatsApp" : "Instagram"}
                        </a>
                        .
                      </>
                    ) : null}
                  </p>
                )}

                <button
                  type="submit"
                  className={`${buttonPrimary} w-full sm:w-auto`}
                  disabled={sending}
                >
                  {sending ? "Sending…" : <SubmitLabel channel={channel} />}
                </button>
                <p className="sr-only" aria-live="polite">
                  {sending ? "Sending your enquiry" : announce}
                </p>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </EnquiryContext.Provider>
  );
}

function SubmitLabel({ channel }: { channel: Channel }) {
  if (channel === "whatsapp")
    return (
      <>
        <WhatsApp /> Continue on WhatsApp
      </>
    );
  if (channel === "instagram")
    return (
      <>
        <Instagram /> Copy enquiry for Instagram
      </>
    );
  return <>Send enquiry</>;
}

function Fieldset({
  legend,
  optional,
  children,
}: {
  legend: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-4 font-display text-[1.3rem] font-medium">
        {legend}{" "}
        {optional && (
          <span className="font-sans text-sm font-normal text-cocoa-soft">
            (optional)
          </span>
        )}
      </legend>
      {children}
    </fieldset>
  );
}

type FieldA11y = {
  id: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
};

function Field({
  label,
  required,
  optional,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: (a11y: FieldA11y) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-semibold">
        {label}
        {required && (
          <span className="text-cherry" aria-hidden="true">
            {" "}
            *
          </span>
        )}
        {optional && (
          <span className="font-normal text-cocoa-soft"> (optional)</span>
        )}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
      })}
      {hint && (
        <p id={hintId} className="mt-1.5 text-sm text-cocoa-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-semibold text-cherry">
          {error}
        </p>
      )}
    </div>
  );
}

function PhotoPicker({
  photos,
  error,
  onAdd,
  onRemove,
}: {
  photos: Photo[];
  error: string;
  onAdd: (files: FileList | null) => void;
  onRemove: (id: string) => void;
}) {
  const id = useId();
  const full = photos.length >= enquiry.maxPhotos;

  return (
    <div>
      <p id={`${id}-label`} className="mb-1.5 font-semibold">
        Reference photos{" "}
        <span className="font-normal text-cocoa-soft">
          (optional, up to {enquiry.maxPhotos})
        </span>
      </p>
      {!full && (
        <div className="relative">
          <input
            id={id}
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            className="peer sr-only"
            aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
            onChange={(e) => {
              onAdd(e.target.files);
              e.target.value = "";
            }}
          />
          <label
            htmlFor={id}
            className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-cocoa/30 bg-white px-4 py-5 text-center hover:border-cherry peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cherry"
          >
            <Camera className="text-cherry" width={24} height={24} />
            <span className="font-semibold text-cherry">Add photos</span>
            <span id={`${id}-help`} className="text-sm text-cocoa-soft">
              A cake you love, a theme, a colour palette — JPG, PNG or HEIC
            </span>
          </label>
        </div>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-sm font-semibold text-cherry"
        >
          {error}
        </p>
      )}
      {photos.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-3" aria-label="Selected photos">
          {photos.map((p) => (
            <li key={p.id} className="relative">
              <img
                src={p.preview}
                alt={p.file.name}
                width={96}
                height={96}
                className="size-24 rounded-xl border border-cocoa/15 bg-cream-deep object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                className="absolute -top-2 -right-2 inline-flex size-8 items-center justify-center rounded-full bg-cocoa text-cream hover:bg-cherry"
              >
                <Close width={16} height={16} />
                <span className="sr-only">Remove {p.file.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ResultPanel({
  result,
  details,
  onDone,
}: {
  result: Result;
  details: EnquiryDetails;
  onDone: () => void;
}) {
  const followUp =
    result.channel === "sheet"
      ? whatsappLink(composeMessage(details, 0, result.ref ?? undefined))
      : null;

  return (
    <div role="status" className="space-y-6">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-rose text-cherry">
        {result.channel === "sheet" ? (
          <Check width={28} height={28} />
        ) : result.channel === "whatsapp" ? (
          <WhatsApp width={28} height={28} />
        ) : (
          <Instagram width={28} height={28} />
        )}
      </span>

      {result.channel === "sheet" && (
        <>
          <h3 className="text-[2rem]">
            Thank you, {details.name.trim().split(" ")[0]}.
          </h3>
          <p className="lede">
            Your enquiry has reached us
            {result.ref && (
              <>
                {" "}
                — reference{" "}
                <strong className="font-semibold text-cocoa">
                  {result.ref}
                </strong>
              </>
            )}
            . We'll get back to you on {details.phone} to confirm availability,
            the final price and pickup or delivery.
          </p>
        </>
      )}

      {result.channel === "whatsapp" && (
        <>
          <h3 className="text-[2rem]">Almost there.</h3>
          <p className="lede">
            WhatsApp should have opened with your enquiry written out.{" "}
            <strong className="font-semibold text-cocoa">
              It isn't sent until you press send in WhatsApp.
            </strong>
          </p>
          <p className="text-cocoa-soft">
            Didn't open? Use the button below. You can attach reference photos
            in the chat.
          </p>
          <a
            href={result.url}
            target="_blank"
            rel="noreferrer noopener"
            className={buttonSecondary}
          >
            <WhatsApp /> Open WhatsApp
          </a>
        </>
      )}

      {result.channel === "instagram" && (
        <>
          <h3 className="text-[2rem]">
            {result.copied ? "Copied. Now paste it to us." : "One more step."}
          </h3>
          <p className="lede">
            {result.copied
              ? `Your enquiry is on your clipboard. Open Instagram, paste it into a message to @${contact.instagram} and press send.`
              : `Copy the enquiry below, then paste it into a message to @${contact.instagram} on Instagram.`}{" "}
            You can attach reference photos in the chat.
          </p>
          <label className="block">
            <span className="mb-1.5 block font-semibold">Your enquiry</span>
            <textarea
              readOnly
              rows={8}
              value={result.message}
              onFocus={(e) => e.currentTarget.select()}
              className={`${field} font-mono text-sm`}
            />
          </label>
          <a
            href={links.instagramDm!}
            target="_blank"
            rel="noreferrer noopener"
            className={buttonPrimary}
          >
            <Instagram /> Open Instagram
          </a>
        </>
      )}

      <p className="flex gap-3 rounded-xl bg-butter/60 px-4 py-3 text-[0.95rem] text-cocoa">
        <Info className="mt-0.5 shrink-0 text-cherry" />
        <span>
          This isn't a confirmed order yet. We'll check the date with you first
          — {policies.confirmation.charAt(0).toLowerCase()}
          {policies.confirmation.slice(1)}
        </span>
      </p>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onDone} className={buttonQuiet}>
          Back to the site
        </button>
        {followUp && (
          <a
            href={followUp}
            target="_blank"
            rel="noreferrer noopener"
            className={buttonSecondary}
          >
            <WhatsApp /> Also message us on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

function Unavailable() {
  return (
    <div className="space-y-4">
      <h3 className="text-[1.8rem]">Online enquiries are opening soon.</h3>
      <p className="lede">
        We're still setting up our enquiry inbox. Please check back shortly —
        we'd love to bake for you.
      </p>
    </div>
  );
}
