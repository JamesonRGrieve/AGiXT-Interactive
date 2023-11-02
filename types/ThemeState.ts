import { Context, createContext } from "react";

export type ThemeState = {
  dark: boolean,
  colorblind: boolean,
  mutate: any
}
export const ThemeContext: Context<ThemeState> = createContext<ThemeState>({
  dark: false,
  colorblind: false,
  mutate: null
});