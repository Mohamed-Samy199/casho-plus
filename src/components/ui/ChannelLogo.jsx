import vodafoneCashLogo from "../../assets/vodafone-cash-logo.webp";
import instapayLogo from "../../assets/instapay-logo.webp";

const CHANNEL_LOGOS = {
  vodafone_cash: vodafoneCashLogo,
  instapay: instapayLogo,
};

const CHANNEL_NAMES = {
  vodafone_cash: "فودافون كاش",
  instapay: "إنستا باي",
};

export function ChannelLogo({ channel, showLabel = true, size = "md" }) {
  const src = CHANNEL_LOGOS[channel];
  if (!src) return showLabel ? <span>{CHANNEL_NAMES[channel] || channel || "—"}</span> : null;

  const dimensions = size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  return (
    <span className="inline-flex items-center gap-2">
      <img src={src} alt={CHANNEL_NAMES[channel] || "قناة الدفع"} className={`${dimensions} rounded-md object-contain`} />
      {showLabel && <span>{CHANNEL_NAMES[channel]}</span>}
    </span>
  );
}

export function ChannelLogoOnly({ channel, size = "md" }) {
  return <ChannelLogo channel={channel} showLabel={false} size={size} />;
}
