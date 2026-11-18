import { theme } from "../theme";

export const Heading = ({ children }: { children: string }) => (
  <div style={{ position: "absolute", top: 70, left: 110, right: 110, fontFamily: theme.serif, fontSize: 58, color: theme.ink }}>
    {children}
    <div style={{ width: 120, height: 5, background: theme.accent, marginTop: 18 }} />
  </div>
);
