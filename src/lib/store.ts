import { create } from "zustand";
import {
  type LedgerInputs,
  DEFAULT_INPUTS,
  costsFromChase,
  applyPreset,
} from "./ledger";

type LedgerStore = LedgerInputs & {
  linkage: boolean;
  setField: <K extends keyof LedgerInputs>(key: K, value: LedgerInputs[K]) => void;
  setChase: (chase: number) => void;
  setLinkage: (on: boolean) => void;
  loadPreset: (id: string) => void;
  reset: () => void;
};

export const useLedger = create<LedgerStore>()((set, get) => ({
  ...DEFAULT_INPUTS,
  linkage: true,
  setField: (key, value) => set({ [key]: value } as Partial<LedgerStore>),
  setChase: (chase) => {
    if (get().linkage) set({ chase, ...costsFromChase(chase) });
    else set({ chase });
  },
  setLinkage: (on) => {
    if (on) set({ linkage: true, ...costsFromChase(get().chase) });
    else set({ linkage: false });
  },
  loadPreset: (id) => set({ ...applyPreset(id), linkage: true }),
  reset: () => set({ ...DEFAULT_INPUTS, linkage: true }),
}));
